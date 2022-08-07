import React, { useState, useEffect } from "react";
import { View, KeyboardAvoidingView, ScrollView, Text, Keyboard, TouchableWithoutFeedback, Alert } from "react-native";
import Container from "@src/components/Container";
import translate from "@src/localize";
import CustomSectionHeader from "@src/components/CustomSection";
import getStyles from "@src/utils/getStyles";
import ErrorMessage from "@src/components/ErrorMessage";
import CustomDateTimePicker, { getToday } from "@src/components/CustomDateTimePicker";
import CustomAccessory from "@src/components/CustomAccessory";
import { ObjDropdown } from "@src/components/Dropdown/DropdownNative";
import { styles } from "./styles";
import { CustomButton } from "@src/components/CustomButton";
import { ADD_PLUS } from "@src/constants/icons";
import { getKeyboardAdvoidStyle } from "@src/utils";
import { object, string } from 'yup';
import { Formik } from "formik";
import Modal from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IFacility } from "@reup/reup-api-sdk/libs/api/company/facility/models";
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import NavigationActionsService from '@src/navigation/navigation';
import { getListProperty } from '@src/modules/Company/actions';
import { isEqual } from 'lodash';
import moment from 'moment';
//@ts-ignore
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomInputSelect from "@src/components/CustomInputSelect";
import CustomInput from "@src/components/CustomInput";
import { LimitGetAll } from "@src/constants/vars";
import { getListFacilities } from "@src/modules/FrontDesk/actions";
import { createEvent } from "@src/modules/calendar/actions";
import { useRoute } from "@react-navigation/native";
import { formatUIToApi } from "@src/utils/date";

interface Props {
  addEventCallback: () => void;
}

const validationSchema = object().shape({
  title: string()
    .trim()
    .required(`${translate('calendar.text_event_title')} ${translate('error.required')}`),
  country: string()
    .trim()
    .required(`${translate('calendar.text_country')} ${translate('error.required')}`),
  building: string()
    .trim()
    .required(`${translate('calendar.text_building')} ${translate('error.required')}`),
  facility: string()
    .trim()
    .required(`${translate('calendar.text_facility')} ${translate('error.required')}`),
  date: string()
    .trim()
    .required(`${translate('calendar.text_date')} ${translate('error.required')}`),
  fromTime: string()
    .trim()
    .required(`${translate('calendar.text_from')} ${translate('error.required')}`),
  toTime: string()
    .trim()
    .required(`${translate('calendar.text_to')} ${translate('error.required')}`),
  descriptions: string()
    .trim()
    .required(`${translate('calendar.text_description')} ${translate('error.required')}`),
});

