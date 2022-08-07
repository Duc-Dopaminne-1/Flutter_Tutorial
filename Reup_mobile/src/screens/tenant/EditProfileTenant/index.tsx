import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, Keyboard, KeyboardAvoidingView, Alert } from "react-native";

import styles from './styles';
import Container from '@src/components/Container';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import CustomSectionHeader from '@src/components/CustomSection';
import translate from '@src/localize';
import PERSONAL_DETAIL from '@res/icons/personal.png';
import CREDIT_CARD from '@res/icons/ic_creditcard.png';
import CONTACT_DETAIL from '@res/icons/contact.png';

import { EditType } from '../MyProfileTenant';
import { Formik } from 'formik';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { CustomButton } from '@src/components/CustomButton';
import { isAndroid, getKeyboardAdvoidStyle } from '@src/utils';
import CustomAccessory from '@src/components/CustomAccessory';
import { object, string } from 'yup';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import getStyles from '@src/utils/getStyles';
import CustomDateTimePicker, { getToday } from '@src/components/CustomDateTimePicker';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import moment from 'moment';
import CustomPhoneInput from '@src/components/CustomPhoneInput';
import { updateProfile } from '@src/modules/auth/actions';
import { RootState } from '@src/types/types';
import NavigationActionsService from '@src/navigation/navigation';
import { phoneRegExp } from '@src/utils/validation';
import { IUserProfile, IDType } from '@reup/reup-api-sdk/libs/api/user/models';
import { findIndex } from 'lodash';
import { Config } from '@src/configs/appConfig';
import { formatApiToUI, formatDateWith } from '@src/utils/date';

