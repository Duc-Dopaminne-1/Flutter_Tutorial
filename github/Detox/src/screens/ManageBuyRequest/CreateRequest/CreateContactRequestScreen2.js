import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useReducer, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';

import {CreateContactTradingInput} from '../../../api/graphql/generated/graphql';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {isAgent} from '../../../appData/user/selectors';
import {
  CONTACT_TRADING_TYPE,
  ContactType,
  getGenderEnum,
  KEY_BOARD_TYPE,
  SEARCH_TYPE_INDEX,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomCheckbox from '../../../components/Checkbox/CustomCheckbox';
import InputSection from '../../../components/InputSection';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import ModalPopup from '../../../components/Modal/ModalPopup';
import CaptchaV2 from '../../../components/RecaptchaV2';
import {getUserFullName} from '../../../utils/UserAgentUtil';
import ValidateInput from '../../../utils/ValidateInput';
import {ContactSuccessContainer} from '../../ManagePost/Contact/ContactSuccessContainer';
import ScreenIds from '../../ScreenIds';
import {CONTACT_ACTIONS, CONTACT_FIELD} from '../DetailRequestConstant';
import CreateContactTrading from '../hooks/useCreateContactTrading';
import {ContactTradingContext} from '../useContactTrading';
import CreateRequestFooterButtons from './CreateRequestComponents/CreateRequestFooterButtons';

const styles = StyleSheet.create({
  baseScreenContainer: {
    backgroundColor: COLORS.BACKGROUND,
  },
  bodyContainer: {
    flexGrow: 1,
  },
  inputTitle: {
    ...FONTS.regular,
    ...commonStyles.txtFontSize14,
    color: COLORS.BRAND_GREY,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  checkBoxIsMe: {
    marginVertical: 16,
  },
  successPopupStyle: {
    padding: 0,
  },
});

const initialErrorState = {
  fullName: '',
  phoneNumber: '',
  email: '',
  isValid: false,
};

const initialState = {
  fullName: '',
  phoneNumber: '',
  email: '',
};

const mapContactInfo = contactInfo => {
  if (!isEmpty(contactInfo)) {
    return {
      fullName: contactInfo.fullName ?? '',
      phoneNumber: contactInfo.phoneNumber ?? '',
      email: contactInfo.email ?? '',
    };
  }

  return initialState;
};

function clearFieldError(fieldName) {
  return {[fieldName]: ''};
}

const validateForm = state => {
  const errorsObj = {
    fullName: ValidateInput.checkName(state.fullName ?? ''),
    phoneNumber: ValidateInput.checkMobilePhone(state.phoneNumber ?? ''),
    email: state?.email ? ValidateInput.checkEmail(state.email) : '',
  };
  let isValid = true;
  // eslint-comments no-unused-vars
  for (const [, value] of Object.entries(errorsObj)) {
    if (value) {
      isValid = false;
      break;
    }
  }
  return {
    isValid,
    ...errorsObj,
  };
};

function reducer(state, action) {
  let newState = {...state};
  switch (action.type) {
    case CONTACT_ACTIONS.FIELD:
      newState = {...state, [action.fieldName]: action.payload};
      const fieldError = clearFieldError(action.fieldName);
      return {...newState, errors: {...state.errors, ...fieldError}};
    case CONTACT_ACTIONS.SET_ERROR_STATE:
      return {...state, errors: {...state.errors, ...action.payload}};
    default:
      return newState;
  }
}

const mapStateToCreateRequestInfo = ({agentInfo, state, isAgentUser, createContactRequestInfo}) => {
  const userGender = agentInfo?.gender ?? '';
  const userId = agentInfo?.userId ?? '';
  const userPhoneNumber = agentInfo?.phoneNumber ?? '';
  const userEmail = agentInfo?.email ?? '';
  const userFirstName = agentInfo?.firstName ?? '';
  const userLastName = agentInfo?.lastName ?? '';
  const {propertyPostId, propertyPostUrl, contactType} = createContactRequestInfo;

  const requesterGenderEnum = getGenderEnum(userGender);
  const input: CreateContactTradingInput = {
    contactTradingInfo: {
      requesterId: userId ?? '',
      requesterEmail: userEmail ?? '',
      requesterPhoneNumber: `["${userPhoneNumber}"]` ?? '',
      requesterFullName: userLastName + ' ' + userFirstName ?? '',
      requesterAddress: agentInfo?.agentAddress ?? '{}',
      requesterIsAgency: isAgentUser ?? false,
      requesterGender: requesterGenderEnum,
      customerEmail: state.email ?? '',
      customerFullName: state.fullName ?? '',
      customerPhoneNumber: `["${state.phoneNumber}"]` ?? '',
      propertyPostId: propertyPostId || null,
      propertyPostUrl,
    },
    contactTradingServiceBonusIds: '[]',
    tokenCaptcha: state.tokenCaptcha,
    contactType,
  };
  // eslint-comments no-unused-vars
  for (const [key, value] of Object.entries(input.contactTradingInfo)) {
    if (value === null || value?.length === 0) {
      delete input.contactTradingInfo[key];
    }
  }
  return input;
};

const CreateContactRequestScreen2 = ({navigation}) => {
  const {
    state: moduleState,
    updateCreateContactRequestInfo,
    resetCreateContactRequestInfo,
  } = useContext(ContactTradingContext);
  const createContactRequestInfo = moduleState.createContactRequestInfo ?? {};
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...mapContactInfo(createContactRequestInfo.contactInfo),
    agentInfo: {...moduleState.agentInfo},
    errors: initialErrorState,
  });
  const [successPopupProps, setSuccessPopupProps] = useState({
    showPopup: false,
    contactTradingIdAfterCreateSucceed: '',
  });
  const errors = state.errors;
  const isAgentUser = useSelector(isAgent);
  const [isMe, setIsMe] = useState(false);
  const {showErrorAlert} = useContext(AppContext);
  const {agentInfo} = state;

  const setErrors = value => {
    dispatch({type: CONTACT_ACTIONS.SET_ERROR_STATE, payload: value});
  };

  const setField = (field, value) => {
    dispatch({
      type: CONTACT_ACTIONS.FIELD,
      [CONTACT_FIELD.fieldName]: field,
      payload: value,
    });
  };

  const setFullName = value => {
    setField('fullName', value);
  };
  const setPhoneNumber = value => {
    setField('phoneNumber', value);
  };
  const setEmail = value => {
    setField('email', value);
  };

  const onChangeIsMe = checked => {
    if (checked) {
      const {firstName, lastName, phoneNumber, email} = state.agentInfo;
      const fullName = getUserFullName({firstName, lastName});
      setFullName(fullName);
      setPhoneNumber(phoneNumber);
      setEmail(email);
    } else {
      setFullName('');
      setPhoneNumber('');
      setEmail('');
    }
    setIsMe(checked);
  };

  const setCaptcha = value => {
    setField('tokenCaptcha', value);
  };

  const handleOnDoneCreate = response => {
    if (response) {
      if (response.errorCode === 0) {
        setSuccessPopupProps({
          contactTradingIdAfterCreateSucceed: response?.contactTradingId,
          showPopup: true,
        });
      } else {
        showErrorAlert(response?.errorMessageCode);
      }
    }
  };

  const [startCreateContactTrading] = CreateContactTrading({onSuccessResponse: handleOnDoneCreate});

  const handleOnPressNext = () => {
    const errorState = validateForm(state);
    setErrors(errorState);
    if (!errorState.isValid) {
      return;
    }
    const input = mapStateToCreateRequestInfo({
      agentInfo,
      state,
      isAgentUser,
      createContactRequestInfo,
    });
    startCreateContactTrading(input);
  };

  const updateContactInfoToProvider = () => {
    const contactInfo = {
      fullName: state.fullName,
      phoneNumber: state.phoneNumber,
      email: state.email,
    };
    updateCreateContactRequestInfo({...createContactRequestInfo, contactInfo});
  };
  useEffect(updateContactInfoToProvider, [state.fullName, state.phoneNumber, state.email]);

  const handleOnPressCancel = () => {
    navigation.goBack();
  };

  const renderCustomerInfoInputs = () => {
    return (
      <>
        <InputSection
          headerTitle={translate(STRINGS.FULLNAME)}
          headerStyles={styles.inputTitle}
          placeholder={translate(STRINGS.ENTER_FULL_NAME)}
          inputStyle={commonStyles.input}
          value={state.fullName}
          error={errors.fullName}
          isRequired
          editable={!isMe}
          onChangeText={setFullName}
        />
        <View style={commonStyles.separatorRow16} />
        <InputSection
          headerTitle={translate(STRINGS.PHONE_NUMBER)}
          headerStyles={styles.inputTitle}
          placeholder={translate(STRINGS.ENTER_PHONE_NUMBER)}
          inputStyle={commonStyles.input}
          value={state.phoneNumber}
          keyboardType={KEY_BOARD_TYPE.PHONE_NUMBER}
          error={errors.phoneNumber}
          isRequired
          editable={!isMe}
          onChangeText={setPhoneNumber}
        />
        <View style={commonStyles.separatorRow16} />
        <InputSection
          headerTitle={translate(STRINGS.EMAIL)}
          headerStyles={styles.inputTitle}
          placeholder={translate(STRINGS.ENTER_EMAIL_ADDRESS)}
          inputStyle={commonStyles.input}
          value={state.email}
          keyboardType={KEY_BOARD_TYPE.EMAIL}
          error={errors.email}
          editable={!isMe}
          onChangeText={setEmail}
        />
        <View style={commonStyles.separatorRow16} />
        <CaptchaV2 onSendToken={setCaptcha} />
        <View style={commonStyles.separatorRow24} />
      </>
    );
  };

  const onContinueSearch = () => {
    resetCreateContactRequestInfo();
    const contactType = createContactRequestInfo?.contactType;
    setSuccessPopupProps({...successPopupProps, showPopup: false});
    navigation.navigate(ScreenIds.ManageBuyRequest, {
      typeSelect: ContactType.C2C,
    });
    navigation.navigate(ScreenIds.Search, {
      tabIndex:
        contactType === CONTACT_TRADING_TYPE.RENT
          ? SEARCH_TYPE_INDEX.RENTAL
          : SEARCH_TYPE_INDEX.C2C,
    });
  };

  const onViewDetail = () => {
    resetCreateContactRequestInfo();
    setSuccessPopupProps({...successPopupProps, showPopup: false});
    navigation.navigate(ScreenIds.ManageBuyRequest, {
      typeSelect: ContactType.C2C,
    });
    navigation.navigate(ScreenIds.RequestDetailStack, {
      screen: ScreenIds.RequestDetail,
      params: {
        requestId: successPopupProps.contactTradingIdAfterCreateSucceed,
        isSending: true,
      },
    });
  };

  return (
    <BaseScreen
      title={translate(STRINGS.CUSTOMER_INFO)}
      testID={ScreenIds.CreateContactRequest2}
      containerStyle={styles.baseScreenContainer}
      keyboardAvoidingViewContainer
      modals={
        <ModalPopup
          contentContainerStyle={styles.successPopupStyle}
          visible={successPopupProps.showPopup}
          animationType="slide">
          <ContactSuccessContainer
            onPressDetail={onViewDetail}
            onPressContinue={onContinueSearch}
            title={translate('contactTrading.success.title')}
            subTitle={translate('contactTrading.success.description')}
            continueButtonTitle={translate('common.continueSearch')}
            detailButtonTitle={translate(STRINGS.VIEW_DETAIL)}
          />
        </ModalPopup>
      }>
      <KeyboardScrollView contentStyle={styles.bodyContainer}>
        <View style={METRICS.horizontalPadding}>
          <CustomCheckbox
            title={
              createContactRequestInfo?.contactType === CONTACT_TRADING_TYPE.BUY
                ? translate(STRINGS.IS_BUYER)
                : translate('propertyPost.isRenter')
            }
            style={styles.checkBoxIsMe}
            onChange={onChangeIsMe}
          />
          {renderCustomerInfoInputs()}
        </View>
        <View style={[commonStyles.footerContainer, styles.spaceBetween]}>
          <CreateRequestFooterButtons
            onPressCancel={handleOnPressCancel}
            onPressNext={handleOnPressNext}
            nextButtonSubTitle="2/2"
            nextButtonTitle={translate(STRINGS.CREATE_NEW)}
          />
        </View>
      </KeyboardScrollView>
    </BaseScreen>
  );
};

export default CreateContactRequestScreen2;
