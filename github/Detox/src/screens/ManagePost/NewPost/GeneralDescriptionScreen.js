import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import React, {useContext, useEffect, useMemo, useReducer, useRef} from 'react';
import {InputAccessoryView, Keyboard, Platform} from 'react-native';
import {useSelector} from 'react-redux/lib/hooks/useSelector';

import {getCoordinatesFromAddress} from '../../../api/googleMapApi';
import {useApiCall} from '../../../api/restful/useApiCall';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {getUserId} from '../../../appData/user/selectors';
import {
  APPROVAL_STATUS,
  CommissionCurrencyUnit,
  CONSTANTS,
  GLOBAL_ACTIONS,
  MAP,
  NEW_POST_MODAL_STATE,
  NEW_POST_STEP,
  NEWPOST_FIELD,
  POST_TYPE,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import CustomButton from '../../../components/Button/CustomButton';
import KeyboardAccessoryView from '../../../components/KeyboardAccessoryView';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import PriceSuggestionsKeyboardScroll from '../../../components/PriceSuggestionListWithKeyboard';
import ArrayUtils from '../../../utils/ArrayUtils';
import {extractAddressData} from '../../../utils/DataProcessUtil';
import {getPropertyPostApprovalStatusByKey} from '../../../utils/GetMasterData';
import MeasureUtils from '../../../utils/MeasureUtils';
import NumberUtils from '../../../utils/NumberUtils';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import {Category, ClickLocation, TrackingActions} from '../../WithSegment';
import Selector from '../DetailPropertyPost/Selector';
import PropertyType from '../PropertyType';
import {NewPostContext} from '../useNewPost';
import {useGetCommissionForTpl, useValidateNumberOfPostByUserId} from '../usePropertyPostActions';
import ValidatePropertyInput from '../ValidatePropertyInput';
import BasePostAnimationScreen from './BasePostAnimationScreen';
import AccessoryView from './NewPostComponents/AccessoryView';
import ConfigureCommisionSliderContainer from './NewPostComponents/ConfigureCommissionSliderContainer';
import GeneralDescriptionContainer from './NewPostComponents/GeneralDescriptionContainer';
import NewPostModalContainer from './NewPostComponents/NewPostModalContainer';
import {INPUT_ACCESSORY_VIEW_ID} from './NewPostComponents/PriceComponent';
import TimeLineProcessComponent from './NewPostComponents/TimeLineProcessComponent';
import {calculateCommission, mappingDetailInfo} from './NewPostUtils';

const initialErrorState = {
  postTitle: '',
  postType: '',
  propertyType: '',
  project: '',
  projectText: '',
  streetName: '',
  homeAddress: '',
  city: '',
  district: '',
  ward: '',
  postDescription: '',
  isValid: false,
  price: '',
  commission: '',
  rentPrice: '',
  rentCommission: '',
  lastFullAddress: '',
  coordinateText: '',
};

const initialState = {
  postTitle: '',
  propertyTypeId: '',
  propertyTypeName: '',
  propertyTypeDescription: '',
  projectInfo: {},
  projectId: CONSTANTS.DROPDOWN_OTHER_ID,
  freeTextProject: '',
  propertyAddress: {
    countryId: 1,
    cityId: 0,
    districtId: 0,
    wardId: 0,
    homeAddress: '',
    streetName: '',
  },
  lastFullAddress: '',
  postDescription: '',
  errorState: initialErrorState,
  forSale: true,
  forRent: false,
  price: '',
  commission: '',
  negotiable: false,
  rentPrice: '',
  rentCommission: '',
  rentPeriod: {},
  detailInfo: {},
  modalizeState: NEW_POST_MODAL_STATE.ADD_AREA_FACILITY,
  buildingFacility: {
    nearFacility: [],
    internalFacility: [],
  },
  coordinate: {latitude: NaN, longitude: NaN},
  coordinateText: '',
};

const mapInputState = (state, newPostState) => {
  return {
    step1Data: {
      ...newPostState,
      postTitle: state.postTitle,
      propertyTypeId: state.propertyTypeId,
      propertyTypeName: state.propertyTypeName,
      propertyTypeDescription: state.propertyTypeDescription,
      projectInfo: state?.projectInfo,
      freeTextProject: state.freeTextProject,
      propertyAddress: state.propertyAddress,
      postDescription: state.postDescription,
      projectId: state.projectId === CONSTANTS.DROPDOWN_OTHER_ID ? '' : state.projectId,
      commissionTpl: state.commissionTpl,
      commissionBuyer: state.commissionBuyer,
      commissionSeller: state.commissionSeller,
      //selling
      forSale: state?.forSale ?? true,
      commission: state?.forSale ? state?.commission?.value : '',
      price: state?.forSale ? state?.price : '',
      unitOfMeasureId: MeasureUtils.getUnitOFMeasureIdByPrice(state.price),
      saleCommissionCurrencyUnitId: state?.commission?.id ?? CommissionCurrencyUnit.PERCENTAGE,
      negotiable: state?.negotiable ?? false,
      //rental
      forRent: state.forRent ?? false,
      rentPrice: state.forRent ? state.rentPrice : '',
      rentCommission: state.forRent ? state?.rentCommission?.value : '',
      rentPeriod: state.forRent ? state?.rentPeriod?.value : '',
      rentCommissionCurrencyUnitId: state?.rentCommission?.id ?? CommissionCurrencyUnit.VND,
      ...Selector.mapUiToPropertyDetail(state.detailInfo, state.propertyTypeName),
      nearFacility: Selector.mapFacilityList({
        facilities: state?.buildingFacility?.nearFacility,
        isInternal: false,
      }),
      internalFacility:
        state.propertyTypeName === PropertyType.land
          ? []
          : Selector.mapFacilityList({
              facilities: state?.buildingFacility?.internalFacility,
              isInternal: true,
            }),
      lastFullAddress: state?.lastFullAddress ?? '',
    },
  };
};

function reducer(state, action) {
  let newState = {...state};
  switch (action.type) {
    case GLOBAL_ACTIONS.RESET:
      newState = action.payload;
      return newState;
    case GLOBAL_ACTIONS.FIELD:
      newState = {...state, [action.fieldName]: action.payload};
      let fieldError = null;
      if (
        action?.fieldName === NEWPOST_FIELD.postTitle ||
        action?.fieldName === NEWPOST_FIELD.postDescription
      ) {
        fieldError = ValidatePropertyInput.validateFieldName(action?.fieldName, {
          [action.fieldName]: action.payload,
        });
      } else {
        fieldError = ValidatePropertyInput.clearFieldError(action.fieldName);
      }
      return {...newState, errorState: {...state.errorState, ...fieldError}};
    case GLOBAL_ACTIONS.SET_ERROR_STATE:
      return {...state, errorState: action.payload};
    case GLOBAL_ACTIONS.CHANGE_PROJECT:
      newState = {
        ...state,
        ...action.payload,
      };

      let coordinate = {
        latitude: newState?.propertyAddress?.latitude,
        longitude: newState?.propertyAddress?.longitude,
      };
      const validateCoordinate = ValidatePropertyInput.validateCoordinate(coordinate);

      const coordinateText = validateCoordinate?.isValid
        ? `${coordinate?.latitude}, ${coordinate?.longitude}`
        : '';

      coordinate = validateCoordinate?.isValid ? {coordinate: coordinate} : null;

      const propertyAddress = extractAddressData(newState?.propertyAddress, false, true);
      const projectError = ValidatePropertyInput.clearFieldError('freeTextProject');
      const coordinateTextError = ValidatePropertyInput.validateCoordinateText(coordinateText);
      return {
        ...newState,
        ...coordinate,
        lastFullAddress: propertyAddress,
        coordinateText: coordinateText,
        errorState: {
          ...state.errorState,
          ...projectError,
          ...ValidatePropertyInput.clearAddressError(),
          coordinateText: coordinateTextError?.coordinateText,
        },
      };
    case GLOBAL_ACTIONS.CHANGE_ADDRESS:
      newState = {
        ...state,
        propertyAddress: {
          ...state.propertyAddress,
          ...action.payload,
        },
      };
      const lastFullAddress = extractAddressData(newState?.propertyAddress, false, true);

      return {
        ...newState,
        lastFullAddress: lastFullAddress,
        errorState: {...state.errorState, ...ValidatePropertyInput.clearAddressError()},
      };
    case GLOBAL_ACTIONS.CHANGE_PROPERTY_TYPE:
      newState = {
        ...state,
        propertyTypeId: action.payload.id,
        propertyTypeName: action.payload.type,
        propertyTypeDescription: action.payload.name,
      };
      const propertyTypeError = ValidatePropertyInput.clearFieldError('propertyType');
      return {...newState, errorState: {...state.errorState, ...propertyTypeError}};
    case GLOBAL_ACTIONS.CHANGE_PRICE:
      newState = {...state, ...action.payload};
      const priceError = ValidatePropertyInput.clearFieldError('price');
      return {...newState, errorState: {...state.errorState, ...priceError}};
    case GLOBAL_ACTIONS.SELLING_COMMISSION:
      newState = {...state, ...action.payload};
      const commissionError = ValidatePropertyInput.clearFieldError('commission');
      return {...newState, errorState: {...state.errorState, ...commissionError}};
    case GLOBAL_ACTIONS.CHANGE_PROPERTY_DETAIL:
      newState = {...state, detailInfo: {...state.detailInfo, ...action.payload}};
      return newState;
    case GLOBAL_ACTIONS.CHANGE_COORDINATE:
      const coordinatePayload = action.payload;
      const coordinateValue = `${
        isNaN(coordinatePayload?.latitude) ? '' : coordinatePayload?.latitude
      }, ${isNaN(coordinatePayload?.longitude) ? '' : coordinatePayload?.longitude}`;

      newState = {...state, coordinate: coordinatePayload, coordinateText: coordinateValue};
      return newState;
    case GLOBAL_ACTIONS.CHANGE_COORDINATE_TEXT:
      const valuePayload = action?.payload?.coordinateText;
      const textError = {coordinateText: ''};
      let resultCoordinate = null;
      if (!isEmpty(valuePayload)) {
        textError.coordinateText =
          ValidatePropertyInput.validateCoordinateText(valuePayload).coordinateText;
        if (isEmpty(textError.coordinateText) && String(valuePayload).includes(',')) {
          const arrCoordinate = valuePayload.split(',').map(item => item.trim());
          const newCoordinate = {
            latitude: NumberUtils.parseFloatValue(arrCoordinate[0]),
            longitude: NumberUtils.parseFloatValue(arrCoordinate[1]),
          };
          resultCoordinate = {coordinate: newCoordinate};
        }
      }

      newState = {
        ...state,
        ...action.payload,
        ...resultCoordinate,
        errorState: {...state.errorState, ...textError},
      };
      return newState;
    case GLOBAL_ACTIONS.CHANGE_DATA:
      newState = {...state, ...action.payload};
      return newState;
    case GLOBAL_ACTIONS.CHANGE_RENTAL_PRICE:
      newState = {...state, ...action.payload};
      const rentPriceError1 = ValidatePropertyInput.clearFieldError('rentPrice');
      return {...newState, errorState: {...state.errorState, ...rentPriceError1}};
    case GLOBAL_ACTIONS.RENTAL_COMMISSION:
      newState = {...state, ...action.payload};
      const rentCommissionError1 = ValidatePropertyInput.clearFieldError('rentCommission');
      return {...newState, errorState: {...state.errorState, ...rentCommissionError1}};
    case GLOBAL_ACTIONS.CHANGE_RENTAL_TIME:
      newState = {
        ...state,
        rentPeriod: action.payload,
      };
      return newState;
    case GLOBAL_ACTIONS.CHANGE_MODALIZE_STATE:
      newState = {...state, modalizeState: action.payload};
      return newState;
    case GLOBAL_ACTIONS.UPDATE_BUILDING_FACILITY:
      newState = {...state, buildingFacility: {...state.buildingFacility, ...action.payload}};
      return newState;
    case GLOBAL_ACTIONS.SET_DETAIL_ERROR:
      newState = {...state, detailInfo: {...state.detailInfo, errors: action.payload}};
      return newState;
    default:
      return newState;
  }
}

const getPropertyTypeFromId = (typeId, masterData) => {
  const listTypes = masterData?.propertyTypes?.edges;
  let propertyType = {};
  if (Array.isArray(listTypes)) {
    propertyType = listTypes.find(type => type.propertyTypeId === typeId) ?? {};
  }
  return propertyType;
};

const mappingFacilityList = array => {
  if (ArrayUtils.hasArrayData(array)) {
    return array.map((e, index) => ({
      id: index.toString(),
      description: e,
      name: e,
      checked: true,
    }));
  }
  return [];
};

const parseToFacilitiesToUI = (data, masterData) => {
  let result = {};
  let formatNearFacility = data?.nearFacility ? data?.nearFacility?.map(e => e.name) : [];
  const masterNearFacility = Array.from(masterData?.nearFacilities?.edges ?? []);

  const listMasterNearFacility = masterNearFacility?.map(e => {
    if (formatNearFacility.includes(e.nearFacilityName)) {
      formatNearFacility = formatNearFacility.filter(item => item !== e.nearFacilityName);
      return {
        id: e.nearFacilityId,
        description: e.nearFacilityName,
        name: e.nearFacilityName,
        checked: true,
      };
    }

    return {
      id: e.nearFacilityId,
      description: e.nearFacilityName,
      name: e.nearFacilityName,
      checked: false,
    };
  });
  const listNearFacility = mappingFacilityList(formatNearFacility);

  result = {
    nearFacility: [...listNearFacility, ...listMasterNearFacility],
  };

  let formatInternalFacility = data?.internalFacility
    ? data?.internalFacility?.map(e => e.name)
    : [];
  const masterInternalFacility = Array.from(masterData?.internalFacilities?.edges ?? []);
  const listMasterInternalFacility = masterInternalFacility?.map(e => {
    if (formatInternalFacility.includes(e.internalFacilityName)) {
      formatInternalFacility = formatInternalFacility.filter(
        item => item !== e.internalFacilityName,
      );
      return {
        id: e.internalFacilityId,
        description: e.internalFacilityName,
        name: e.internalFacilityName,
        checked: true,
      };
    }

    return {
      id: e.internalFacilityId,
      description: e.internalFacilityName,
      name: e.internalFacilityName,
      checked: false,
    };
  });
  const listInternalFacility = mappingFacilityList(formatInternalFacility);

  result = {
    ...result,
    internalFacility: [...listInternalFacility, ...listMasterInternalFacility],
  };

  return result;
};

const mapState = (allState, masterData, modalizeState) => {
  const originState = allState?.originState;
  const step1Data = allState?.step1Data;
  const defaultPropertyType = masterData?.propertyTypes?.edges
    ? masterData?.propertyTypes?.edges[0]
    : null;

  let propertyTypeName = step1Data?.propertyTypeName ?? defaultPropertyType?.propertyTypeName ?? '';
  let propertyTypeId = step1Data?.propertyTypeId ?? defaultPropertyType?.propertyTypeId ?? '';
  if (!isEmpty(originState)) {
    propertyTypeId = propertyTypeId || originState.propertyTypeId || '';
    const propertyType = getPropertyTypeFromId(propertyTypeId, masterData);
    propertyTypeName = propertyType?.propertyTypeName;
  }
  const validateCoordinate = ValidatePropertyInput.validateCoordinate(allState?.coordinate);
  const coordinateText = validateCoordinate?.isValid
    ? `${allState?.coordinate?.latitude}, ${allState?.coordinate?.longitude}`
    : '';

  const commissionPercentage = {
    commissionTpl: step1Data?.commissionTpl ?? 20,
    commissionBuyer: step1Data?.commissionBuyer ?? 100,
    commissionSeller: step1Data?.commissionSeller ?? 0,
  };

  const detailInfo = mappingDetailInfo({
    propertyType: propertyTypeName || PropertyType.apartment,
    detailInfo: Selector.mapPropertyDetailToUi(step1Data, propertyTypeName),
    masterData,
  });

  return {
    ...initialState,
    ...commissionPercentage,

    detailInfo: detailInfo,
    postTitle: step1Data?.postTitle,
    propertyTypeId: propertyTypeId,
    propertyTypeName: propertyTypeName,
    propertyTypeDescription:
      step1Data?.propertyTypeDescription ?? defaultPropertyType?.propertyTypeDescription ?? '',
    projectId: step1Data?.projectId ?? CONSTANTS.DROPDOWN_OTHER_ID,
    projectInfo: step1Data?.projectInfo ?? {},
    freeTextProject: step1Data?.freeTextProject ?? '',
    propertyAddress: step1Data?.propertyAddress,
    postDescription: step1Data?.postDescription,
    postDescriptionPlainText: '',
    commission: {
      value: step1Data?.commission ? NumberUtils.parseFloatValue(step1Data?.commission) : '',
      id: step1Data?.saleCommissionCurrencyUnitId ?? CommissionCurrencyUnit.PERCENTAGE,
    },
    price: step1Data?.price ?? '',
    negotiable: step1Data?.negotiable || false,
    forSale: true,
    forRent: step1Data?.forRent ?? false,
    rentPrice: step1Data?.rentPrice ?? '',
    rentCommission: {
      id: step1Data?.rentCommissionCurrencyUnitId ?? CommissionCurrencyUnit.VND,
      value: step1Data?.rentCommission ?? '',
    },
    rentPeriod: {
      id: step1Data?.rentPeriod ?? 0,
      value: step1Data?.rentPeriod ?? 0,
    },
    modalizeState: modalizeState,
    coordinate: allState?.coordinate,
    coordinateText: coordinateText,
    lastFullAddress: step1Data?.lastFullAddress ?? '',
    isPrivate: allState?.isPrivate,
    buildingFacility: parseToFacilitiesToUI(
      {
        nearFacility: step1Data?.nearFacility ?? null,
        internalFacility: step1Data?.internalFacility ?? null,
      },
      masterData,
    ),
    step1Valid: false,
    step2Valid: allState?.step2Valid,
    step3Valid: allState?.step3Valid,
    step4Valid: allState?.step4Valid,
  };
};

const getPostTypeId = masterData => {
  let postTypeId = '';
  const listTypes = masterData?.postTypes?.edges;
  if (Array.isArray(listTypes)) {
    postTypeId = listTypes.find(type => type.postTypeName === POST_TYPE.C2C)?.postTypeId ?? '';
  }
  return postTypeId;
};

const GeneralDescriptionScreen = ({navigation, route}) => {
  const {reload} = route?.params || {};

  const {track} = useAnalytics();

  const modalizeRef = useRef(null);
  const configureCommissionModal = useRef(null);

  const {getMasterData, showAppSpinner, showAppModal, showMessageAlert} = useContext(AppContext);
  const masterData = getMasterData();
  const userId = useSelector(getUserId);
  const {state: moduleState, resetState, setInputFieldState} = useContext(NewPostContext);
  const [state, dispatch] = useReducer(
    reducer,
    mapState(moduleState, masterData, NEW_POST_MODAL_STATE.ADD_AREA_FACILITY),
  );

  const suggestionPrices = MeasureUtils.getPriceSuggestionOptions(state.price);

  const canEdit = moduleState?.isEdit ? moduleState?.isEdit : moduleState?.userIsValidated;

  const onCanCreateNewPost = response => {
    if (response.errorCode !== 0 || !response?.isValid) {
      showAppModal({
        isVisible: true,
        message: response?.errorMessage ?? '',
        onOkHandler: () => navigation.canGoBack() && navigation.goBack(),
      });
    } else {
      const approvalStatusWaiting = getPropertyPostApprovalStatusByKey(
        masterData,
        APPROVAL_STATUS.WAITING,
      );
      const updatedState = resetState(
        false,
        approvalStatusWaiting.propertyPostApprovalStatusId,
        true,
      );

      dispatch({
        type: GLOBAL_ACTIONS.RESET,
        payload: mapState(updatedState, masterData, NEW_POST_MODAL_STATE.ADD_AREA_FACILITY),
      });

      getCommissionForTpl();
    }
  };

  const onErrorValidateNumberOfPost = error => {
    showAppModal({
      isVisible: true,
      message: error?.message ?? '',
      onOkHandler: () => navigation.canGoBack() && navigation.goBack(),
    });
  };

  const {validateNumberOfPost} = useValidateNumberOfPostByUserId({
    userId,
    onSuccess: onCanCreateNewPost,
    onError: onErrorValidateNumberOfPost,
  });

  const {getCommissionForTpl} = useGetCommissionForTpl({
    onSuccess: percentage => {
      if (percentage && isNumber(percentage)) {
        dispatch({
          type: GLOBAL_ACTIONS.CHANGE_DATA,
          payload: {
            commissionTpl: percentage,
          },
        });
      }
    },
  });

  useMount(() => {
    if (moduleState?.isEdit && moduleState?.isPrivate) {
      getCommissionForTpl();
    }
    if (!moduleState?.userIsValidated && !moduleState?.isEdit) {
      validateNumberOfPost();
    }
  });

  const reloadData = () => {
    if (reload) {
      getCommissionForTpl();
      dispatch({
        type: GLOBAL_ACTIONS.CHANGE_DATA,
        payload: {
          step1Valid: false,
          step2Valid: moduleState?.step2Valid,
          step3Valid: moduleState?.step3Valid,
          step4Valid: moduleState?.step4Valid,
        },
      });
    }
  };
  useEffect(reloadData, [
    reload,
    moduleState.step2Valid,
    moduleState.step3Valid,
    moduleState.step4Valid,
  ]);

  const setErrorState = value => {
    const generalErrors = {...value};
    delete generalErrors.detailErrors;
    dispatch({type: GLOBAL_ACTIONS.SET_ERROR_STATE, payload: generalErrors});
    dispatch({type: GLOBAL_ACTIONS.SET_DETAIL_ERROR, payload: value.detailErrors});
  };
  const changeModalizeState = value => {
    dispatch({type: GLOBAL_ACTIONS.CHANGE_MODALIZE_STATE, payload: value});
  };

  const onError = () => {
    showAppSpinner(false);
    //show error require field when cannot retrieve long, lat if needed
    showMessageAlert(translate(STRINGS.INFO), translate(Message.ERR_CANNOT_GET_COORDINATE));
  };

  const saveDataAndNavigate = newCoordinate => {
    const generalInputState = mapInputState(state, moduleState.step1Data);
    const postTypeId = generalInputState.step1Data?.postTypeId ?? getPostTypeId(masterData);

    const validation = ValidatePropertyInput.validateCoordinate(newCoordinate);
    const validateCoordinate = validation?.isValid ? newCoordinate : state?.coordinate;

    setInputFieldState({
      step1Data: {
        ...generalInputState.step1Data,
        postTypeId: postTypeId,
      },
      coordinate: validateCoordinate,
      step1Valid: true,
    });

    if (!moduleState?.isEdit) {
      const propertyStatusText =
        masterData.propertyPostStatus?.edges?.filter(
          e => e?.propertyPostStatusId === generalInputState.step1Data?.propertyPostStatusId,
        )?.propertyPostStatusDescription ?? '';

      const legalInfoText =
        masterData.legalInfoes?.edges?.filter(
          e => e?.legalInfoId === generalInputState.step1Data?.legalInfoId,
        )?.legalInfoDescription ?? '';

      let emptyValue;

      track(TrackingActions.createPostStep1, {
        property_type: generalInputState.step1Data?.propertyTypeDescription,
        project: generalInputState.step1Data?.projectInfo?.projectName,
        address: {
          city: generalInputState.step1Data?.propertyAddress?.cityName,
          district: generalInputState.step1Data?.propertyAddress?.districtName,
          ward: generalInputState.step1Data?.propertyAddress?.wardName,
          street: generalInputState.step1Data?.propertyAddress?.streetName,
        },
        coordinate: state?.coordinateText || emptyValue,
        apartment_area:
          NumberUtils.parseFloatValue(generalInputState.step1Data?.buildingArea) || emptyValue,
        length: generalInputState.step1Data?.length || emptyValue,
        width: generalInputState.step1Data?.width || emptyValue,
        sale_price: NumberUtils.parseFloatValue(generalInputState.step1Data?.price),
        negotiable: generalInputState.step1Data?.negotiable,
        sale_commission: NumberUtils.parseFloatValue(generalInputState.step1Data?.commission),
        direction: generalInputState.step1Data?.direction,
        balcony_direction: generalInputState.step1Data?.balconyDirection || emptyValue,
        block: generalInputState.step1Data?.blockName || emptyValue,
        floor: generalInputState.step1Data?.floor || emptyValue,
        bedroom_number: generalInputState.step1Data?.numberOfBedrooms,
        bathroom_number: generalInputState.step1Data?.numberOfBathrooms,
        sovereignty: legalInfoText || emptyValue,
        property_status: propertyStatusText || emptyValue,
        surrounding_facilities: generalInputState.step1Data?.nearFacility?.join(',') || emptyValue,
        interior_utilities: generalInputState.step1Data?.internalFacility?.join(',') || emptyValue,
      });
    }

    switch (state.stepValue) {
      case NEW_POST_STEP.STEP2:
        navigation.navigate(ScreenIds.NewPostImages);
        break;
      case NEW_POST_STEP.STEP3:
        navigation.navigate(ScreenIds.SelectSupportAgentScreen);
        break;
      case NEW_POST_STEP.STEP4:
        navigation.navigate(ScreenIds.NewPostContactInfo);
        break;
      default:
        navigation.navigate(ScreenIds.NewPostImages);
    }
  };

  const onSuccess = data => {
    showAppSpinner(false);
    const results = data.results;
    if (results && Array.isArray(results) && results.length > 0) {
      const location = results[0]?.geometry?.location;
      const newCoordinate = {
        latitude: location.lat,
        longitude: location.lng,
      };

      const validation = ValidatePropertyInput.validateCoordinate(newCoordinate);
      if (!validation?.isValid) {
        showMessageAlert(translate(STRINGS.INFO), translate(Message.ERR_CANNOT_GET_COORDINATE));
      } else {
        dispatch({type: GLOBAL_ACTIONS.CHANGE_COORDINATE, payload: newCoordinate});
        saveDataAndNavigate(newCoordinate);
      }
    } else {
      showMessageAlert(translate(STRINGS.INFO), translate(Message.ERR_CANNOT_GET_COORDINATE));
    }
  };

  const {startApi} = useApiCall({onError, onSuccess});

  /**
   * generate coordinate value from address
   * if success -> validate input property, else alert error
   * @param {*} fullAddress
   */
  const callAPIGetCoordinate = fullAddress => {
    if (!isEmpty(fullAddress)) {
      const country = MAP.CURRENT_COUNTRY;
      showAppSpinner(true);
      startApi(async () => {
        const coordinateResponse = await getCoordinatesFromAddress(fullAddress + `, ${country}`);
        return coordinateResponse;
      });
    } else {
      showMessageAlert(translate(STRINGS.INFO), translate(Message.ERR_CANNOT_GET_COORDINATE));
    }
  };

  const validateStep1Data = () => {
    const newErrorState = ValidatePropertyInput.validatePropertyInput(state);
    setErrorState(newErrorState);
    if (newErrorState.isValid) {
      /**
       * 1. Khi user không nhập tọa độ. nếu user hoàn thành nhập địa chỉ và nhấn tiếp theo qua step 2.
       *   Hệ thống sẽ tự động điền tọa độ vào vị trí tọa độ. Khi nhấn back lại từ step khác sẽ thấy tọa độ đã dc fill dựa vào vị trí
       * 2. Khi user tự động nhập tọa độ thì khi bấm qua step khác sẽ kiểm tra tọa độ có validate không nếu không validate sẽ báo lỗi.
       *   Hệ thống không tự fill lại tọa độ khi user đã dựa vào địa chỉ khi user đã nhập trước đó
       */
      if (newErrorState?.isValidCoordinate) {
        saveDataAndNavigate();
      } else {
        // gọi gg api lấy toạ độ khi text coordinate rỗng
        callAPIGetCoordinate(state?.lastFullAddress);
      }
    }
  };

  const onPressNext = stepValue => {
    state.stepValue = stepValue;
    validateStep1Data();
  };

  const dismissPopup = () => {
    modalizeRef?.current?.close();
  };
  const showPopup = () => {
    modalizeRef?.current?.open();
    Keyboard.dismiss();
  };

  const dismissCommissionPopup = () => {
    configureCommissionModal.current?.close();
  };

  const showCommissionPopup = () => {
    configureCommissionModal.current?.open();
    Keyboard.dismiss();
  };

  const onPressCancel = () => {
    changeModalizeState(NEW_POST_MODAL_STATE.CONFIRM_EDIT);
    showPopup();
  };

  const onPressPolicy = () => {};

  const onConfirmChangeCommissionPercentage = (buyerPercentage, sellerPercentage) => {
    dispatch({
      type: GLOBAL_ACTIONS.CHANGE_DATA,
      payload: {
        commissionBuyer: NumberUtils.parseFloatValue(buyerPercentage),
        commissionSeller: NumberUtils.parseFloatValue(sellerPercentage),
      },
    });
    dismissCommissionPopup();
  };

  const onSuggestionSelected = item => {
    dispatch({
      type: GLOBAL_ACTIONS.CHANGE_PRICE,
      payload: {price: item?.value ?? 0},
    });
    Keyboard.dismiss();
  };

  const pressCallCallBack = () => {
    track(TrackingActions.callButtonClicked, {
      click_location: ClickLocation.postPage,
      category: Category.createPostStep1,
    });
  };

  const pressMessageCallBack = () => {
    track(TrackingActions.messagesButtonClicked, {
      click_location: ClickLocation.postPage,
      category: Category.createPostStep1,
    });
  };

  const getTotalCommissionForUser = useMemo(() => {
    const totalCommission = calculateCommission(
      state.price,
      state.commission.value,
      state.commission.id,
    );
    return totalCommission;
  }, [state.price, state.commission]);

  const modals = (
    <>
      <ModalWithModalize getModalRef={modalizeRef}>
        <NewPostModalContainer
          state={state}
          dispatch={dispatch}
          hidePopup={dismissPopup}
          navigation={navigation}
          dismissPopup={dismissPopup}
        />
      </ModalWithModalize>
      <ModalWithModalize getModalRef={configureCommissionModal} panGestureEnabled={false}>
        <ConfigureCommisionSliderContainer
          totalAmount={getTotalCommissionForUser}
          defaultBuyerPercentage={state.commissionBuyer}
          defaultSellerPercentage={state.commissionSeller}
          onConfirm={onConfirmChangeCommissionPercentage}
          onClose={dismissCommissionPopup}
        />
      </ModalWithModalize>
    </>
  );

  return (
    <BasePostAnimationScreen
      navigation={navigation}
      title={translate(STRINGS.PROPERTY_INFO)}
      showHeaderShadow
      onPressCancel={onPressCancel}
      showContactButtons
      onPressNext={() => onPressNext(NEW_POST_STEP.STEP2)}
      onBackPress={onPressCancel}
      showHeader={true}
      headerOptions={{containerStyle: METRICS.smallVerticalPadding}}
      allowedHeaderAnimation={true}
      headerContainerHeight={CONSTANTS.HEADER_CONTAINER_HEIGHT + CONSTANTS.HEADER_TIMELINE_HEIGHT}
      customHeaderComponent={
        <TimeLineProcessComponent
          data={{
            stepProcess: NEW_POST_STEP.STEP1,
            step2Valid: state?.step2Valid,
            step3Valid: state?.step3Valid,
            step4Valid: state?.step4Valid,
          }}
          onPressStep2={() => onPressNext(NEW_POST_STEP.STEP2)}
          onPressStep3={() => onPressNext(NEW_POST_STEP.STEP3)}
          onPressStep4={() => onPressNext(NEW_POST_STEP.STEP4)}
          style={HELPERS.fill}
        />
      }
      rightComponent={
        <CustomButton
          title={translate(STRINGS.DISCARD)}
          titleColor={COLORS.PRIMARY_A100}
          titleStyle={[FONTS.fontSize14, FONTS.bold]}
          onPress={onPressCancel}
        />
      }
      extraComponent={
        Platform.OS === 'android' ? (
          <KeyboardAccessoryView
            alwaysVisible={false}
            bumperHeight={15}
            visibleEmptyView={!!suggestionPrices.length}>
            {({isKeyboardVisible}) =>
              isKeyboardVisible &&
              !!suggestionPrices.length && (
                <PriceSuggestionsKeyboardScroll
                  onSelect={onSuggestionSelected}
                  data={suggestionPrices}
                />
              )
            }
          </KeyboardAccessoryView>
        ) : (
          <InputAccessoryView nativeID={INPUT_ACCESSORY_VIEW_ID}>
            {suggestionPrices?.length > 0 ? (
              <PriceSuggestionsKeyboardScroll
                onSelect={onSuggestionSelected}
                data={suggestionPrices}
              />
            ) : (
              <AccessoryView title="Done" onPress={Keyboard.dismiss} />
            )}
          </InputAccessoryView>
        )
      }
      modals={modals}
      pressCallCallBack={pressCallCallBack}
      pressMessageCallBack={pressMessageCallBack}>
      {canEdit ? (
        <GeneralDescriptionContainer
          state={state}
          dispatch={dispatch}
          masterData={masterData}
          errorState={state?.errorState}
          showPopup={showPopup}
          showCommissionPopup={showCommissionPopup}
          onPressPolicy={onPressPolicy}
        />
      ) : null}
    </BasePostAnimationScreen>
  );
};

export default GeneralDescriptionScreen;
