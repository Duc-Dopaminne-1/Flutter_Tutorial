import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useReducer, useRef, useState} from 'react';
import {Keyboard} from 'react-native';
import {useSelector} from 'react-redux';

import {PostServiceType, useGetUserByIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/appContext';
import {getUserId} from '../../../appData/user/selectors';
import {
  CommissionCurrencyUnit,
  CONSTANTS,
  FETCH_POLICY,
  GLOBAL_ACTIONS,
  NEW_POST_MODAL_STATE,
  NEW_POST_STEP,
  NEWPOST_FIELD,
  PAGE_CHILD_TYPE,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import CustomButton from '../../../components/Button/CustomButton';
import CustomAgreementComponent from '../../../components/CustomAgreementComponent';
import {BadWordModal} from '../../../components/Modal/BadWordModal';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import {Captcha} from '../../../components/RecaptchaV2/Captcha';
import Configs from '../../../configs';
import {useAgreePolicy} from '../../../hooks/useAgreePolicy';
import ArrayUtils from '../../../utils/ArrayUtils';
import {extractAddressData, shallowCompareObj} from '../../../utils/DataProcessUtil';
import {downloadFileAzure} from '../../../utils/fileHandler';
import {
  getLegalInfoDescriptionById,
  getPropertyPostApprovalStatusDescriptionById,
} from '../../../utils/GetMasterData';
import {getUserFullName} from '../../../utils/UserAgentUtil';
import ValidateInput from '../../../utils/ValidateInput';
import {useMount} from '../../commonHooks';
import {formatDirection} from '../../Home/TopenerOfMonth/types';
import ScreenIds from '../../ScreenIds';
import {TrackingActions} from '../../WithSegment';
import PropertyPostUtils from '../PropertyPostUtils';
import {NewPostContext} from '../useNewPost';
import {
  useCreateC2CPropertyPost,
  useHandleErrorPropertyPost,
  useSaveDraftPropertyPost,
  useUpdateC2CPropertyPost,
  useUpdateSavedDraftC2CPropertyPost,
} from '../usePropertyPostActions';
import BasePostAnimationScreen from './BasePostAnimationScreen';
import GetGuaranteedPackages from './hooks/useGetGuaranteedPackages';
import {DELETE_ITEM, plusServiceList} from './NewPostComponents/NewPostConstant';
import NewPostContactInfoContainer from './NewPostComponents/NewPostContactInfoContainer';
import NewPostModalContainer from './NewPostComponents/NewPostModalContainer';
import TimeLineProcessComponent from './NewPostComponents/TimeLineProcessComponent';
import {mapPlusServicesOptions} from './NewPostUtils';

const NEW_POST_ACTIONS = {
  SAVE_DRAFT: 1,
  CREATE: 2,
  PREVIEW: 3,
  UPDATE: 4,
  UPDATE_SAVED_DRAFT: 5,
};

const validateContactInfo = contactInfo => {
  const ownerIsAuthor = contactInfo.ownerIsAuthor;
  const userPhoneNumber = contactInfo.ownerPhoneNumber;
  const userEmail = contactInfo.ownerEmail;
  const userName = contactInfo.ownerName;
  const errorState = {
    ownerPhoneNumber: ownerIsAuthor ? '' : ValidateInput.checkMobilePhone(userPhoneNumber),
    ownerName: ownerIsAuthor ? '' : ValidateInput.checkName(userName),
    ownerEmail: isEmpty(userEmail) || ownerIsAuthor ? '' : ValidateInput.checkEmail(userEmail),
  };
  const isValid = !Object.values(errorState).some(item => item !== '');
  return {
    ...errorState,
    isValid,
  };
};

const mapInputState = ({state, currentUserName, currentUserEmail, currentUserPhoneNumber}) => {
  return {
    ownerIsAuthor: state.ownerIsAuthor,
    owner: {
      customerFullName: state.ownerIsAuthor ? currentUserName : state?.ownerName ?? '',
      customerPhone: state.ownerIsAuthor ? currentUserPhoneNumber : state?.ownerPhoneNumber ?? '',
      customerEmail: state.ownerIsAuthor ? currentUserEmail : state?.ownerEmail ?? '',
    },
    postServiceType: state?.postServiceType,
    guaranteedPackageId:
      state?.postServiceType === PostServiceType.Guaranteed ? state?.guaranteedPackageId : '',
    forSale: true,
    forRent: false,
  };
};

function reducer(state, action) {
  let newState = {...state};
  switch (action.type) {
    case GLOBAL_ACTIONS.CHANGE_DATA:
      newState = {...state, ...action.payload};
      return newState;
    case GLOBAL_ACTIONS.SET_ERROR_STATE:
      return {...state, errorState: action.payload};
    case GLOBAL_ACTIONS.CHANGE_OWNER_INFO:
      const ownerIsAuthor = action.payload;

      const errorOwnerName = ownerIsAuthor ? '' : ValidateInput.checkName(state?.ownerName);
      const errorOwnerPhoneNumber = ownerIsAuthor
        ? ''
        : ValidateInput.checkMobilePhone(state?.ownerPhoneNumber);
      const errorOwnerEmail =
        isEmpty(state?.ownerEmail) || ownerIsAuthor
          ? ''
          : ValidateInput.checkEmail(state?.ownerEmail);

      const userInfoErrors = {
        ownerName: errorOwnerName,
        ownerPhoneNumber: errorOwnerPhoneNumber,
        ownerEmail: errorOwnerEmail,
      };

      newState = {...state, ownerIsAuthor};
      return {...newState, errorState: {...state?.errorState, ...userInfoErrors}};
    case GLOBAL_ACTIONS.FIELD:
      let errors = {...state?.errorState};

      switch (action?.fieldName) {
        case NEWPOST_FIELD.ownerName:
          errors = {...errors, ownerName: ValidateInput.checkName(action.payload)};
          break;
        case NEWPOST_FIELD.ownerPhoneNumber:
          errors = {...errors, ownerPhoneNumber: ValidateInput.checkMobilePhone(action.payload)};
          break;
        case NEWPOST_FIELD.ownerEmail:
          errors = {
            ...errors,
            ownerEmail: isEmpty(action.payload) ? '' : ValidateInput.checkEmail(action.payload),
          };
          break;
      }
      newState = {...state, [action.fieldName]: action.payload, errorState: errors};
      return {...newState};
    case GLOBAL_ACTIONS.CHANGE_PACKAGE:
      return {...newState, ...action?.payload};
    default:
      return newState;
  }
}

const mapContactInfo = moduleState => {
  const {customerFullName, customerPhone, customerEmail} = moduleState?.step4Data?.owner ?? {};
  const step4Data = moduleState?.step4Data;

  const uiModal = {
    ownerIsAuthor: step4Data?.ownerIsAuthor === false ? false : true,
    ownerEmail: customerEmail || '',
    ownerName: customerFullName || '',
    ownerPhoneNumber: customerPhone || '',
    errorState: {
      ownerEmail: '',
      ownerName: '',
      ownerPhoneNumber: '',
    },
    modalizeState: NEW_POST_MODAL_STATE.CONFIRM_EDIT,
    postServiceType: step4Data?.postServiceType ?? PostServiceType.Normal,
    guaranteedPackageId: step4Data?.guaranteedPackageId ?? null,
    guaranteedPackages: [],
    postType: {
      forSale: true,
      forRent: false,
    },
    isPrivate: moduleState?.isPrivate,
    step1Valid: moduleState?.step1Valid,
    step2Valid: moduleState?.step2Valid,
    step3Valid: moduleState?.step3Valid,
    step4Valid: false,
  };
  return uiModal;
};

const mapGuaranteedPackages = (selectedPackageId, packages: Array) => {
  if (ArrayUtils.hasArrayData(packages)) {
    const mappingList = packages?.map(e => ({
      id: e?.guaranteedPackageId ?? e?.id,
      name: e?.guaranteedPackageDescription ?? e?.name,
      value: e?.guaranteedPackageValidMonths ?? e?.value ?? 3,
      checked:
        !isEmpty(selectedPackageId) &&
        (e?.guaranteedPackageId === selectedPackageId || e?.id === selectedPackageId),
    }));
    return mappingList;
  } else {
    return [];
  }
};

const NewPostContactInfoScreen = ({navigation, route}) => {
  const {reload} = route?.params || {};
  const userId = useSelector(getUserId);
  const {track} = useAnalytics();

  const agreePolicy = useAgreePolicy(PAGE_CHILD_TYPE.TERMS_OF_USE);

  const captchaRef = useRef(null);
  const modalizeRef = useRef(null);

  const {
    state: moduleState,
    isEdit,
    setInputFieldState,
    parseToGetEditData,
  } = useContext(NewPostContext);

  const {getMasterData} = useContext(AppContext);

  const [state, dispatch] = useReducer(reducer, mapContactInfo(moduleState));
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (reload) {
      dispatch({
        type: GLOBAL_ACTIONS.CHANGE_DATA,
        payload: {
          step1Valid: moduleState?.step1Valid,
          step2Valid: moduleState?.step2Valid,
          step3Valid: moduleState?.step3Valid,
          step4Valid: false,
        },
      });
    }
  }, [reload, moduleState.step2Valid, moduleState.step3Valid, moduleState.step1Valid]);

  const isModified = isEdit
    ? !shallowCompareObj(
        PropertyPostUtils.mapping(
          {
            ...moduleState,
            step4Data: {
              ...moduleState.step4Data,
              ...mapInputState({
                state,
                currentUserName: getUserFullName(userData),
                currentUserPhoneNumber: userData?.phoneNumber,
                currentUserEmail: userData?.email,
              }),
            },
          },
          isEdit,
        ),
        PropertyPostUtils.mapping(
          {
            ...parseToGetEditData(moduleState.originState),
          },
          isEdit,
        ),
        true,
      )
    : true;

  // must call from parent, because showSpinner only works on parent layer
  const {startApi: getUserInfo} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userById',
    onSuccess: response => {
      setUserData(response?.userDto);
    },
  });

  const {getGuaranteedPackagesQuery} = GetGuaranteedPackages({
    onSuccess: response => {
      const mappingData = mapGuaranteedPackages(state?.guaranteedPackageId, response);
      const guaranteedPackageId = mappingData?.find(
        e => e.checked && e.id !== CONSTANTS.UNCHECK_DROPDOWN_ID,
      )?.id;
      const defaultItem = {
        ...DELETE_ITEM,
        checked: false,
      };
      mappingData.unshift(defaultItem);
      dispatch({
        type: GLOBAL_ACTIONS.CHANGE_PACKAGE,
        payload: {guaranteedPackages: mappingData, guaranteedPackageId},
      });
    },
  });

  const onSuccessCreate = createdPropertyPost => {
    if (!isEmpty(createdPropertyPost)) {
      const propertyInfo = createdPropertyPost?.propertyPostDto ?? {};
      const approvalStatusDescription = getPropertyPostApprovalStatusDescriptionById(
        getMasterData(),
        propertyInfo?.propertyPostApprovalStatusId,
      );
      const legalInfo = getLegalInfoDescriptionById(
        getMasterData(),
        moduleState?.step1Data?.legalInfoId,
      );

      let emptyValue;

      track(TrackingActions.createPostSucceeded, {
        service_package:
          propertyInfo?.postServiceType === PostServiceType.Guaranteed
            ? 'Tin đăng đảm bảo'
            : 'Tin đăng thường',
        plus_services: mapPlusServicesOptions(
          moduleState?.step2Data?.supportRequestTypeIds,
          plusServiceList,
        )
          ?.filter(e => e.checked)
          ?.map(e => e.description)
          ?.join(','),
        property_type: moduleState?.step1Data?.propertyTypeDescription ?? '',
        project: moduleState?.step1Data?.projectInfo?.projectName ?? '',
        address: extractAddressData(moduleState?.step1Data?.propertyAddress, false, true),
        street: moduleState?.step1Data?.propertyAddress?.streetName ?? '',
        ward: moduleState?.step1Data?.propertyAddress?.wardName ?? '',
        district: moduleState?.step1Data?.propertyAddress?.districtName ?? '',
        city: moduleState?.step1Data?.propertyAddress?.cityName ?? '',
        longitude: propertyInfo?.longitude ?? 0,
        latitude: propertyInfo?.latitude ?? 0,
        price: propertyInfo?.price ?? 0,
        commission: propertyInfo?.commission,
        commission_type:
          moduleState?.step1Data?.saleCommissionCurrencyUnitId === CommissionCurrencyUnit.PERCENTAGE
            ? '%'
            : 'VND',
        negotiable: propertyInfo?.negotiable ?? false,
        apartment_area: propertyInfo?.buildingArea || emptyValue,
        length: propertyInfo?.length ?? moduleState?.step1Data?.length ?? emptyValue,
        width: propertyInfo?.width ?? moduleState?.step1Data?.width ?? emptyValue,
        block: propertyInfo?.blockName || emptyValue,
        floor: propertyInfo?.floor || emptyValue,
        direction: formatDirection(propertyInfo?.direction) ?? '',
        floor_number: propertyInfo?.numberOfFloor || emptyValue,
        bedroom_number: propertyInfo?.numberOfBedrooms || emptyValue,
        bathroom_number: propertyInfo?.numberOfBathrooms || emptyValue,
        property_status: approvalStatusDescription ?? '',
        consultancy_name: moduleState?.step3Data?.chosenAgent?.fullName ?? '',
        consultancy_group: moduleState?.step3Data?.chosenAgent?.staffGroupDescription ?? '',
        streetview_display: propertyInfo?.isShowGoogleStreetView ?? false,
        sovereignty: legalInfo || emptyValue,
      });

      navigation.navigate(ScreenIds.NewPostSuccessScreen, {
        title: translate(STRINGS.POST_SUCCESSFULLY),
        description: translate(STRINGS.POST_SUCCESS_DES),
      });
    }
  };

  const onSuccessSaveDraft = saveDraftResponse => {
    if (!isEmpty(saveDraftResponse)) {
      navigation.navigate(ScreenIds.NewPostSuccessScreen, {
        title: translate(STRINGS.SAVE_DRAFT_SUCCESSFULLY),
        isShowDraft: true,
      });
    }
  };

  const onSuccessUpdate = updateResponse => {
    if (!isEmpty(updateResponse)) {
      navigation.navigate(ScreenIds.NewPostSuccessScreen, {
        title: translate(
          moduleState?.isPrivate ? STRINGS.POST_SUCCESSFULLY : STRINGS.UPDATE_POST_SUCCESSFUL,
        ),
        description: moduleState?.isPrivate ? translate(STRINGS.POST_SUCCESS_DES) : null,
      });
    }
  };

  const {errorData, onSetError} = useHandleErrorPropertyPost({navigation});

  const {createC2CPropertyPost} = useCreateC2CPropertyPost({
    state: moduleState,
    onSuccess: onSuccessCreate,
    onError: onSetError,
  });
  const {saveDraftPropertyPost} = useSaveDraftPropertyPost({
    state: moduleState,
    onSuccess: onSuccessSaveDraft,
    onError: onSetError,
  });
  const {updateC2CPropertyPost} = useUpdateC2CPropertyPost({
    state: moduleState,
    onSuccess: onSuccessUpdate,
    onError: onSetError,
  });

  const {updateSavedDraftC2CPropertyPost} = useUpdateSavedDraftC2CPropertyPost({
    state: moduleState,
    onSuccess: onSuccessSaveDraft,
    onError: onSetError,
  });

  const validateContactAndPushPropertyPost = ({action = NEW_POST_ACTIONS.PREVIEW, captcha}) => {
    const newErrorState = validateContactInfo(state);
    setErrorState(newErrorState);
    if (newErrorState.isValid) {
      const contactState = mapInputState({
        state,
        currentUserName: getUserFullName(userData),
        currentUserPhoneNumber: userData?.phoneNumber,
        currentUserEmail: userData?.email,
      });

      setInputFieldState({
        step4Data: {
          ...moduleState?.step4Data,
          ...contactState,
        },
        step4Valid: true,
      });

      const createC2CPropertyPostInput = {
        ...moduleState,
        tokenCaptcha: captcha ?? '',
        step4Data: {
          ...moduleState?.step4Data,
          ...contactState,
        },
      };

      switch (action) {
        case NEW_POST_ACTIONS.CREATE:
          track(TrackingActions.createPostStep4, {
            owner: contactState.ownerIsAuthor || false,
            owner_name: contactState.owner.customerFullName,
            owner_phonenumber: contactState.owner.customerPhone,
            owner_email: contactState.owner.customerEmail,
          });
          createC2CPropertyPost(createC2CPropertyPostInput);
          break;
        case NEW_POST_ACTIONS.SAVE_DRAFT:
          saveDraftPropertyPost(createC2CPropertyPostInput);
          break;
        case NEW_POST_ACTIONS.UPDATE:
          updateC2CPropertyPost(createC2CPropertyPostInput);
          break;
        case NEW_POST_ACTIONS.UPDATE_SAVED_DRAFT:
          updateSavedDraftC2CPropertyPost(createC2CPropertyPostInput);
          break;
        case NEW_POST_ACTIONS.PREVIEW:
          navigation.navigate(ScreenIds.ReviewPropertyPost);
          break;
      }
    }
  };

  const setErrorState = errorState => {
    dispatch({type: GLOBAL_ACTIONS.SET_ERROR_STATE, payload: {...errorState}});
  };

  const onDismissPopup = () => {
    modalizeRef?.current?.close();
  };

  const onShowPopup = () => {
    modalizeRef?.current?.open();
    Keyboard?.dismiss();
  };

  const onPressCancel = () => {
    if (isEdit) {
      if (state?.isPrivate) {
        validateContactAndPushPropertyPost({
          action: NEW_POST_ACTIONS.UPDATE_SAVED_DRAFT,
        });
      } else {
        onPressPreview();
      }
    } else {
      captchaRef?.current?.show(captcha =>
        validateContactAndPushPropertyPost({action: NEW_POST_ACTIONS.SAVE_DRAFT, captcha}),
      );
    }
  };

  const onPressNext = () => {
    if (isEdit) {
      validateContactAndPushPropertyPost({action: NEW_POST_ACTIONS.UPDATE});
      return;
    }
    captchaRef?.current?.show(captcha =>
      validateContactAndPushPropertyPost({action: NEW_POST_ACTIONS.CREATE, captcha}),
    );
  };

  const onPressPreview = () => {
    validateContactAndPushPropertyPost({action: NEW_POST_ACTIONS.PREVIEW});
  };

  const onChooseGuaranteedPackage = item => {
    if (item?.id) {
      const mappingData = mapGuaranteedPackages(item?.id, state?.guaranteedPackages);
      dispatch({
        type: GLOBAL_ACTIONS.CHANGE_PACKAGE,
        payload: {
          guaranteedPackages: mappingData,
          guaranteedPackageId: item?.id !== CONSTANTS.UNCHECK_DROPDOWN_ID ? item?.id : null,
          postServiceType:
            item?.id === CONSTANTS.UNCHECK_DROPDOWN_ID
              ? PostServiceType.Normal
              : PostServiceType.Guaranteed,
        },
      });
    }
  };

  const onPressHyperlink = async () => {
    const fileUrl = Configs.createPropertyPostC2CTemplate;
    await downloadFileAzure(fileUrl, CONSTANTS.C2C_AGREEMENT_FILE_NAME);
  };

  const onCheckAgreement = value => {
    agreePolicy.setAgree(value);
  };

  const onPressHeaderStep = step => {
    const contactState = mapInputState({
      state,
      currentUserName: getUserFullName(userData),
      currentUserPhoneNumber: userData?.phoneNumber,
      currentUserEmail: userData?.email,
    });
    setInputFieldState({
      step4Data: {
        ...moduleState.step4Data,
        ...contactState,
      },
      step4Valid: true,
    });

    switch (step) {
      case NEW_POST_STEP.STEP1:
        navigation.replace(ScreenIds.GeneralDescription, {reload: true});
        break;
      case NEW_POST_STEP.STEP3:
        navigation.replace(ScreenIds.SelectSupportAgentScreen, {reload: true});
        break;
      case NEW_POST_STEP.STEP2:
        navigation.replace(ScreenIds.NewPostImages, {reload: true});
        break;
      default:
        navigation.replace(ScreenIds.GeneralDescription, {reload: true});
        break;
    }
  };

  useMount(() => {
    getUserInfo({variables: {userId}});
    getGuaranteedPackagesQuery();
  });

  const isValidState = validateContactInfo(state).isValid;

  const isShowPreview = isEdit ? state?.isPrivate : true;
  const disableCancelBtn = !isValidState || ((!isEdit || state?.isPrivate) && !agreePolicy.isAgree);
  const disableNextBtn =
    !isValidState || (!isModified && !state?.isPrivate) || !agreePolicy.isAgree;
  const disablePreviewIcon = !isValidState;

  const modals = (
    <ModalWithModalize getModalRef={modalizeRef}>
      <NewPostModalContainer
        state={state}
        dispatch={dispatch}
        hidePopup={onDismissPopup}
        navigation={navigation}
        dismissPopup={onDismissPopup}
      />
    </ModalWithModalize>
  );

  return (
    <BasePostAnimationScreen
      allowedHeaderAnimation={true}
      title={translate(STRINGS.CONTACT_INFO)}
      onPressNext={onPressNext}
      onPressCancel={onPressCancel}
      onBackPress={() => onPressHeaderStep(NEW_POST_STEP.STEP3)}
      showHeader={true}
      showHeaderShadow
      cancelTextStyle={disableCancelBtn ? {color: COLORS.GRAY_A3} : {color: COLORS.PRIMARY_A100}}
      customCancelText={translate(isShowPreview ? STRINGS.SAVE_DRAFT : STRINGS.REVIEW)}
      customNextText={translate(isEdit && !state?.isPrivate ? STRINGS.UPDATE : STRINGS.UPLOAD_POST)}
      headerOptions={{containerStyle: METRICS.smallVerticalPadding}}
      headerContainerHeight={CONSTANTS.HEADER_CONTAINER_HEIGHT + CONSTANTS.HEADER_TIMELINE_HEIGHT}
      isDisabledNext={disableNextBtn}
      disabledPreview={disablePreviewIcon}
      disabledCancel={disableCancelBtn}
      rightComponent={
        <CustomButton
          title={translate(STRINGS.DISCARD)}
          titleColor={COLORS.PRIMARY_A100}
          titleStyle={[FONTS.fontSize16, FONTS.bold]}
          onPress={onShowPopup}
        />
      }
      customHeaderComponent={
        <TimeLineProcessComponent
          data={{
            stepProcess: NEW_POST_STEP.STEP4,
            step2Valid: state?.step2Valid,
            step3Valid: state?.step3Valid,
            step1Valid: state?.step1Valid,
          }}
          onPressStep2={() => onPressHeaderStep(NEW_POST_STEP.STEP2)}
          onPressStep3={() => onPressHeaderStep(NEW_POST_STEP.STEP3)}
          onPressStep1={() => onPressHeaderStep(NEW_POST_STEP.STEP1)}
          style={HELPERS.fill}
        />
      }
      bottomFooterComponent={
        <CustomAgreementComponent
          containerStyle={[METRICS.horizontalPadding, METRICS.paddingBottom]}
          isAgree={agreePolicy.isAgree}
          checkValue={onCheckAgreement}
          onConfirm={onPressHyperlink}
          agreementFistText={translate('newPost.agreementFist')}
          suffix={translate('newPost.newPostPolicySuffix')}
          hyperlink={translate('newPost.newPostPolicy')}
        />
      }
      onPressPreview={onPressPreview}
      isShowPreview={isShowPreview}
      modals={modals}>
      <Captcha ref={captchaRef}>
        <NewPostContactInfoContainer
          state={state}
          dispatch={dispatch}
          userData={userData}
          errorState={state.errorState}
          onChooseGuaranteedPackage={onChooseGuaranteedPackage}
        />
        <BadWordModal errorKeyword={errorData} />
      </Captcha>
    </BasePostAnimationScreen>
  );
};

export default NewPostContactInfoScreen;
