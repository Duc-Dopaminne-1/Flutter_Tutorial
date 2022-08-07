import React, { useState, useEffect, useRef } from 'react';
import { View, Keyboard, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Alert } from 'react-native';
import styles from './styles';
import Container from '@src/components/Container';
import translate from '@src/localize';
import { ADD_PLUS } from '@src/constants/icons';
import { Formik } from 'formik';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect/index';
import CustomInput from '@src/components/CustomInput';
import { CustomButton } from '@src/components/CustomButton';
import { HEIGHT, LimitGetAll } from '@src/constants/vars';
import CustomAccessory from '@src/components/CustomAccessory';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { isAndroid, getKeyboardAdvoidStyle } from '@src/utils';
import CustomSectionHeader from '@src/components/CustomSection';
import getStyles from '@src/utils/getStyles';
import { object, string } from 'yup';
import ErrorMessage from '@src/components/ErrorMessage';
import { blocks, countries, buildings } from './dummyData';
import { Theme } from '@src/components/Theme';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import NavigationActionsService from '@src/navigation/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { getListProperty, getListApartment } from '@src/modules/Company/actions';
import Modal from 'react-native-modal';
import { IUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { CreateDeliveryData } from '@reup/reup-api-sdk/libs/api/frontdesk/delivery';
import { createDelivery } from '@src/modules/FrontDesk/actions';
import { useRoute } from '@react-navigation/native';

let isShowKeyboard = false;
const NewDelivery = () => {

  const { flatList } = useRoute().params as any;
  const dispatch = useDispatch();
  const myCountry = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);

  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [isPropertyModalVisible, setPropertyModalVisible] = useState<boolean>(false);
  const [isApartmentCodeModalVisible, setApartmentCodeModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);
  const [selectedListProperty, setSelectedListProperty] = useState<string[]>([]);
  const [selectedListApartmentCode, setSelectedListApartmentCode] = useState<string[]>([]);
  const [countryDropdownList, setCountryDropdownList] = useState<ObjDropdown[]>([]);

  const inputNumb = 5;
  const inputComponents: any[] = [];
  const [property, setProperty] = useState<ICompanyProperty[]>([]);
  const propertyList: ObjDropdown[] = [
    ...property.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item.name,
    }))
  ];

  const [apartmentCode, setApartmentCode] = useState<IUnit[]>([]);
  const apartmentCodeList: ObjDropdown[] = [
    ...apartmentCode.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item.code,
    }))
  ];

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

  const fetchListBuilding = (companyId: string, countryId: string, setFieldValue: any) => {
    // API: Get list building
    if (companyId) {
      NavigationActionsService.showLoading();
      dispatch(
        getListProperty({
          companyId,
          params: {
            country_id: countryId,
          },
          isSave: false,
          limit: LimitGetAll,
          page: 1,
          onSuccess: async (data) => {
            console.log("===== Success List Building: ", data);
            setProperty(data.results);
            NavigationActionsService.hideLoading();
          },
          onFail: error => {
            NavigationActionsService.hideLoading();
          }
        }));
    }
  };

  const fetchListUnit = (companyId: string, countryId: string, propertyId: string) => {
    // API: Get list unit
    if (companyId) {
      NavigationActionsService.showLoading();
      dispatch(
        getListApartment({
          companyId,
          page: 1,
          isSave: false,
          limit: LimitGetAll,
          q: {
            country_id: countryId,
            property_id: propertyId
          },
          onSuccess: async (data) => {
            console.log("===== Success List apartment code: ", data);
            setApartmentCode(data.results);
            NavigationActionsService.hideLoading();
          },
          onFail: error => {
            NavigationActionsService.hideLoading();
          }
        }));
    }
  };

  /* KeyBoard Accessory Handle*/
  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  const nextInput = () => {
    console.log('CURRNT: ', currentInputIndex);
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

  //***********************FORMIK***********************
  const validationSchema = object().shape({
    country: string()
      .trim()
      .required(`${translate('new_delivery.country')} ${translate('error.required')}`),
    building: string()
      .trim()
      .required(`${translate('new_delivery.building')} ${translate('error.required')}`),
    apartmentCode: string()
      .trim()
      .required(`${translate('new_delivery.apartment_code')} ${translate('error.required')}`),
    title: string()
      .trim()
      .required(`${translate('new_delivery.title')} ${translate('error.required')}`),
    transfer: string()
      .trim()
      .required(`${translate('new_delivery.transfer')} ${translate('error.required')}`),
  });

  const initialValue = {
    country: '',
    building: '',
    apartmentCode: '',
    title: '',
    transfer: '',
  };

  const onCreateStaff = (values: any) => {
    NavigationActionsService.showLoading();
    const params: CreateDeliveryData =
    {
      title: values.title,
      shipping_unit: values.transfer,
      unit: values.apartmentCode
    };
    dispatch(
      createDelivery({
        companyId: me.default_company.id,
        params: params,
        onSuccess: async (data) => {
          NavigationActionsService.hideLoading();
          flatList && flatList.current && flatList.current.reloadData();
          console.log("===== Success create Delivery: ", data);
          NavigationActionsService.pop();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      }));
  };

  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onOpenPropertyModal = () => {
    setPropertyModalVisible(true);
  };

  const onClosePropertyModal = () => {
    setPropertyModalVisible(false);
  };

  const onOpenApartmentCodeModal = () => {
    setApartmentCodeModalVisible(true);
  };

  const onCloseApartmentCodeModal = () => {
    setApartmentCodeModalVisible(false);
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
            fetchListBuilding(me.default_company.id, element._key, setFieldValue);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const onSelectPropertyDone = (selectedList: string[], formikProps: any, key: string) => {
    setPropertyModalVisible(false);
    setSelectedListProperty(selectedList);
    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        propertyList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            formikProps.setFieldValue(key, element._key);
            fetchListUnit(me.default_company.id, formikProps.values.country, element._key);
          }
        });
      }
    } else {
      formikProps.setFieldValue(key, "");
    }
  };

  const onSelectApartmentCodeDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setApartmentCodeModalVisible(false);
    setSelectedListApartmentCode(selectedList);

    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        apartmentCodeList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const InputAccessoryView = (
    <KeyboardAccessoryView androidAdjustResize>
      <CustomAccessory
        currentInputIndex={currentInputIndex}
        numberOfInput={inputNumb}
        onPressDown={nextInput}
        onPressUp={previousInput}
        onPressDone={doneTyping}
      />
    </KeyboardAccessoryView>
  );
  /*=============== */

  const renderHeaderTitle = () => (
    <CustomSectionHeader
      styleIcon={{ tintColor: Theme.new_delivery.icon }}
      style={styles.headerTitle}
      title={translate('new_delivery.create_new_delivery')}
      icon={ADD_PLUS}
    />
  );


  const renderModalCountry = (formikProps: any) => {
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
          onSelectCountryDone(selectedList, formikProps.setFieldValue, 'country');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderModalBuilding = (formikProps: any) => {
    return <Modal
      key={'building'}
      hideModalContentWhileAnimating
      isVisible={isPropertyModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onClosePropertyModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={propertyList}
        selectedList={selectedListProperty}
        onCloseModal={onClosePropertyModal}
        onDone={(selectedList: string[]) => {
          onSelectPropertyDone(selectedList, formikProps, 'building');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderApartmentCode = (formikProps: any) => {
    return <Modal
      key={'apartmentCode'}
      hideModalContentWhileAnimating
      isVisible={isApartmentCodeModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseApartmentCodeModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={apartmentCodeList}
        selectedList={selectedListApartmentCode}
        onCloseModal={onCloseApartmentCodeModal}
        onDone={(selectedList: string[]) => {
          onSelectApartmentCodeDone(selectedList, formikProps.setFieldValue, 'apartmentCode');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderTitle = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomInput
          onFocus={() => setCurrentInputIndex(3)}
          inputRef={(input: any) => putInputRef(input)}
          description={translate('new_delivery.title')}
          onChangeText={formikProps.handleChange('title')}
          returnKeyType="next"
          value={formikProps.values.title}
          onBlur={formikProps.handleBlur('title')}
        />
        <ErrorMessage errorValue={formikProps.touched.title && formikProps.errors.title} />
      </View>
    );
  };

  const renderTransfer = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomInput
          onFocus={() => setCurrentInputIndex(4)}
          inputRef={(input: any) => putInputRef(input)}
          description={translate('new_delivery.transfer')}
          onChangeText={formikProps.handleChange('transfer')}
          returnKeyType="done"
          value={formikProps.values.transfer}
          onBlur={formikProps.handleBlur('transfer')}
        />
        <ErrorMessage errorValue={formikProps.touched.transfer && formikProps.errors.transfer} />
      </View>
    );
  };

  const renderInputField = (formikProps: any) => {
    return (
      <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.containerScrollView}>
          <View style={styles.content}>
            {/* COUNTRY */}
            {renderModalCountry(formikProps)}
            <CustomInputSelect
              description={translate('task.country')}
              text={formikProps.values.country ? setTextFromKey(countryDropdownList, selectedListCountry) : 'Please choose...'}
              onPress={onOpenCountryModal}
            />
            <ErrorMessage errorValue={formikProps.touched.country && formikProps.errors.country} />

            {/* BUIDLING */}
            {renderModalBuilding(formikProps)}
            <CustomInputSelect
              description={translate('task.building')}
              text={formikProps.values.building ? setTextFromKey(propertyList, selectedListProperty) : 'Please choose...'}
              onPress={onOpenPropertyModal}
            />
            <ErrorMessage errorValue={formikProps.touched.building && formikProps.errors.building} />

            {/* APARTMENT CODE */}
            {renderApartmentCode(formikProps)}
            <CustomInputSelect
              description={translate('new_delivery.apartment_code')}
              text={formikProps.values.apartmentCode ? setTextFromKey(apartmentCodeList, selectedListApartmentCode) : 'Please choose...'}
              onPress={onOpenApartmentCodeModal}
            />
            <ErrorMessage errorValue={formikProps.touched.building && formikProps.errors.building} />

            {renderTitle(formikProps)}

            {renderTransfer(formikProps)}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={formikProps.handleSubmit}
            text={translate('new_delivery.submit')}
            style={styles.button}
          />
        </View>
      </View >
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Container spaceBottom={true} isShowHeader={true} title={translate('new_delivery.navigation_title')}>
          <Formik initialValues={initialValue} onSubmit={onCreateStaff} validationSchema={validationSchema}>
            {(formikProps) => {
              return (
                <View style={styles.listContainer}>
                  {renderHeaderTitle()}
                  {renderInputField(formikProps)}
                </View>
              );
            }}
          </Formik>
        </Container>
      </KeyboardAvoidingView>
      {InputAccessoryView}
    </View >
  );
};

export default NewDelivery;
