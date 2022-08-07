import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { View, ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from 'react-native';
import { VISITOR } from '@src/constants/icons';
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
import { CustomText } from '@src/components/CustomText';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import NavigationActionsService from '@src/navigation/navigation';
import CustomDateTimePicker, { getToday } from '@src/components/CustomDateTimePicker';
import { formatUIToApi } from '@src/utils/date';
import { createVisitor } from '@src/modules/FrontDesk/actions';
import { CreateVisitorData } from '@reup/reup-api-sdk/libs/api/frontdesk/visitor';
import { IUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { useRoute } from '@react-navigation/native';
import { getUnitListMe } from '@src/modules/Units/actions';
import { LimitLoadMore } from '@src/constants/vars';

export const REQUEST = 'REQUEST';
let isShowKeyboard = false;
const NewVisitorTenant = () => {
  const { flatList } = useRoute().params as any;
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);

  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [isApartmentCodeModalVisible, setApartmentCodeModalVisible] = useState<boolean>(false);
  const [selectedListApartmentCode, setSelectedListApartmentCode] = useState<string[]>([]);
  const [dateArrive, setDateArrive] = useState(getToday());
  const [dateLeave, setDateLeave] = useState(getToday());
  const inputComponents: any[] = [];
  const numberOfInput = 5;

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
    fetchListApartmentCode();
    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    isShowKeyboard = false;
    return () => {
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    };
  }, []);

  const fetchListApartmentCode = () => {
    dispatch(
      getUnitListMe({
        query: { property_id: me.default_property },
        isSave: false,
        limit: LimitLoadMore,
        onSuccess: async (data) => {
          setApartmentCode(data.results);
        },
        onFail: error => {
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );

  };

  const validationSchema = object().shape({
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
        id: me.default_property,
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

  const onOpenApartmentCodeModal = () => {
    setApartmentCodeModalVisible(true);
  };

  const onCloseApartmentCodeModal = () => {
    setApartmentCodeModalVisible(false);
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

export default NewVisitorTenant;
