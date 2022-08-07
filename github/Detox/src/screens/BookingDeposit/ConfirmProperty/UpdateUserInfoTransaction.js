import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import React, {useContext, useEffect, useReducer, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {UpdateTopenerInfoForTransactionInput} from '../../../api/graphql/generated/graphql';
import {AppContext} from '../../../appData/appContext/appContext';
import {GENDER_ARRAY, GLOBAL_ACTIONS, IDENTIFY_TYPE, MAX_LENGTH} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import {getCities} from '../../../components/AgentInfoContainer';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import DatePickerSection from '../../../components/Button/DatePickerSection';
import CustomCheckbox from '../../../components/Checkbox/CustomCheckbox';
import CitiesDistrictsWards from '../../../components/CitiesDistrictsWards';
import CitiesDistrictsWardsContact from '../../../components/CitiesDistrictsWardsContact';
import InputSection from '../../../components/InputSection';
import RadioSelectionsView, {ITEM_TYPE} from '../../../components/RadioSelectionsView';
import RequiredLabel from '../../../components/RequiredLabel';
import {validateFields} from '../../../utils/ErrorHandler';
import {timestampToDate} from '../../../utils/TimerCommon';
import ValidateInput from '../../../utils/ValidateInput';
import {useMount} from '../../commonHooks';
import {mappingAddressToPlace} from '../../Profile/CreateEditProfile/BasicAgentProfileComponent';
import {useUpdateTopenerInfoForTransaction} from '../useUpdateTopenerInfoForTransaction';
import {Price} from './ConfirmPropertyComponents';

function reducer(state: UpdateTopenerInfoForTransactionInput, action) {
  switch (action.type) {
    case GLOBAL_ACTIONS.FIELD:
      return {...state, [action.fieldName]: action.payload};
    case GLOBAL_ACTIONS.CHANGE_ACREAGES:
      return {...state, [action.fieldName]: action.payload};
    case GLOBAL_ACTIONS.SET_ADDRESS_CITY:
      return {
        ...state,
        permanentAddress: {...state.permanentAddress, city: action.payload},
      };
    case GLOBAL_ACTIONS.SET_ADDRESS_DISTRICT:
      return {
        ...state,
        permanentAddress: {...state.permanentAddress, district: action.payload},
      };
    case GLOBAL_ACTIONS.SET_ADDRESS_WARD:
      return {
        ...state,
        permanentAddress: {...state.permanentAddress, ward: action.payload},
      };

    case GLOBAL_ACTIONS.SET_ADDRESS_STREET:
      return {
        ...state,
        permanentAddress: {...state.permanentAddress, street: action.payload},
      };

    case GLOBAL_ACTIONS.SET_COPY_SAME_ADDRESS:
      return {
        ...state,
        contactAddress: action.payload,
      };

    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_CITY:
      return {
        ...state,
        contactAddress: {...state.contactAddress, city: action.payload},
      };
    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_DISTRICT:
      return {
        ...state,
        contactAddress: {...state.contactAddress, district: action.payload},
      };
    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_WARD:
      return {
        ...state,
        contactAddress: {...state.contactAddress, ward: action.payload},
      };
    case GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_STREET:
      return {
        ...state,
        contactAddress: {...state.contactAddress, street: action.payload},
      };
    case GLOBAL_ACTIONS.SET_ALL_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return {...state};
  }
}

const checkValidAddress = permanentAddress => {
  return {
    errCity: permanentAddress?.city?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errDistrict: permanentAddress?.district?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errWard: permanentAddress?.ward?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errAddress: permanentAddress?.street ? '' : translate(STRINGS.REQUIRE_CHOOSE),
  };
};

const checkValidContactAddress = contactAddress => {
  return {
    errContactCity: contactAddress?.city?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errContactDistrict: contactAddress?.district?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errerrContactWard: contactAddress?.ward?.id ? '' : translate(STRINGS.REQUIRE_CHOOSE),
    errContactAddress: contactAddress?.street ? '' : translate(STRINGS.REQUIRE_CHOOSE),
  };
};

const BASIC_FIELD_VALIDATORS = {
  firstName: ValidateInput.checkName,
  lastName: ValidateInput.checkName,
  phoneNumber: ValidateInput.checkMobilePhone,
  nationalId: ValidateInput.checkIdentity,
  nationalIdIssueDate: ValidateInput.checkName,
  nationalIdIssuePlace: ValidateInput.checkName,
  permanentAddress: ValidateInput.checkName,
  contactAddress: ValidateInput.checkName,
  email: ValidateInput.checkEmail,
  dob: ValidateInput.checkName,
  gender: ValidateInput.validateGender,
  nationalIdType: ValidateInput.checkRequiredField,
};

const validate = state => {
  const errs = validateFields(state, BASIC_FIELD_VALIDATORS);
  const eAddress = checkValidAddress(state.permanentAddress);
  const eContactAddress = checkValidContactAddress(state.contactAddress);
  const errorValue = {
    ...errs,
    ...eAddress,
    ...eContactAddress,
  };
  return pickBy(errorValue);
};

const useUpdateInfoTransaction = ({
  topenerInfo,
  contextType,
  bookingFee,
  callBackAfterUpdateProfile,
}) => {
  const [state, dispatch] = useReducer(reducer, topenerInfo);
  const [errors, setErrors] = useState({});
  const {getMasterData} = useContext(AppContext);
  const [submitOnce, setSubmitOnce] = useState(false);
  const [addressCities, setAddressCities] = useState([]);
  const [contactCities, setContactCities] = useState([]);
  const [isSameAddress, setIsSameAddress] = useState(false);
  const masterData = getMasterData();
  const {updateTopenerInfoTransaction} = useUpdateTopenerInfoForTransaction({
    onSuccess: data => {
      callBackAfterUpdateProfile(data);
    },
  });

  function loadCitiesDistricts() {
    if (masterData) {
      setAddressCities(getCities(masterData, state.permanentAddress?.city));
      setContactCities(getCities(masterData, state.contactAddress?.city));
    }
  }

  useMount(() => {
    loadCitiesDistricts();
  });

  const onChangeContactStreet = text => {
    dispatch({type: GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_STREET, payload: text});
  };

  const onChangePermanentStreet = text => {
    dispatch({type: GLOBAL_ACTIONS.SET_ADDRESS_STREET, payload: text});
  };

  const onChangeState = ({field, value}) => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: field, payload: value});
  };

  const mapStateToQueryData = () => {
    const contactAddress = JSON.stringify(
      mappingAddressToPlace(isSameAddress ? state.permanentAddress : state.contactAddress),
    );
    const tempState = {
      permanentAddress: JSON.stringify(mappingAddressToPlace(state.permanentAddress)),
      contactAddress: contactAddress,
      firstName: state?.firstName,
      lastName: state?.lastName,
      email: state?.email,
      dob: timestampToDate(state?.dob),
      phoneNumber: state?.phoneNumber,
      nationalId: state?.nationalId,
      nationalIdIssueDate: timestampToDate(state?.nationalIdIssueDate)?.getTime(),
      nationalIdIssuePlace: state?.nationalIdIssuePlace,
      nationalIdType: state?.nationalIdType?.value,
      gender: state?.gender?.value,
    };
    return tempState;
  };

  useEffect(() => {
    if (!submitOnce) {
      return;
    }
    const errorData = validate(state);
    if (!isEmpty(errorData)) {
      setErrors(errorData);
    } else {
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onSubmit = () => {
    !submitOnce && setSubmitOnce(true);
    const errs = validate(state);
    if (!isEmpty(errs)) {
      setErrors(errs);
    } else {
      updateTopenerInfoTransaction(mapStateToQueryData());
    }
  };

  const checkIsSameAddress = data => {
    setIsSameAddress(data);
    if (data) {
      const listCities = cloneDeep(addressCities);
      setContactCities(listCities);
      dispatch({type: GLOBAL_ACTIONS.SET_COPY_SAME_ADDRESS, payload: state?.permanentAddress});
    } else {
      setContactCities(getCities(masterData, {}));
      dispatch({type: GLOBAL_ACTIONS.SET_COPY_SAME_ADDRESS, payload: {}});
    }
  };

  const props = {
    onChangeState,
    state,
    onSubmit,
    dispatch,
    addressCities,
    contactCities,
    onChangeContactStreet,
    onChangePermanentStreet,
    errors,
    contextType,
    bookingFee,
    checkIsSameAddress,
    isSameAddress,
  };
  return props;
};

const UpdateUserInfoTransactionScreen = ({route}) => {
  const {topenerInfo, callBackAfterUpdateProfile, contextType, bookingFee} = route.params;
  const props = useUpdateInfoTransaction({
    topenerInfo,
    callBackAfterUpdateProfile,
    contextType,
    bookingFee,
  });
  return (
    <BaseScreen title={translate('updateInfoTransaction.title')}>
      <UpdateUserInfoTransaction {...props} />
    </BaseScreen>
  );
};

export const UpdateUserInfoTransaction = ({
  onChangeState,
  onChangeContactStreet,
  onChangePermanentStreet,
  addressCities,
  contactCities,
  dispatch,
  onSubmit,
  state,
  errors,
  contextType,
  bookingFee,
  checkIsSameAddress,
  isSameAddress,
}) => {
  return (
    <>
      <View style={styles.viewInfo}>
        <Image source={IMAGES.IC_STATUS_INFO} />
        <Text style={styles.textInfo}>{translate('updateInfoTransaction.updateInfo')}</Text>
      </View>
      <KeyboardAwareScrollView style={{paddingHorizontal: SIZES.PADDING_16}}>
        <InputSection
          isRequired
          headerTitle={translate('updateInfoTransaction.name')}
          placeholder={translate('updateInfoTransaction.placeHolder.name')}
          inputStyle={styles.inputSection}
          onChangeText={text => onChangeState({field: 'lastName', value: text})}
          value={state.lastName}
          error={errors.lastName}
        />
        <InputSection
          isRequired
          headerTitle={translate('updateInfoTransaction.firstName')}
          placeholder={translate('updateInfoTransaction.placeHolder.firstName')}
          inputStyle={styles.inputSection}
          onChangeText={text => onChangeState({field: 'firstName', value: text})}
          value={state.firstName}
          error={errors.firstName}
        />
        <DatePickerSection
          value={state.dob}
          placeholder={translate('updateInfoTransaction.birthDay')}
          onChosen={data => onChangeState({field: 'dob', value: data})}
          headerTitle={translate('updateInfoTransaction.birthDay')}
          error={errors.dob}
        />
        <RadioSelectionsView
          initValue={state?.gender === 'NA' ? null : state?.gender}
          data={GENDER_ARRAY}
          isRequired
          headerTitle={translate(STRINGS.GENDER)}
          type={ITEM_TYPE.DEFAULT}
          headerStyle={styles.radioHeader}
          customStyle={{marginBottom: normal}}
          onChosen={data => onChangeState({field: 'gender', value: data})}
          error={errors.gender}
        />
        <InputSection
          isRequired
          headerTitle={translate('updateInfoTransaction.email')}
          placeholder={translate('updateInfoTransaction.placeHolder.email')}
          inputStyle={styles.inputSection}
          onChangeText={text => onChangeState({field: 'email', value: text})}
          value={state.email}
          error={errors.email}
        />
        <InputSection
          isRequired
          headerTitle={translate('updateInfoTransaction.phone')}
          placeholder={translate('updateInfoTransaction.placeHolder.phone')}
          inputStyle={styles.inputSection}
          onChangeText={text => onChangeState({field: 'phone', value: text})}
          value={state.phoneNumber}
          error={errors.phoneNumber}
        />
        <RadioSelectionsView
          isRequired
          initValue={state?.nationalIdType}
          data={IDENTIFY_TYPE}
          headerTitle={translate('common.identifyType')}
          type={ITEM_TYPE.DEFAULT}
          customStyle={{marginBottom: normal}}
          headerStyle={{...FONTS.bold, color: COLORS.TEXT_DARK_10}}
          onChosen={data => onChangeState({field: 'nationalIdType', value: data})}
          error={errors.nationalIdType}
        />
        <InputSection
          isRequired
          headerTitle={translate('updateInfoTransaction.identify')}
          placeholder={translate('updateInfoTransaction.placeHolder.identify')}
          inputStyle={styles.inputSection}
          onChangeText={text => onChangeState({field: 'nationalId', value: text})}
          value={state.nationalId}
          error={errors.nationalId}
        />
        <DatePickerSection
          value={state.nationalIdIssueDate}
          placeholder={translate('updateInfoTransaction.datePlaceHolder')}
          onChosen={text => onChangeState({field: 'nationalIdIssueDate', value: text})}
          headerTitle={translate('updateInfoTransaction.nationalIdIssueDate')}
          error={errors.nationalIdIssueDate}
        />
        <InputSection
          isRequired
          headerTitle={translate('updateInfoTransaction.nationalIdIssuePlace')}
          placeholder={translate('updateInfoTransaction.placeHolder.issuePlace')}
          inputStyle={styles.inputSection}
          onChangeText={text => onChangeState({field: 'nationalIdIssuePlace', value: text})}
          value={state.nationalIdIssuePlace}
          error={errors.nationalIdIssuePlace}
        />

        <RequiredLabel
          isRequired={false}
          title={translate(STRINGS.PERMANENT_ADDRESS)}
          titleStyle={styles.labelAddress}
        />
        <CitiesDistrictsWards
          errors={errors}
          state={state}
          dispatch={dispatch}
          cities={addressCities}
        />
        <InputSection
          headerTitle={translate(STRINGS.PERMANENT_ADDRESS_PLACEHOLDER)}
          onChangeText={onChangePermanentStreet}
          customStyle={{...METRICS.marginTop}}
          inputStyle={commonStyles.inputBorder}
          value={state.permanentAddress?.street}
          error={errors?.errAddress}
          maxLength={MAX_LENGTH.default}
        />
        <RequiredLabel
          isRequired={false}
          title={translate(STRINGS.PERMANENT_ADDRESS)}
          titleStyle={styles.labelAddress}
        />
        <CustomCheckbox
          title={translate('updateInfoTransaction.copyAddress')}
          onChange={checkIsSameAddress}
        />
        {!isSameAddress && (
          <>
            <CitiesDistrictsWardsContact
              state={state}
              errors={errors}
              dispatch={dispatch}
              cities={contactCities}
            />
            <InputSection
              headerTitle={translate(STRINGS.PERMANENT_ADDRESS_PLACEHOLDER)}
              onChangeText={onChangeContactStreet}
              customStyle={{...METRICS.marginTop}}
              inputStyle={commonStyles.inputBorder}
              value={state.contactAddress?.street}
              error={errors?.errContactAddress}
              maxLength={MAX_LENGTH.default}
            />
          </>
        )}
      </KeyboardAwareScrollView>
      <View style={{backgroundColor: COLORS.NEUTRAL_WHITE, padding: normal}}>
        <Price type={contextType} price={bookingFee} />
        <CustomButton
          mode="primary"
          style={{marginTop: SIZES.MARGIN_8}}
          title={translate('common.next')}
          onPress={onSubmit}
        />
      </View>
    </>
  );
};

export default UpdateUserInfoTransactionScreen;

const styles = StyleSheet.create({
  labelAddress: {
    marginTop: SIZES.MARGIN_16,
    fontSize: SIZES.FONT_20,
    ...FONTS.bold,
    color: COLORS.TEXT_DARK_10,
  },
  viewInfo: {
    backgroundColor: COLORS.STATE_INFO_BG,
    alignItems: 'center',
    padding: SIZES.PADDING_16,
    flexDirection: 'row',
  },
  textInfo: {flex: 1, ...FONTS.regular, marginLeft: small},
  inputSection: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  radioHeader: {marginVertical: normal, ...FONTS.bold, color: COLORS.TEXT_DARK_10},
});
