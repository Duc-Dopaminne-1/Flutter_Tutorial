import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { View, ScrollView, Keyboard, KeyboardAvoidingView, Alert, TouchableWithoutFeedback } from 'react-native';
import { ADD_PLUS } from '@src/constants/icons';
import Modal from 'react-native-modal';
import { CustomButton } from '@src/components/CustomButton';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { Formik } from 'formik';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string } from 'yup';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle, isAndroid } from '@src/utils';
import { HEIGHT } from '@src/constants/vars';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { CreateCompanyParams } from '@reup/reup-api-sdk/libs/api/company';
import { createCompany } from '@src/modules/Company/actions';
import { useDispatch, useSelector } from 'react-redux';
import NavigationActionsService from '@src/navigation/navigation';
import { RootState } from '@src/types/types';
import { ICompany } from '@reup/reup-api-sdk/libs/api/company/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICountry, IState } from '@reup/reup-api-sdk/libs/api/country/model';
import { getListState } from '@src/modules/Config/actions';
import { getCurrentUser } from '@src/modules/auth/actions';
import { useRoute } from '@react-navigation/native';
import { MAIN_SCREEN } from '@src/constants/screenKeys';
import { phoneRegExp } from '@src/utils/validation';
import CustomPhoneInput from '@src/components/CustomPhoneInput';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import { emailRegex } from '@src/constants/regex';

let isShowKeyboard = false;