const NewCalendarEvent = (props: Props) => {
  const route = useRoute();
  const { addEventCallback } = route.params as Props;

  /*Keyboard Accessory define */
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputNumb = 5;
  const inputComponents: any[] = [];
  /*========================== */

  const dispatch = useDispatch();

  const myCountry = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);

  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);

  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [selectListCountry, setSelectListCountry] = useState<ObjDropdown[]>([]);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);

  const [isPropertyModalVisible, setPropertyModalVisible] = useState<boolean>(false);
  const [selectedListProperty, setSelectedListProperty] = useState<string[]>([]);
  const [property, setProperty] = useState<ICompanyProperty[]>([]);
  const propertyList: ObjDropdown[] = [
    ...property.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item.name,
    }))
  ];

  const [isFacilityModalVisible, setFacilityModalVisible] = useState<boolean>(false);
  const [selectedListFacility, setSelectedListFacility] = useState<string[]>([]);
  const [listFacility, setListFacility] = useState<IFacility[]>([]);
  const selectListFacility: ObjDropdown[] = [
    ...listFacility.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item.name,
    }))
  ];

  useEffect(() => {
    fetchFacilities(me.default_company.id);
  }, []);

  useEffect(() => {
    const dataList: ObjDropdown[] = [];
    myCountry.forEach((item) => {
      const obj: ObjDropdown = {
        _key: item.id + "",
        _value: item.name,
      };
      dataList.push(obj);
    });
    setSelectListCountry(dataList);
  }, [myCountry]);

  const fetchFacilities = (companyId: string) => {
    if (companyId) {
      NavigationActionsService.showLoading();
      dispatch(getListFacilities({
        id: companyId,
        isSave: false,
        onSuccess: (data) => {
          setListFacility(data.results);
          NavigationActionsService.hideLoading();
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      }));
    }
  };

  const fetchListBuilding = (companyId: string, countryId: string, setFieldValue: any) => {
    // API: Get list building
    if (companyId && countryId !== '') {
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
            // console.log("===== Success List Building: ", data);
            setProperty(data.results);
            NavigationActionsService.hideLoading();
          },
          onFail: error => {
            setProperty([]);
            console.log("===== Fail List Building: ", error);
            NavigationActionsService.hideLoading();
          }
        }));
    } else {
      setProperty([]);
    }
  };

  /* KeyBoard Accessory Handle*/
  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    return inputComponents[index];
  };

  const nextInput = () => {
    const currentInput = getInputRef(currentInputIndex);
    currentInput.onDonePress && currentInput.onDonePress();
    currentInput.dismiss && currentInput.dismiss();

    const nextInputIndex = currentInputIndex + 1;
    const nextInput = getInputRef(nextInputIndex);

    setTimeout(() => {
      return nextInput.focus();
    });
  };

  const previousInput = () => {
    const currentInput = getInputRef(currentInputIndex);
    currentInput.onDonePress && currentInput.onDonePress();
    currentInput.dismiss && currentInput.dismiss();

    const previousInputIndex = currentInputIndex - 1;
    const previousInput = getInputRef(previousInputIndex);

    setTimeout(() => {
      return previousInput.focus();
    });
  };

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const onFocus = (index: number) => {
    setCurrentInputIndex(index);
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

  const onSubmit = (values: any) => {
    const momentDateFrom = moment(`${values.date} ${values.fromTime}`, 'DD/MM/YYYY HH:mm a');
    const momentDateTo = moment(`${values.date} ${values.toTime}`, 'DD/MM/YYYY HH:mm a');
    const dateFrom = momentDateFrom.toISOString();
    const dateTo = momentDateTo.toISOString();
    const params = {
      date_from: dateFrom,
      date_to: dateTo,
      title: values.title,
      description: values.descriptions,
      property: values.building,
      facility: values.facility,
      status: 'WAITING',
    };

    NavigationActionsService.showLoading();

    dispatch(
      createEvent({
        params,
        onSuccess: (data) => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.pop();
          addEventCallback && addEventCallback();
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );

  };

  /* Support functions */

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  const onOpenCountryModal = () => {
    Keyboard.dismiss();
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);

    if (isEqual(selectedList, selectedListCountry)) {
      return;
    }

    setSelectedListCountry(selectedList);

    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        selectListCountry.map((element: ObjDropdown) => {
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

  const onOpenPropertyModal = () => {
    Keyboard.dismiss();
    setPropertyModalVisible(true);
  };

  const onClosePropertyModal = () => {
    setPropertyModalVisible(false);
  };

  const onSelectPropertyDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setPropertyModalVisible(false);

    if (isEqual(selectedList, selectedListProperty)) {
      return;
    }

    setSelectedListProperty(selectedList);

    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        propertyList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const onOpenFacilityModal = () => {
    Keyboard.dismiss();
    setFacilityModalVisible(true);
  };

  const onCloseFacilityModal = () => {
    setFacilityModalVisible(false);
  };

  const onSelectFacilityDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setFacilityModalVisible(false);

    if (isEqual(selectedList, selectedListFacility)) {
      return;
    }

    setSelectedListFacility(selectedList);
    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        selectListFacility.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  /* Render */

  const renderCustomHeader = () => {
    return (
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate("calendar.new_event_title_section")}
        icon={ADD_PLUS}
        styleIcon={styles.sectionHeaderIcon}
      />
    );
  };

  const renderBottomButton = (formikProps: any) => {
    return (
      <View style={styles.bottomButtonContainer}>
        <CustomButton
          style={styles.bottomButton}
          text={translate("calendar.text_submit")}
          textStyle={styles.bottomText}
          onPress={formikProps.handleSubmit}
        />
      </View>
    );
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
        checkListData={selectListCountry}
        selectedList={selectedListCountry}
        onCloseModal={onCloseCountryModal}
        onDone={(selectedList: string[]) => {
          onSelectCountryDone(selectedList, setFieldValue, 'country');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderModalBuilding = (setFieldValue: any) => {
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
          onSelectPropertyDone(selectedList, setFieldValue, 'building');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderModalFacility = (setFieldValue: any) => {
    return <Modal
      key={'facility'}
      hideModalContentWhileAnimating
      isVisible={isFacilityModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseFacilityModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={selectListFacility}
        selectedList={selectedListFacility}
        onCloseModal={onCloseFacilityModal}
        onDone={(selectedList: string[]) => {
          onSelectFacilityDone(selectedList, setFieldValue, 'facility');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderMainView = (formikProps: any) => {
    const { values } = formikProps;

    return (
      <ScrollView
        style={styles.containerScrollView}
        contentContainerStyle={{ paddingVertical: 20 }}>

        {/* TITLE */}
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={`${translate('calendar.text_event_title')}: `}
          currentInputIndex={currentInputIndex}
          onChangeText={(field: string) => formikProps.setValues({ ...values, title: field })}
          autoCapitalize="sentences"
          returnKeyType="next"
          value={values.title}
          onFocus={() => onFocus(0)}
          onBlur={formikProps.handleBlur('title')}
        />
        <ErrorMessage errorValue={formikProps.touched.title && formikProps.errors.title} />

        {/* COUNTRY */}
        {renderModalCountry(formikProps.setFieldValue)}
        <CustomInputSelect
          description={translate('calendar.text_country')}
          text={values.country ? setTextFromKey(selectListCountry, selectedListCountry) : 'Please choose...'}
          onPress={onOpenCountryModal}
        />
        <ErrorMessage errorValue={formikProps.touched.country && formikProps.errors.country} />

        {/* BUILDING */}
        {renderModalBuilding(formikProps.setFieldValue)}
        <CustomInputSelect
          description={translate('calendar.text_building')}
          text={values.building ? setTextFromKey(propertyList, selectedListProperty) : 'Please choose...'}
          onPress={onOpenPropertyModal}
        />
        <ErrorMessage errorValue={formikProps.touched.building && formikProps.errors.building} />

        {/* FACILITY */}
        {renderModalFacility(formikProps.setFieldValue)}
        <CustomInputSelect
          description={translate('calendar.text_facility')}
          text={values.facility ? setTextFromKey(selectListFacility, selectedListFacility) : 'Please choose...'}
          onPress={onOpenFacilityModal}
        />
        <ErrorMessage errorValue={formikProps.touched.facility && formikProps.errors.facility} />

        {/* DATE */}
        <Text style={styles.dateTimePickerText}>{translate('calendar.text_date')}</Text>
        <CustomDateTimePicker
          minDate={getToday()}
          ref={putInputRef.bind(undefined)}
          onFocus={() => onFocus(1)}
          onDateChange={formikProps.handleChange('date')}
          date={formikProps.values.date}
          mainContainer={styles.dateTimePickerStyle}
        />
        <ErrorMessage errorValue={formikProps.touched.date && formikProps.errors.date} />

        {/* FROM - TO */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 28 }}>
            <Text style={styles.dateTimePickerText}>{translate('calendar.text_from')}</Text>
            <CustomDateTimePicker
              ref={putInputRef.bind(undefined)}
              onFocus={() => onFocus(1)}
              onDateChange={(date: any) => {
                const beginningTime = moment(date, 'HH:mm a');
                const endTime = moment(formikProps.values.toTime, 'HH:mm a');
                if (!beginningTime.isBefore(endTime)) {
                  formikProps.setValues({ ...values, fromTime: date, toTime: date });
                } else {
                  formikProps.setValues({ ...values, fromTime: date });
                }
              }}
              date={formikProps.values.fromTime}
              minDate={moment(today).format('HH:mm a')}
              mainContainer={styles.dateTimePickerStyle}
              mode='time'
              format="HH:mm a"
            />
            <ErrorMessage errorValue={formikProps.touched.fromTime && formikProps.errors.fromTime} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.dateTimePickerText}>{translate('calendar.text_to')}</Text>
            <CustomDateTimePicker
              ref={putInputRef.bind(undefined)}
              onFocus={() => onFocus(1)}
              onDateChange={formikProps.handleChange('toTime')}
              date={formikProps.values.toTime}
              minDate={formikProps.values.fromTime}
              mainContainer={styles.dateTimePickerStyle}
              mode='time'
              format="HH:mm a"
            />
            <ErrorMessage errorValue={formikProps.touched.toTime && formikProps.errors.toTime} />
          </View>
        </View>

        {/* DESCRIPTION */}
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={`${translate('calendar.text_description')}: `}
          currentInputIndex={currentInputIndex}
          autoCapitalize="sentences"
          returnKeyType="next"
          onChangeText={(text: string) => {
            setScrollEnabled(true);
            formikProps.setValues({ ...values, descriptions: text });
          }}
          value={values.descriptions}
          multiline={true}
          onFocus={() => onFocus(4)}
          onBlur={() => {
            formikProps.handleBlur('descriptions');
            setScrollEnabled(false);
          }}
          scrollEnabled={scrollEnabled}
          moreStyle={styles.descriptionsContainer}
        />
        <ErrorMessage errorValue={formikProps.touched.descriptions && formikProps.errors.descriptions} />

      </ScrollView>
    );
  };

  const today = new Date();
  const initialValues = {
    title: '',
    country: '',
    building: '',
    facility: '',
    date: moment(today).format('DD/MM/YYYY'),
    fromTime: moment(today).format('HH:mm a'),
    toTime: moment(today).format('HH:mm a'),
    descriptions: ''
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior={'padding'}>
        <Container
          spaceBottom={true}
          isDisplayMenuButton={false}
          isDisplayNotification={false}
          isShowHeader={true}
          title={translate("calendar.new_event_title_header")}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}>
            {formikProps => {
              return (
                <View style={{ flex: 1 }}>
                  {renderCustomHeader()}
                  {renderMainView(formikProps)}
                  {renderBottomButton(formikProps)}
                </View>
              );
            }}
          </Formik>
        </Container>
      </KeyboardAvoidingView>
      {InputAccessoryView}
    </View>
  );
};

export default NewCalendarEvent;