interface Props {

}
let isShowKeyboard = false;
const EditProfileTenant = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { typeEdit } = route.params as any;
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];
  const telephoneRef = useRef(null);
  const cellphoneRef = useRef(null);
  const [paddingBottom, setPaddingBottom] = useState(0);
  let inputNumb = 5;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const idType = useSelector<RootState, IDType[]>((state: RootState) => state.config.idType!);
  const [dateStart, setDateStart] = useState(me && me.date_of_birth ? formatApiToUI(me.date_of_birth) : getToday());
  const initialValuePersonal = {
    firstName: me && me.first_name ? me.first_name : '',
    lastName: me && me.last_name ? me.last_name : '',
    dob: me && me.date_of_birth ? formatApiToUI(me.date_of_birth) : '',
    idType: me && me.identity_type ? me.identity_type : '',
    idNo: me && me.identity_code ? me.identity_code : '',
  };

  const initialValueContact = {
    telephone: me && me.phone ? (me.phone_code ? me.phone_code : "") + me.phone : '',
    telephoneCode: me && me.phone_code ? me.phone_code : '',
    telephoneFake: me && me.phone ? me.phone : '',
    cellphone: me && me.phone1 ? (me.phone1_code ? me.phone1_code : "") + me.phone1 : '',
    cellphoneCode: me && me.phone1_code ? me.phone1_code : '',
    cellphoneFake: me && me.phone1 ? me.phone1 : '',
    address: me && me.address ? me.address : '',
  };

  const initialValueCredit = {
    cardowner: '',
    cardno: '',
    expiredDate: ''
  };

  const arrDataIDType = [
    { _key: '', _value: 'Please Choose' },
  ];

  idType && idType.map((obj: IDType) => {
    const objIDType = { _key: obj.id, _value: obj.title };
    arrDataIDType.push(objIDType);
  });

  const keyboardDidShow = () => {
    if (isShowKeyboard) {
      if (paddingBottom === 44) {
        return;
      }
      setPaddingBottom(44);
      return;
    }
    isShowKeyboard = true;
    if (paddingBottom === 0) {
      return;
    }
    setPaddingBottom(0);
  };

  const keyboardDidHide = () => {
    isShowKeyboard = false;
    setPaddingBottom(0);
  };


  useEffect(() => {
    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    isShowKeyboard = false;
    return () => {
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    };
  }, []);

  const validationSchemaPersonal = object().shape({
    firstName: string()
      .trim()
      .required(`${translate('edit_profile.first_name_valid')}`),
    lastName: string()
      .trim()
      .required(`${translate('edit_profile.last_name_valid')}`),
    dob: string()
      .required(`${translate('edit_profile.dob_valid')}`)
      .test(
        'dob',
        `${translate('edit_profile.dob_valid')}`,
        value => {
          return moment().diff(moment(value, 'DD-MM-YYYY'), 'years') >= 18;
        }
      ),
    idType: string()
      .trim()
      .required(`${translate('edit_profile.id_type_valid')}`),
    idNo: string()
      .trim()
      .required(`${translate('edit_profile.id_no_valid')}`)
  });

  const validationSchemaContact = object().shape({
    telephone: string()
      .trim()
      .matches(phoneRegExp, `${translate('error_validate_field.phone_number_not_valid')}`)
      .required(`${translate('edit_profile.telephone_valid')}`),
    telephoneFake: string()
      .trim(),
    cellphone: string()
      .trim()
      .matches(phoneRegExp, `${translate('error_validate_field.phone_number_not_valid')}`)
      .required(`${translate('edit_profile.cellphone_valid')}`),
    cellphoneFake: string()
      .trim(),
    address: string()
      .trim()
      .required(`${translate('edit_profile.address_valid')}`)
  });

  const validationSchemaCreditCard = object().shape({
    cardowner: string()
      .trim()
      .required(`${translate('edit_profile.cardowner_valid')}`),
    cardno: string()
      .trim()
      .required(`${translate('edit_profile.cardno_valid')}`),
    expiredDate: string()
      .trim()
      .required(`${translate('edit_profile.expired_valid')}`)
  });

  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

  const nextInput = () => {
    const currentInput = getInputRef(currentInputIndex);
    currentInput.dismiss && currentInput.dismiss();

    setTimeout(() => {
      return getInputRef(currentInputIndex + 1).focus();
    });
  };

  const previousInput = () => {
    getInputRef(currentInputIndex).dismiss && getInputRef(currentInputIndex).dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex - 1).focus();
    });
  };

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const getLogo = () => {
    switch (typeEdit) {
      case EditType.PERSONAL:
        inputNumb = 5;
        return PERSONAL_DETAIL;
      case EditType.CREDIT_CARD:
        inputNumb = 3;
        return CREDIT_CARD;
      case EditType.CONTACT:
        inputNumb = 3;
        return CONTACT_DETAIL;
    }
  };

  const getSchemeValid = () => {
    switch (typeEdit) {
      case EditType.PERSONAL:
        return validationSchemaPersonal;
      case EditType.CREDIT_CARD:
        return validationSchemaCreditCard;
      case EditType.CONTACT:
        return validationSchemaContact;
    }
  };

  const getTitleHeader = () => {
    switch (typeEdit) {
      case EditType.PERSONAL:
        return translate("edit_profile.personal_details");
      case EditType.CREDIT_CARD:
        return translate("edit_profile.credit_card");
      case EditType.CONTACT:
        return translate("edit_profile.contact_details");
    }
  };

  const getInitValue = () => {
    switch (typeEdit) {
      case EditType.PERSONAL:
        return initialValuePersonal;
      case EditType.CREDIT_CARD:
        return initialValueCredit;
      case EditType.CONTACT:
        return initialValueContact;
    }
    return {};
  };

  const renderHeader = () => (
    <CustomSectionHeader
      style={styles.sectionHeader}
      title={getTitleHeader()}
      icon={getLogo()}
    />
  );

  const renderKeyboardAccessory = () => (
    <KeyboardAccessoryView style={{ padding: 0, height: 45 }} androidAdjustResize>
      <CustomAccessory
        currentInputIndex={currentInputIndex}
        numberOfInput={inputNumb}
        onPressDown={nextInput}
        onPressUp={previousInput}
        onPressDone={doneTyping}
      />
    </KeyboardAccessoryView>
  );

  const onSubmitEditProfile = (values: any) => {
    Keyboard.dismiss();
    let dataProfile = {};
    if (typeEdit == EditType.PERSONAL) {
      dataProfile = {
        first_name: values.firstName,
        last_name: values.lastName,
        date_of_birth: formatDateWith(values.dob, Config.Tenant.formatDate, Config.Tenant.formatDateDisplay),
        identity_type: values.idType,
        identity_code: values.idNo,
      };
    } else if (typeEdit == EditType.CONTACT) {
      dataProfile = {
        phone: values.telephoneFake,
        phone_code: values.telephoneCode,
        phone1: values.cellphoneFake,
        phone1_code: values.cellphoneCode,
        address: values.address
      };
    }

    NavigationActionsService.showLoading();
    dispatch(
      updateProfile({
        data: dataProfile,
        onSuccess: () => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            NavigationActionsService.pop();
          }, 200);
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert('updateProfile', error.message);
          }, 700);
        },
      }));
  };

  const onChangeIDType = (obj: ObjDropdown, setFieldValue: any) => {
    if (obj._key) {
      setFieldValue('idType', obj._key);
      return;
    }
    setFieldValue('idType', '');
  };

  const onDateChangeStart = (date: any, setFieldValue: any) => {
    setDateStart(date);
    setFieldValue('dob', date);
  };

  const renderMain = () => {
    switch (typeEdit) {
      case EditType.PERSONAL:
        return renderInputPersonal();
      case EditType.CREDIT_CARD:
        return renderInputCreditCard();
      case EditType.CONTACT:
        return renderInputContact();
    }
  };

  const renderInputPersonal = () => {
    return (
      <Formik initialValues={getInitValue()}
        onSubmit={onSubmitEditProfile}
        validationSchema={getSchemeValid()}>
        {({ handleSubmit, values, errors, setFieldValue, touched, handleChange, handleBlur }: any) => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('edit_profile.first_name')}`}
                  onChangeText={handleChange('firstName')}
                  returnKeyType="next"
                  value={values.firstName}
                  onFocus={() => setCurrentInputIndex(0)}
                  onBlur={handleBlur('firstName')}
                />
                <ErrorMessage errorValue={touched.firstName && errors.firstName} />
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('edit_profile.last_name')}`}
                  onChangeText={handleChange('lastName')}
                  returnKeyType="next"
                  value={values.lastName}
                  onFocus={() => setCurrentInputIndex(1)}
                  onBlur={handleBlur('lastName')}
                />
                <ErrorMessage errorValue={touched.lastName && errors.lastName} />
                <CustomDateTimePicker
                  ref={putInputRef.bind(undefined)}
                  onFocus={() => setCurrentInputIndex(2)}
                  date={dateStart}
                  description={`${translate('edit_profile.dob')}`}
                  onDateChange={(date: any) => {
                    onDateChangeStart(date, setFieldValue);
                  }} />
                <ErrorMessage errorValue={touched.dob && errors.dob} />
                <CustomDropdownSelect
                  onFocus={() => setCurrentInputIndex(3)}
                  numberOfInput={inputNumb}
                  currentInputIndex={currentInputIndex}
                  onPressUp={previousInput}
                  onPressDown={nextInput}
                  inputRef={(input: any) => putInputRef(input)}
                  textTitle={translate('edit_profile.id_type')}
                  arrData={arrDataIDType}
                  contentDropdownStyle={styles.contentDropdownStyle}
                  containerStyle={styles.dropdownContainer}
                  textStyle={styles.textStyle}
                  selected={findIndex(arrDataIDType, { _key: values.idType })}
                  lineBottom={true}
                  onChangeDropDown={(object) => {
                    onChangeIDType(object, setFieldValue);
                    handleBlur('idType');
                  }}
                />
                <ErrorMessage errorValue={touched.idType && errors.idType} />
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('edit_profile.id_no')}`}
                  onChangeText={handleChange('idNo')}
                  returnKeyType="next"
                  value={values.idNo}
                  onFocus={() => setCurrentInputIndex(4)}
                  onBlur={handleBlur('idNo')}
                />
                <ErrorMessage errorValue={touched.idNo && errors.idNo} />

              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={handleSubmit}
                text={translate('edit_profile.submit')}
                style={styles.button} />
            </View>
          </View>
        )}
      </Formik>
    );
  };

  const renderInputContact = () => {
    return (
      <Formik initialValues={getInitValue()}
        onSubmit={onSubmitEditProfile}
        validationSchema={getSchemeValid()}>
        {({ handleSubmit, values, errors, setValues, touched, handleChange, handleBlur }: any) => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>
                <CustomPhoneInput
                  inputRef={(input: any) => {
                    telephoneRef.current = input;
                    putInputRef(input);
                  }}
                  description={`${translate('edit_profile.telephone')}`}
                  countryCodeValue={values.telephoneCode}
                  onFocus={() => setCurrentInputIndex(0)}
                  onChangePhoneNumber={(telephoneFake: string, telephone: string, telephoneCode: string) => {
                    setValues({ ...values, telephoneFake, telephone, telephoneCode });
                  }}
                  returnKeyType="next"
                  value={values.telephoneFake}
                  onBlur={handleBlur('phone')}
                />
                <ErrorMessage
                  errorValue={(touched.telephone
                    && errors.telephone)} />
                <CustomPhoneInput
                  inputRef={(input: any) => {
                    cellphoneRef.current = input;
                    putInputRef(input);
                  }}
                  description={`${translate('edit_profile.cellphone')}`}
                  countryCodeValue={values.cellphoneCode}
                  onFocus={() => setCurrentInputIndex(1)}
                  onChangePhoneNumber={(cellphoneFake: string, cellphone: string, cellphoneCode: string) => {
                    setValues({ ...values, cellphoneFake, cellphone, cellphoneCode });
                  }}
                  returnKeyType="next"
                  value={values.cellphoneFake}
                  onBlur={handleBlur('cellphone')}
                />
                <ErrorMessage
                  errorValue={(touched.cellphone
                    && errors.cellphone)} />

                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('edit_profile.address')}`}
                  onChangeText={handleChange('address')}
                  returnKeyType="next"
                  value={values.address}
                  onFocus={() => setCurrentInputIndex(2)}
                  onBlur={handleBlur('address')} />
                <ErrorMessage errorValue={touched.address && errors.address} />

              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={handleSubmit}
                text={translate('edit_profile.submit')}
                style={styles.button} />
            </View>
          </View>
        )}
      </Formik>
    );
  };

  const renderInputCreditCard = () => {
    return (
      <Formik initialValues={getInitValue()}
        onSubmit={onSubmitEditProfile}
        validationSchema={getSchemeValid()}>
        {({ handleSubmit, values, errors, touched, handleChange, handleBlur }: any) => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('edit_profile.card_owner')}`}
                  onChangeText={handleChange('cardowner')}
                  returnKeyType="next"
                  value={values.cardowner}
                  onFocus={() => setCurrentInputIndex(0)}
                  onBlur={handleBlur('cardowner')}
                />
                <ErrorMessage errorValue={touched.cardowner && errors.cardowner} />
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('edit_profile.card_no')}`}
                  onChangeText={handleChange('cardno')}
                  returnKeyType="next"
                  value={values.cardno}
                  onFocus={() => setCurrentInputIndex(1)}
                  onBlur={handleBlur('cardno')}
                />
                <ErrorMessage errorValue={touched.cardno && errors.cardno} />
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('edit_profile.expired_date')}`}
                  onChangeText={handleChange('expiredDate')}
                  returnKeyType="next"
                  value={values.expiredDate}
                  onFocus={() => setCurrentInputIndex(2)}
                  onBlur={handleBlur('expiredDate')}
                />
                <ErrorMessage errorValue={touched.expiredDate && errors.expiredDate} />
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={handleSubmit}
                text={translate('edit_profile.submit')}
                style={styles.button} />
            </View>
          </View>
        )}
      </Formik>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior={'padding'}>
        <Container
          spaceBottom={true}
          isShowHeader={true}
          isDisplayNotification={false}
          isDisplayMenuButton={false}
          title={translate("edit_profile.edit_profile")}
        >
          {renderHeader()}
          {renderMain()}
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View>
  );
};

export default EditProfileTenant;