const NewCompany = () => {
  const inputComponents: any[] = [];
  const route = useRoute();
  const { isFromComfirm = false } = route.params as any;
  const inputNumb = 6;
  const phoneRef = useRef(null);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const dispatch = useDispatch();
  const companyList = useSelector<RootState, IPagination<ICompany>>((state: RootState) => state.company.listCompany);
  const countryList = useSelector<RootState, IPagination<ICountry>>((state: RootState) => state.config.listCountry);
  const [countryDropdownList, setCountryDropdownList] = useState<ObjDropdown[]>([]);
  const [stateDropdownList, setStateDropdownList] = useState<ObjDropdown[]>([]);

  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [isStateModalVisible, setStateModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);
  const [selectedListState, setSelectedListState] = useState<string[]>([]);

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
    const countriesList: ObjDropdown[] = [];
    countryList.results.forEach((item) => {
      const obj: ObjDropdown = {
        _key: item.id + "",
        _value: item.name,
      };
      countriesList.push(obj);
    });
    setCountryDropdownList(countriesList);
  }, [companyList]);

  useEffect(() => {
    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    isShowKeyboard = false;
    return () => {
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    };
  }, []);

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

  const onFocus = (index: number) => {
    setCurrentInputIndex(index);
  };

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const initialValues = {
    companyName: '',
    companyAddress: '',
    taxCode: '',
    country: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    phoneFake: '',
    phoneCode: '',
  };

  const validationSchema = stateDropdownList.length > 0 ? object().shape({
    companyName: string()
      .trim()
      .required(`${translate('new_company.company_name')} ${translate('error.required')}`),
    companyAddress: string()
      .trim()
      .required(`${translate('new_company.company_address')} ${translate('error.required')}`),
    taxCode: string()
      .trim()
      .required(`${translate('new_company.tax_code')} ${translate('error.required')}`),
    country: string()
      .trim()
      .required(`${translate('new_company.country')} ${translate('error.required')}`),
    state: string()
      .trim()
      .required(`${translate('new_company.state')} ${translate('error.required')}`),
    zipCode: string()
      .trim()
      .required(`${translate('new_company.zip_code')} ${translate('error.required')}`),
    email: string()
      .trim()
      .required(`${translate('new_company.email')} ${translate('error.required')}`)
      .test(
        "email",
        translate("authentication.valid_email"),
        value => {
          if (validateEmail(value)) {
            return true;
          }
          return false;
        }
      ),
    phone: string()
      .trim()
      .matches(phoneRegExp, `${translate('error_validate_field.phone_number_not_valid')}`)
      .required(`${translate('new_building.phone_valid')}`),
    phoneFake: string()
      .trim(),
  }) : object().shape({
    companyName: string()
      .trim()
      .required(`${translate('new_company.company_name')} ${translate('error.required')}`),
    companyAddress: string()
      .trim()
      .required(`${translate('new_company.company_address')} ${translate('error.required')}`),
    taxCode: string()
      .trim()
      .required(`${translate('new_company.tax_code')} ${translate('error.required')}`),
    country: string()
      .trim()
      .required(`${translate('new_company.country')} ${translate('error.required')}`),
    state: string()
      .trim(),
    zipCode: string()
      .trim()
      .required(`${translate('new_company.zip_code')} ${translate('error.required')}`),
    email: string()
      .trim()
      .required(`${translate('new_company.email')} ${translate('error.required')}`)
      .test(
        "email",
        translate("authentication.valid_email"),
        value => {
          if (validateEmail(value)) {
            return true;
          }
          return false;
        }
      ),
    phone: string()
      .trim()
      .matches(phoneRegExp, `${translate('error_validate_field.phone_number_not_valid')}`)
      .required(`${translate('new_building.phone_valid')}`),
    phoneFake: string()
      .trim(),
  });

  const toMain = () => {
    NavigationActionsService.setRoot(MAIN_SCREEN);
  };

  const fetchListState = (countryId: string, setFieldValue: any) => {
    if (countryId !== "") {
      NavigationActionsService.showLoading();
      dispatch(
        getListState({
          countryId,
          onSuccess: (data) => {
            console.log("===== Success state data: ", data);
            const stateList: ObjDropdown[] = [];
            data && data.results.forEach((item: IState) => {
              const obj: ObjDropdown = {
                _key: item.id + "",
                _value: item.name,
              };
              stateList.push(obj);
            });
            NavigationActionsService.hideLoading();
            setStateDropdownList(stateList);
            setFieldValue("state", "");

          },
          onFail: error => {
            NavigationActionsService.hideLoading();
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        })
      );
    }
  };

  const onNewCompany = (values: any) => {
    const params: CreateCompanyParams = {
      name: values.companyName,
      address: values.companyAddress,
      tax_code: values.taxCode,
      country: Number(values.country),
      state: Number(values.state),
      zip: Number(values.zipCode),
      email: values.email,
      phone: values.phone,
      phone_code: values.phoneCode,
    };

    NavigationActionsService.showLoading();
    dispatch(createCompany({
      params: params,
      onSuccess: () => {
        dispatch(getCurrentUser({
          onSuccess: () => {
            NavigationActionsService.hideLoading();
            setTimeout(() => {
              if (isFromComfirm) {
                toMain();
                return;
              }
              NavigationActionsService.pop();
            }, 500);
          }
        }));
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }
    ));
  };

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

  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onOpenStateModal = () => {
    setStateModalVisible(true);
  };

  const onCloseStateModal = () => {
    setStateModalVisible(false);
  };

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);
    setSelectedListCountry(selectedList);

    if (selectedList !== []) {
      if (selectedList.length === 1) {
        countryDropdownList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
            setFieldValue('state', '');
            fetchListState(element._key, setFieldValue);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const onSelectStateDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setStateModalVisible(false);
    setSelectedListState(selectedList);

    if (selectedList !== []) {
      if (selectedList.length === 1) {
        stateDropdownList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const renderModalCountry = (setFieldValue: any) => {
    return <Modal
      key={'country'}
      hideModalContentWhileAnimating
      isVisible={isCountryModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseCountryModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={countryDropdownList}
        selectedList={selectedListCountry}
        onCloseModal={onCloseCountryModal}
        onDone={(selectedList: string[]) => {
          onSelectCountryDone(selectedList, setFieldValue, 'country');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  const renderModalState = (setFieldValue: any) => {
    return <Modal
      key={'state'}
      hideModalContentWhileAnimating
      isVisible={isStateModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseStateModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={stateDropdownList}
        selectedList={selectedListState}
        onCloseModal={onCloseStateModal}
        onDone={(selectedList: string[]) => {
          onSelectStateDone(selectedList, setFieldValue, 'state');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderInputField = () => {
    return (
      <Formik initialValues={initialValues} onSubmit={onNewCompany} validationSchema={validationSchema} >
        {formikProps => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('new_company.company_name')}:`}
                  onChangeText={formikProps.handleChange('companyName')}
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={formikProps.values.companyName}
                  onFocus={() => onFocus(0)}
                  onBlur={formikProps.handleBlur('companyName')}
                />
                <ErrorMessage errorValue={formikProps.touched.companyName && formikProps.errors.companyName} />
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('new_company.company_address')}:`}
                  onChangeText={formikProps.handleChange('companyAddress')}
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={formikProps.values.companyAddress}
                  onFocus={() => onFocus(1)}
                  onBlur={formikProps.handleBlur('companyAddress')}
                />
                <ErrorMessage errorValue={formikProps.touched.companyAddress && formikProps.errors.companyAddress} />
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('new_company.tax_code')}:`}
                  onChangeText={formikProps.handleChange('taxCode')}
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={formikProps.values.taxCode}
                  onFocus={() => onFocus(2)}
                  onBlur={formikProps.handleBlur('taxCode')}
                />
                <ErrorMessage errorValue={formikProps.touched.taxCode && formikProps.errors.taxCode} />

                {/* COUNTRY */}
                {renderModalCountry(formikProps.setFieldValue)}
                <CustomInputSelect
                  description={translate('new_company.country')}
                  text={formikProps.values.country ? setTextFromKey(countryDropdownList, selectedListCountry) : 'Please choose...'}
                  onPress={onOpenCountryModal}
                />
                <ErrorMessage errorValue={formikProps.touched.country && formikProps.errors.country} />

                {/* STATE */}
                {renderModalState(formikProps.setFieldValue)}
                <CustomInputSelect
                  description={translate('new_company.state')}
                  text={formikProps.values.state ? setTextFromKey(stateDropdownList, selectedListState) : 'Please choose...'}
                  onPress={onOpenStateModal}
                />
                <ErrorMessage errorValue={formikProps.touched.state && formikProps.errors.state} />

                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('new_company.zip_code')}:`}
                  onChangeText={formikProps.handleChange('zipCode')}
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={formikProps.values.zipCode}
                  onFocus={() => onFocus(3)}
                  onBlur={formikProps.handleBlur('zipCode')}
                />
                <ErrorMessage errorValue={formikProps.touched.zipCode && formikProps.errors.zipCode} />
                <CustomInput
                  inputRef={(input: any) => putInputRef(input)}
                  description={`${translate('new_company.email')}:`}
                  onChangeText={formikProps.handleChange('email')}
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={formikProps.values.email}
                  onFocus={() => onFocus(4)}
                  onBlur={formikProps.handleBlur('email')}
                />
                <ErrorMessage errorValue={formikProps.touched.email && formikProps.errors.email} />
                <CustomPhoneInput
                  inputRef={(input: any) => {
                    phoneRef.current = input;
                    putInputRef(input);
                  }}
                  description={`${translate('new_company.phone')}:`}
                  onFocus={() => onFocus(5)}
                  onChangePhoneNumber={(phoneFake: string, phone: string, phoneCode: string) => {
                    formikProps.setValues({ ...formikProps.values, phoneFake, phone, phoneCode });
                  }}
                  value={formikProps.values.phoneFake}
                  onBlur={formikProps.handleBlur('phone')}
                />
                <ErrorMessage errorValue={formikProps.touched.phone && formikProps.errors.phone} />
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton onPress={formikProps.handleSubmit} text={translate('new_company.submit_button')} style={styles.button} />
            </View>
          </View>
        )}
      </Formik>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Container
          spaceBottom={true}
          isShowHeader={true}
          isDisplayNotification={false}
          isDisplayMenuButton={false}
          title={translate('new_company.navigation_title')}
        >
          <View style={{ flex: 1 }}>
            <CustomSectionHeader
              style={styles.sectionHeader}
              title={translate('new_company.manager_title')}
              icon={ADD_PLUS}
              styleIcon={styles.sectionIconStyle} />
            {renderInputField()}
          </View>
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View>
  );
};

export default React.memo(NewCompany);
