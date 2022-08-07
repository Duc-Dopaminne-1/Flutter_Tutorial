import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { View, ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from 'react-native';
import { ADD_PLUS, VISITOR } from '@src/constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { Formik } from 'formik';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string } from 'yup';
import { clone, upperCase, values, find } from 'lodash';
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
import { getListProperty, getListStaff, getListApartment } from '@src/modules/Company/actions';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { ICompanyMaintenanceCategory } from "@reup/reup-api-sdk/libs/api/company/maintenance/category/models";
import { CustomTouchable } from '@src/components/CustomTouchable';
import { ICompanyUser } from '@reup/reup-api-sdk/libs/api/company/user/models';
import { CreateCompanyMaintenanceRecurringTaslParams } from '@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task';
import { FrequencyType } from '@reup/reup-api-sdk/src/api/enum';
import CustomDateTimePicker, { getToday } from '@src/components/CustomDateTimePicker';
import { formatDateWith, formatUIToApi } from '@src/utils/date';
import { Config } from '@src/configs/appConfig';
import { createVisitor } from '@src/modules/FrontDesk/actions';
import { CreateVisitorData } from '@reup/reup-api-sdk/libs/api/frontdesk/visitor';
import { IUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { useRoute } from '@react-navigation/native';

export const REQUEST = 'REQUEST';
let isShowKeyboard = false;
const NewVisitor = () => {
  const { flatList } = useRoute().params as any;
  const dispatch = useDispatch();
  const myCountry = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);

  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [isPropertyModalVisible, setPropertyModalVisible] = useState<boolean>(false);
  const [isApartmentCodeModalVisible, setApartmentCodeModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);
  const [selectedListProperty, setSelectedListProperty] = useState<string[]>([]);
  const [selectedListApartmentCode, setSelectedListApartmentCode] = useState<string[]>([]);
  const [countryDropdownList, setCountryDropdownList] = useState<ObjDropdown[]>([]);
  const [dateArrive, setDateArrive] = useState(getToday());
  const [dateLeave, setDateLeave] = useState(getToday());
  const inputComponents: any[] = [];
  const numberOfInput = 5;

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

  const fetchListBuilding = (companyId: string, countryId: string) => {
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

  const validationSchema = object().shape({
    country: string()
      .trim()
      .required(`${translate('new_visitor.country')} ${translate('error.required')}`),
    building: string()
      .trim()
      .required(`${translate('new_visitor.building')} ${translate('error.required')}`),
    apartmentCode: string()
      .trim()
      .required(`${translate('new_visitor.apartment_code')} ${translate('error.required')}`),
    visitorName: string()
      .trim()
      .required(`${translate('new_visitor.visitor_name')} ${translate('error.required')}`),
    idCard: string()
      .trim()
      .required(`${translate('new_visitor.id_card')} ${translate('error.required')}`),
    note: string()
      .trim()
      .required(`${translate('new_visitor.note')} ${translate('error.required')}`),
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


  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  const onAddNewVisitor = (values: any) => {
    NavigationActionsService.showLoading();
    const arriveDate = formatUIToApi(values.arriveDate);
    const leaveDate = formatUIToApi(values.leaveDate);
    const params: CreateVisitorData =
    {
      full_name: values.visitorName,
      identity_code: values.idCard,
      note: values.note,
      expected_arrival_date: arriveDate,
      expected_leave_date: leaveDate,
      unit: values.apartmentCode
    };
    dispatch(
      createVisitor({
        id: me.default_company.id,
        params: params,
        onSuccess: async (data) => {
          NavigationActionsService.hideLoading();
          flatList && flatList.current && flatList.current.reloadData();
          console.log("===== Success create Visitor: ", data);
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
            fetchListBuilding(me.default_company.id, element._key);
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

  const onDateChangeArrive = (date: any, setFieldValue: any) => {
    setDateArrive(date);
    setFieldValue('arriveDate', date);
    setFieldValue('leaveDate', date);
  };

  const onDateChangeLeave = (date: any, setFieldValue: any) => {
    setDateLeave(date);
    setFieldValue('leaveDate', date);
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
          // onSelectPropertyDone(selectedList, setFieldValue, 'building');
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

  const renderVisitorName = (formikProps: any) => {
    return <CustomInput
      inputRef={(input: any) => putInputRef(input)}
      description={`${translate('new_visitor.visitor_name')}`}
      onChangeText={
        formikProps.handleChange('visitorName')
      }
      returnKeyType="next"
      value={formikProps.values.visitorName}
      onFocus={() => setCurrentInputIndex(0)}
      onBlur={formikProps.handleBlur('visitorName')}

    />;
  };

  const renderIdCard = (formikProps: any) => {
    return <CustomInput
      inputRef={(input: any) => putInputRef(input)}
      description={`${translate('new_visitor.id_card')}`}
      onChangeText={
        formikProps.handleChange('idCard')
      }
      returnKeyType="next"
      value={formikProps.values.idCard}
      onFocus={() => setCurrentInputIndex(0)}
      onBlur={formikProps.handleBlur('idCard')}

    />;
  };

  const renderDate = (formikProps: any) => {
    return <View style={styles.intervalContainer}>
      <View style={[styles.intervalContents, { paddingRight: 5 }]}>
        <CustomText style={styles.titleInterval} text={translate('new_visitor.arrive_date')} />
        <CustomDateTimePicker
          ref={putInputRef.bind(undefined)}
          onFocus={() => setCurrentInputIndex(2)}
          date={formikProps.values.arriveDate}
          minDate={getToday()}
          onDateChange={(date: any) => {
            onDateChangeArrive(date, formikProps.setFieldValue);
          }} />

      </View>
      <View style={[styles.intervalContents, { paddingLeft: 5 }]}>
        <CustomText style={styles.titleInterval} text={translate('new_visitor.leave_date')} />
        <CustomDateTimePicker
          ref={putInputRef.bind(undefined)}
          onFocus={() => setCurrentInputIndex(2)}
          date={formikProps.values.leaveDate}
          minDate={dateArrive}
          onDateChange={(date: any) => {
            onDateChangeLeave(date, formikProps.setFieldValue);
          }} />

      </View>
    </View>;
  };

  const renderNote = (formikProps: any) => {
    return <CustomInput
      inputRef={(input: any) => putInputRef(input)}
      description={`${translate('new_visitor.note')}`}
      onChangeText={(field: string) => {
        formikProps.setValues({ ...formikProps.values, note: field.toString() });
        setScrollEnabled(true);
      }}
      returnKeyType="next"
      value={formikProps.values.description}
      onFocus={() => setCurrentInputIndex(2)}
      onBlur={() => {
        formikProps.handleBlur('note');
        setScrollEnabled(false);
      }}
      moreStyle={styles.description}
      multiline={true}
      scrollEnabled={scrollEnabled}
    />;
  };

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={{
          country: '',
          building: '',
          apartmentCode: '',
          visitorName: '',
          idCard: '',
          arriveDate: getToday(),
          leaveDate: getToday(),
          note: '',
        }}
        onSubmit={onAddNewVisitor}
        validationSchema={validationSchema}>
        {formikProps => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>
                {/* COUNTRY */}
                {renderModalCountry(formikProps)}
                <CustomInputSelect
                  description={translate('new_visitor.country')}
                  text={formikProps.values.country ? setTextFromKey(countryDropdownList, selectedListCountry) : 'Please choose...'}
                  onPress={onOpenCountryModal}
                />
                <ErrorMessage errorValue={formikProps.touched.country && formikProps.errors.country} />

                {/* BUIDLING */}
                {renderModalBuilding(formikProps)}
                <CustomInputSelect
                  description={translate('new_visitor.building')}
                  text={formikProps.values.building ? setTextFromKey(propertyList, selectedListProperty) : 'Please choose...'}
                  onPress={onOpenPropertyModal}
                />
                <ErrorMessage errorValue={formikProps.touched.building && formikProps.errors.building} />

                {/* APARTMENT CODE */}
                {renderApartmentCode(formikProps)}
                <CustomInputSelect
                  description={translate('new_visitor.apartment_code')}
                  text={formikProps.values.apartmentCode ? setTextFromKey(apartmentCodeList, selectedListApartmentCode) : 'Please choose...'}
                  onPress={onOpenApartmentCodeModal}
                />
                <ErrorMessage errorValue={formikProps.touched.apartmentCode && formikProps.errors.apartmentCode} />

                {/* VISITOR NAME */}
                {renderVisitorName(formikProps)}
                <ErrorMessage errorValue={formikProps.touched.visitorName && formikProps.errors.visitorName} />

                {/* ID CARD */}
                {renderIdCard(formikProps)}
                <ErrorMessage errorValue={formikProps.touched.idCard && formikProps.errors.idCard} />

                {renderDate((formikProps))}
                {/* NOTE */}
                {renderNote(formikProps)}
                <ErrorMessage errorValue={formikProps.touched.note && formikProps.errors.note} />
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton onPress={formikProps.handleSubmit} text={translate('new_visitor.submit')} style={styles.button} />
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
          isDisplayMenuButton={false}
          title={translate('new_visitor.title_incoming_visitor')}
          isShowHeader={true}
          spaceBottom={true}>
          <View style={styles.container}>
            <CustomSectionHeader
              style={styles.sectionHeader}
              title={upperCase(translate('new_visitor.title_incoming_visitor'))}
              icon={VISITOR}
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

export default NewVisitor;
