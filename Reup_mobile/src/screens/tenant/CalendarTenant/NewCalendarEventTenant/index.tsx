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
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IFacility } from "@reup/reup-api-sdk/libs/api/company/facility/models";
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import NavigationActionsService from '@src/navigation/navigation';
import { isEqual } from 'lodash';
import moment from 'moment';
//@ts-ignore
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomInputSelect from "@src/components/CustomInputSelect";
import CustomInput from "@src/components/CustomInput";
import { getListFacilities } from "@src/modules/FrontDesk/actions";
import { createEventTenant } from "@src/modules/calendar/actions";
import { useRoute } from "@react-navigation/native";

interface Props {
  addEventCallback: () => void;
}

const validationSchema = object().shape({
  title: string()
    .trim()
    .required(`${translate('calendar.text_event_title')} ${translate('error.required')}`),
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

const NewCalendarEventTenant = (props: Props) => {

  /*Keyboard Accessory define */
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputNumb = 5;
  const inputComponents: any[] = [];
  /*========================== */

  const dispatch = useDispatch();
  const route = useRoute();
  const { addEventCallback } = route.params as Props;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);

  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
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
    fetchFacilities();
  }, []);

  const fetchFacilities = () => {
    NavigationActionsService.showLoading();
    dispatch(getListFacilities({
      id: me && me.default_property,
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
      property: me && me.default_property,
      facility: values.facility,
    };

    NavigationActionsService.showLoading();

    dispatch(
      createEventTenant({
        propertyId: me && me.default_property,
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
              onFocus={() => onFocus(2)}
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
              onFocus={() => onFocus(3)}
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
          isShowHeader={true}
          spaceBottom={true}
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

export default NewCalendarEventTenant;
