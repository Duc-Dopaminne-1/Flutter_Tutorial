import React, { useState, useEffect } from 'react';
import styles from './styles';
import { View, ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from 'react-native';
import { ADD_PLUS } from '@src/constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { Formik } from 'formik';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string } from 'yup';
import { upperCase } from 'lodash';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle, isAndroid } from '@src/utils';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import { ICountry, IState } from '@reup/reup-api-sdk/libs/api/country/model';
import NavigationActionsService from '@src/navigation/navigation';
import { listBank } from './dummyData';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { getListState } from '@src/modules/Config/actions';
import { FinancialCardType } from '@reup/reup-api-sdk/libs/api/enum';
import { createBankAccount } from '@src/modules/financial/action';
import { IFinancialRequest } from '@reup/reup-api-sdk/libs/api/financial/models';

export const REQUEST = 'REQUEST';
let isShowKeyboard = false;
const NewBankAccountTenant = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultProperty = me && me.default_property ? me.default_property : ''
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [selectedCardType, setSelectedCardType] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState(0);

  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [isCityModalVisible, setCityModalVisible] = useState<boolean>(false);
  const [isBankModalVisible, setBankModalVisible] = useState<boolean>(false);

  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);
  const [selectedListCity, setSelectedListCity] = useState<string[]>([]);
  const [selectedListBank, setSelectedListBank] = useState<string[]>([]);

  const countryList = useSelector<RootState, IPagination<ICountry>>((state: RootState) => state.config.listCountry);
  const [countryDropdownList, setCountryDropdownList] = useState<ObjDropdown[]>([]);
  const [cityDropdownList, setCityDropdownList] = useState<ObjDropdown[]>([]);
  const [bankDropdownList, setBankDropdownList] = useState<ObjDropdown[]>(listBank);
  const inputComponents: any[] = [];
  const numberOfInput = 4;

  const keyboardDidShow = () => {
    if (isShowKeyboard) {
      if (paddingBottom === 44) {
        return;
      }
      setPaddingBottom(44)
      return;
    }
    isShowKeyboard = true;
    if (paddingBottom === 0) {
      return;
    }
    setPaddingBottom(0)
  };

  const keyboardDidHide = () => {
    isShowKeyboard = false
    setPaddingBottom(0)
  };

  useEffect(() => {
    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    isShowKeyboard = false;
    return () => {
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    };
  }, []);

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
  }, [countryList]);

  const fetchListCity = (countryId: string) => {
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
            setCityDropdownList(stateList);
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

  const create = (params: IFinancialRequest) => {
    if (defaultProperty) {
      NavigationActionsService.showLoading();
      dispatch(
        createBankAccount({
          propertyId: defaultProperty,
          params,
          onSuccess: (data) => {
            NavigationActionsService.hideLoading();
            NavigationActionsService.pop()
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

  const dataType = [
    { _key: '', _value: 'Please Choose' },
    { _key: FinancialCardType.Credit, _value: translate('new_bank_account.credit') },
    { _key: FinancialCardType.Master, _value: translate('new_bank_account.master') },
    { _key: FinancialCardType.Paypal, _value: translate('new_bank_account.paypal') },
  ];

  const validationSchema = object().shape({
    country: string()
      .trim()
      .required(`${translate('new_bank_account.country')} ${translate('error.required')}`),
    type: string()
      .trim()
      .required(`${translate('new_bank_account.type')} ${translate('error.required')}`),
    name_on_card: string()
      .trim()
      .required(`${translate('new_bank_account.name_on_card')} ${translate('error.required')}`),
    card_no: string()
      .trim()
      .required(`${translate('new_bank_account.card_no')} ${translate('error.required')}`),
    bank_name: string()
      .trim()
      .required(`${translate('new_bank_account.bank_name')} ${translate('error.required')}`),
    city: string()
      .trim()
      .required(`${translate('new_bank_account.city')} ${translate('error.required')}`),
    expire_day: string()
      .trim()
      .required(`${translate('new_bank_account.expire_day')} ${translate('error.required')}`)
      .test(
        'expire_day',
        `${translate('new_bank_account.expire_day')} ${translate('error.invalid')}`,
        value => {
          const month = value ? value.split('/')[0] : ''
          const year = value ? value.split('/')[1] : ''
          if (!month && !year) {
            return false
          }
          return (value && value.length == 5) && (month <= 12 && month > 0) && (year > 0)
        }
      )
  });

  const putInputRef = (inp: any) => {
    if (!inp) {
      return
    }
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

  const nextInput = () => {
    const currentInput = getInputRef(currentInputIndex);
    currentInput && currentInput.dismiss && currentInput.dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex + 1).focus();
    });
  };

  const previousInput = () => {
    const input = getInputRef(currentInputIndex);
    input && input.dismiss && input.dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex - 1).focus();
    });
  };

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const onAddBankAccount = (values: any) => {
    const country = values.country ?? 0
    const city = values.city ?? 0
    const params: IFinancialRequest = {
      country_id: parseInt(country),
      city_id: parseInt(city),
      name_on_card: values.name_on_card ?? '',
      card_number: values.card_no ?? '',
      expire_day: values.expire_day ?? '',
      card_type: values.type ?? '',
      bank_name: values.bank_name ?? '',
      brand: '',
    }
    create(params)
  };

  const onChangeDropdownCategory = (obj: ObjDropdown, setFieldValue: any, key: string) => {
    if (obj._key) {
      setFieldValue(key, obj._key);
      return;
    }
    setFieldValue(key, '');
  };

  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onOpenCityModal = () => {
    setCityModalVisible(true);
  };

  const onCloseCityModal = () => {
    setCityModalVisible(false);
  };
  const onOpenBankModal = () => {
    setBankModalVisible(true);
  };

  const onCloseBankModal = () => {
    setBankModalVisible(false);
  };

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);
    setSelectedListCountry(selectedList);

    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        countryDropdownList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
            setFieldValue('city', '');
            fetchListCity(element._key)
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const onSelectCityDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCityModalVisible(false);
    setSelectedListCity(selectedList);
    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        cityDropdownList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const onSelectBankDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setBankModalVisible(false);
    setSelectedListBank(selectedList);
    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        bankDropdownList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._value);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const renderKeyboardAccessory = () => (
    <KeyboardAccessoryView style={{ padding: 0, height: 45 }} androidAdjustResize>
      <CustomAccessory
        currentInputIndex={currentInputIndex}
        numberOfInput={numberOfInput}
        onPressDown={nextInput}
        onPressUp={previousInput}
        onPressDone={doneTyping}
      />
    </KeyboardAccessoryView>
  );

  const renderModalBankName = (setFieldValue: any) => {
    return <Modal
      key={'bank_name'}
      hideModalContentWhileAnimating
      isVisible={isBankModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseBankModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={bankDropdownList}
        selectedList={selectedListBank}
        onCloseModal={onCloseBankModal}
        onDone={(selectedList: string[]) => {
          onSelectBankDone(selectedList, setFieldValue, 'bank_name');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderExpireDay = (formikProps: any) => {
    const { handleChange, values, handleBlur, touched, errors } = formikProps
    const value = values && values.expire_day && values.expire_day.replace('/', '')
    return (
      <>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={`${translate('new_bank_account.expire_day')}`}
          onChangeText={handleChange('expire_day')}
          returnKeyType="next"
          value={value}
          onFocus={() => setCurrentInputIndex(3)}
          onBlur={handleBlur('expire_day')}
          mask={"[00]/[00]"}
          keyboardType="number-pad"
          moreStyle={styles.expireDay}
        />
        <ErrorMessage errorValue={touched.expire_day && errors.expire_day} />
      </>
    )
  }

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

  const renderModalCity = (setFieldValue: any) => {
    return <Modal
      key={'city'}
      hideModalContentWhileAnimating
      isVisible={isCityModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseCityModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={cityDropdownList}
        selectedList={selectedListCity}
        onCloseModal={onCloseCityModal}
        onDone={(selectedList: string[]) => {
          onSelectCityDone(selectedList, setFieldValue, 'city');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderNameOnCard = (formikProps: any) => {
    return <CustomInput
      inputRef={(input: any) => putInputRef(input)}
      description={`${translate('new_bank_account.name_on_card')}`}
      onChangeText={
        formikProps.handleChange('name_on_card')
      }
      returnKeyType="next"
      value={formikProps.values.name_on_card}
      onFocus={() => setCurrentInputIndex(1)}
      onBlur={formikProps.handleBlur('name_on_card')}
    />;
  };

  const renderCardNumber = (formikProps: any) => {
    return <CustomInput
      inputRef={(input: any) => putInputRef(input)}
      description={`${translate('new_bank_account.card_no')}`}
      onChangeText={
        formikProps.handleChange('card_no')
      }
      returnKeyType="next"
      value={formikProps.values.card_no}
      onFocus={() => setCurrentInputIndex(2)}
      onBlur={formikProps.handleBlur('card_no')}

    />;
  };

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  const renderTypeCard = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomDropdownSelect
          arrData={dataType}
          textTitle={`${translate('new_bank_account.type')}`}
          lineBottom={false}
          containerStyle={styles.filter}
          selected={selectedCardType}
          onChangeDropDown={(object) => {
            setSelectedCardType(dataType.findIndex(item => item._key === object._key));
            onChangeDropdownCategory(object, formikProps.setFieldValue, 'type');
            formikProps.handleBlur('type');
          }}
          inputRef={(input: any) => putInputRef(input)}
          onFocus={() => setCurrentInputIndex(0)}
          onPressDown={nextInput}
          onPressUp={previousInput}
          textStyle={styles.textDropdown}
          numberOfInput={numberOfInput}
          currentInputIndex={currentInputIndex}
        />
        <ErrorMessage errorValue={formikProps.touched.type && formikProps.errors.type} />
      </View>
    );
  };


  const renderInputFields = () => {
    return (
      <Formik
        initialValues={{
          type: '',
          name_on_card: '',
          card_no: '',
          bank_name: '',
          expire_day: '',
          country: '',
          city: '',
        }}
        onSubmit={onAddBankAccount}
        validationSchema={validationSchema}>
        {formikProps => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>

                {renderTypeCard(formikProps)}

                {renderNameOnCard(formikProps)}
                <ErrorMessage errorValue={formikProps.touched.name_on_card && formikProps.errors.name_on_card} />

                {renderCardNumber(formikProps)}
                <ErrorMessage errorValue={formikProps.touched.card_no && formikProps.errors.card_no} />

                {/* BANK NAME */}
                {renderModalBankName(formikProps.setFieldValue)}
                <CustomInputSelect
                  description={translate('new_bank_account.bank_name')}
                  text={formikProps.values.bank_name ? setTextFromKey(bankDropdownList, selectedListBank) : 'Please choose...'}
                  onPress={onOpenBankModal}
                />
                <ErrorMessage errorValue={formikProps.touched.bank_name && formikProps.errors.bank_name} />

                {/* EXPIRE DAY */}
                {renderExpireDay(formikProps)}

                {/* COUNTRY */}
                {renderModalCountry(formikProps.setFieldValue)}
                <CustomInputSelect
                  description={translate('new_bank_account.country')}
                  text={formikProps.values.country ? setTextFromKey(countryDropdownList, selectedListCountry) : 'Please choose...'}
                  onPress={onOpenCountryModal}
                />
                <ErrorMessage errorValue={formikProps.touched.country && formikProps.errors.country} />

                {/* CITY */}
                {renderModalCity(formikProps.setFieldValue)}
                <CustomInputSelect
                  description={translate('new_bank_account.city')}
                  text={formikProps.values.city ? setTextFromKey(cityDropdownList, selectedListCity) : 'Please choose...'}
                  onPress={onOpenCityModal}
                />
                <ErrorMessage errorValue={formikProps.touched.city && formikProps.errors.city} />

              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton onPress={formikProps.handleSubmit} text={translate('new_bank_account.submit_button')} style={styles.button} />
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
          isDisplayNotification={false}
          title={translate('new_bank_account.title')}
          isShowHeader={true}
          spaceBottom={true}
          isDisplayMenuButton={false} >
          <CustomSectionHeader
            style={styles.sectionHeader}
            title={upperCase(translate('new_bank_account.title_section'))}
            icon={ADD_PLUS}
            styleIcon={styles.sectionIconStyle}
          />
          {renderInputFields()}
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View>
  );
};

export default NewBankAccountTenant;
