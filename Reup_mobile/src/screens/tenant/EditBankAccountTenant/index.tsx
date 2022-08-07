import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { View, ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from 'react-native';
import { ADD_PLUS, EDIT, EDIT_PROFILE } from '@src/constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { Formik } from 'formik';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string } from 'yup';
import { clone, upperCase } from 'lodash';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle, isAndroid, getFullName, getUserNameFromMail } from '@src/utils';
import { LimitGetAll } from '@src/constants/vars';
import { CustomFlatList } from '@src/components/FlatList';
import CustomGroupRadioButton, { RadioButtonObject } from '@src/components/CustomGroupRadioButton';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { CustomText } from '@src/components/CustomText';
import { CustomCheckBox } from '@src/components/CustomCheckBox';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { getListMaintenanceCategory, createTaskRequest } from '@src/modules/Maintenance/actions';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import NavigationActionsService from '@src/navigation/navigation';
import { getListProperty, getListStaff } from '@src/modules/Company/actions';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { ICompanyMaintenanceCategory } from "@reup/reup-api-sdk/libs/api/company/maintenance/category/models";
import { CustomTouchable } from '@src/components/CustomTouchable';
import { ICompanyUser } from '@reup/reup-api-sdk/libs/api/company/user/models';
import { CreateCompanyMaintenanceRecurringTaslParams } from '@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task';
import { FrequencyType, Priority } from '@reup/reup-api-sdk/src/api/enum';
import { useRoute } from '@react-navigation/native';

export const REQUEST = 'REQUEST';
let isShowKeyboard = false;
const EditBankAccountTenant = () => {
  const dispatch = useDispatch();
  const myCountry = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const route = useRoute();
  const { flatList }: any = route.params;
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [selectedCardType, setSelectedCardType] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState(0);

  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [isCityModalVisible, setCityModalVisible] = useState<boolean>(false);
  const [isBranchModalVisible, setBranchModalVisible] = useState<boolean>(false);
  const [isBankModalVisible, setBankModalVisible] = useState<boolean>(false);

  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);
  const [selectedListCity, setSelectedListCity] = useState<string[]>([]);
  const [selectedListBranch, setSelectedListBranch] = useState<string[]>([]);
  const [selectedListBank, setSelectedListBank] = useState<string[]>([]);

  const [countryDropdownList, setCountryDropdownList] = useState<ObjDropdown[]>([]);
  const [cityDropdownList, setCityDropdownList] = useState<ObjDropdown[]>([]);
  const [branchDropdownList, setBranchDropdownList] = useState<ObjDropdown[]>([]);
  const [bankDropdownList, setBankDropdownList] = useState<ObjDropdown[]>([]);
  const inputComponents: any[] = [];
  const numberOfInput = 5;

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

  useEffect(() => {
    const countriesList: ObjDropdown[] = [];
    myCountry.forEach((item) => {
      const obj: ObjDropdown = {
        _key: item.id + "",
        _value: item.name,
      };
      countriesList.push(obj);
    });
    setCountryDropdownList(countriesList);
  }, [myCountry]);

  const dataType = [
    { _key: '', _value: 'Please Choose' },
    { _key: FrequencyType.Weekly, _value: "Credit Card" },
    { _key: FrequencyType.Monthly, _value: "Paypal" },
    { _key: FrequencyType.Yearly, _value: "Master Card" },
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
    branch: string()
      .trim()
      .required(`${translate('new_bank_account.branch')} ${translate('error.required')}`),
    city: string()
      .trim()
      .required(`${translate('new_bank_account.city')} ${translate('error.required')}`),
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

  const onEditBankAccount = (formikProps: any) => {

  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };

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

  const onOpenBranchModal = () => {
    setBranchModalVisible(true);
  };

  const onCloseBranchModal = () => {
    setBranchModalVisible(false);
  };

  const onOpenAssignneModal = () => {
    setBankModalVisible(true);
  };

  const onCloseAssignneModal = () => {
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
            setFieldValue('building', '');

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
    // if (selectedList.length > 0) {
    //   if (selectedList.length === 1) {
    //     propertyList.map((element: ObjDropdown) => {
    //       if (element._key === selectedList[0]) {
    //         setFieldValue(key, element._key);
    //       }
    //     });
    //   }
    // } else {
    //   setFieldValue(key, "");
    // }
  };

  const onSelectBranchDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setBranchModalVisible(false);
    setSelectedListBranch(selectedList);
    // if (selectedList.length > 0) {
    //   if (selectedList.length === 1) {
    //     propertyList.map((element: ObjDropdown) => {
    //       if (element._key === selectedList[0]) {
    //         setFieldValue(key, element._key);
    //       }
    //     });
    //   }
    // } else {
    //   setFieldValue(key, "");
    // }
  };

  const onSelectBankDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setBankModalVisible(false);
    setSelectedListBank(selectedList);
    // if (selectedList.length > 0) {
    //   if (selectedList.length === 1) {
    //     propertyList.map((element: ObjDropdown) => {
    //       if (element._key === selectedList[0]) {
    //         setFieldValue(key, element._key);
    //       }
    //     });
    //   }
    // } else {
    //   setFieldValue(key, "");
    // }
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
          onSelectCountryDone(selectedList, setFieldValue, 'bank_name');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderModalBranch = (setFieldValue: any) => {
    return <Modal
      key={'branch'}
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
          onSelectCountryDone(selectedList, setFieldValue, 'branch');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
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

  const renderModalCity = (setFieldValue: any) => {
    return <Modal
      key={'building'}
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
        checkListData={[]}
        selectedList={selectedListCity}
        onCloseModal={onCloseCityModal}
        onDone={(selectedList: string[]) => {
          onSelectCityDone(selectedList, setFieldValue, 'building');
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
      onFocus={() => setCurrentInputIndex(0)}
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
      onFocus={() => setCurrentInputIndex(0)}
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
          numberOfInput={numberOfInput}
          currentInputIndex={currentInputIndex}
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
          onFocus={() => setCurrentInputIndex(1)}
          onPressDown={nextInput}
          onPressUp={previousInput}
          textStyle={styles.textDropdown}
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
          branch: '',
          country: '',
          city: '',
        }}
        onSubmit={onEditBankAccount}
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
                  text={formikProps.values.bank_name ? setTextFromKey(countryDropdownList, selectedListCountry) : 'Please choose...'}
                  onPress={onOpenCountryModal}
                />
                <ErrorMessage errorValue={formikProps.touched.bank_name && formikProps.errors.bank_name} />

                {/* BRANCH */}
                {renderModalBranch(formikProps.setFieldValue)}
                <CustomInputSelect
                  description={translate('new_bank_account.branch')}
                  text={formikProps.values.branch ? setTextFromKey(countryDropdownList, selectedListCountry) : 'Please choose...'}
                  onPress={onOpenCountryModal}
                />
                <ErrorMessage errorValue={formikProps.touched.branch && formikProps.errors.branch} />

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
                  text={formikProps.values.city ? setTextFromKey(countryDropdownList, selectedListCountry) : 'Please choose...'}
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
          title={translate('edit_bank_account.title')}
          isShowHeader={true}
          spaceBottom={true}
          isDisplayMenuButton={false}
        >
          <View style={[styles.container, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <CustomSectionHeader
              style={styles.sectionHeader}
              title={upperCase(translate('edit_bank_account.title_section'))}
              icon={EDIT_PROFILE}
              styleIcon={styles.sectionIconStyle}
            />
            {renderInputFields()}
          </View>
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View>
  );
};

export default React.memo(EditBankAccountTenant);
