import React, { useState, useEffect, useRef } from 'react';
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
import { hardMonthOfYears, hardIntervalType, hardStatus, hardPriority, getColorPriorityText } from './dummyData';
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
const NewTaskTenant = () => {
  const dispatch = useDispatch();
  const myCountry = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const route = useRoute();
  const { flatList }: any = route.params;
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
  const [monthsOfYear, setMonthsOfYear] = useState<any[]>(hardMonthOfYears);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [isPropertyModalVisible, setPropertyModalVisible] = useState<boolean>(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState<boolean>(false);
  const [isAssigneeModalVisible, setAssigneeModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);
  const [selectedListProperty, setSelectedListProperty] = useState<string[]>([]);
  const [selectedListCategory, setSelectedListCategory] = useState<string[]>([]);
  const [selectedListAssignne, setSelectedListAssignne] = useState<string[]>([]);
  const [selectedPriorityType, setSelectedPriorityType] = useState<number>(0);
  const [selectedIntervalType, setSelectedIntervalType] = useState<number>(0);
  const [countryDropdownList, setCountryDropdownList] = useState<ObjDropdown[]>([]);
  const [categoryDropdownList, setCategoryDropdownList] = useState<ObjDropdown[]>([]);
  const inputComponents: any[] = [];
  const numberOfInput = 5;
  const [assignee, setAssignee] = useState<ICompanyUser[]>([]);
  const listAssignee: ObjDropdown[] = [
    ...assignee.map(item => ({
      _key: item.user ? item.user.user_id : '',
      _value: !item.user.first_name && !item.user.last_name
        ? getUserNameFromMail(item.user.email)
        : getFullName(item.user.first_name, item.user.last_name)
    }))
  ];

  const [property, setProperty] = useState<ICompanyProperty[]>([]);
  const propertyList: ObjDropdown[] = [
    ...property.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item.name,
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
    me && me.default_company && fetchListMaintenanceCategory(me.default_company.id);
    me && me.default_company && fetchListStaff(me.default_company.id);
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

  const dataFrequency = [
    { _key: '', _value: 'Please Choose' },
    { _key: FrequencyType.Weekly, _value: upperCase(FrequencyType.Weekly.valueOf()) },
    { _key: FrequencyType.Monthly, _value: upperCase(FrequencyType.Monthly.valueOf()) },
    { _key: FrequencyType.Yearly, _value: upperCase(FrequencyType.Yearly.valueOf()) },
  ];

  const dataPriority = [
    { _key: '', _value: 'Please Choose' },
    { _key: Priority.High, _value: upperCase(Priority.High.valueOf()) },
    { _key: Priority.Medium, _value: upperCase(Priority.Medium.valueOf()) },
    { _key: Priority.Low, _value: upperCase(Priority.Low.valueOf()) },
  ];


  const fetchListMaintenanceCategory = (companyId: string) => {
    // API: Get list category
    if (companyId) {
      dispatch(
        getListMaintenanceCategory({
          companyId,
          isSave: false,
          limit: LimitGetAll,
          page: 1,
          onSuccess: async (data) => {
            console.log("===== Success List Category: ", data);
            const categoriesList: ObjDropdown[] = [];
            data && data.results.forEach((item: ICompanyMaintenanceCategory) => {
              const obj: ObjDropdown = {
                _key: item.id + "",
                _value: item.name,
              };
              categoriesList.push(obj);
            });
            setCategoryDropdownList(categoriesList);
          },
          onFail: () => {
          }
        }));
    }
  };

  const fetchListStaff = (companyId: string) => {
    // API: Get list staff
    if (companyId !== "") {
      dispatch(
        getListStaff({
          id: companyId,
          isSave: false,
          limit: LimitGetAll,
          page: 1,
          onSuccess: async (data) => {
            console.log("===== Success List Staff: ", data);
            setAssignee(data.results);
          },
          onFail: () => {
          }
        }));
    }
  };

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

  const validationSchema = object().shape({
    country: string()
      .trim()
      .required(`${translate('task.country')} ${translate('error.required')}`),
    building: string()
      .trim()
      .required(`${translate('task.building')} ${translate('error.required')}`),
    title: string()
      .trim()
      .required(translate('task.task_title_empty')),
    category: string()
      .trim()
      .required(`${translate('task.category')} ${translate('error.required')}`),
    priority: string()
      .trim()
      .required(`${translate('task.priority')} ${translate('error.required')}`),
    description: string()
      .trim()
      .required(`${translate('task.note')} ${translate('error.required')}`),
    intervalType: string()
      .trim()
      .required(translate('task.interval_to_perform_this_task_empty')),
    interval: string()
      .trim()
      .required(translate('task.interval_to_perform_this_task_empty')),
    assignee: string()
      .trim()
      .required(`${translate('task.assignee')} ${translate('error.required')}`),
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

  const onAddNewTask = (formikProps: any) => {

    const frequency = isNaN(Number(formikProps.interval)) ? Number(formikProps.interval) : 0;
    const status = formikProps.status === 1 ? true : false;
    const params: CreateCompanyMaintenanceRecurringTaslParams =
    {
      property: formikProps.building,
      title: formikProps.title,
      is_active: status,
      descriptions: formikProps.description,
      category: formikProps.category,
      priority: upperCase(formikProps.priority),
      frequency: frequency,
      frequency_type: formikProps.intervalType,
      default_assignee: formikProps.assignee,
      type: REQUEST
    };
    dispatch(
      createTaskRequest({
        companyId: me.default_company.id,
        params: params,
        onSuccess: async (data) => {
          flatList && flatList.current && flatList.current.reloadData();
          console.log("===== Success createTaskRequest: ", data);
          NavigationActionsService.pop();
        },
        onFail: error => {
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      }));
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

  const onOpenPropertyModal = () => {
    setPropertyModalVisible(true);
  };

  const onClosePropertyModal = () => {
    setPropertyModalVisible(false);
  };

  const onOpenCategoryModal = () => {
    setCategoryModalVisible(true);
  };

  const onCloseCategoryModal = () => {
    setCategoryModalVisible(false);
  };

  const onOpenAssignneModal = () => {
    setAssigneeModalVisible(true);
  };

  const onCloseAssignneModal = () => {
    setAssigneeModalVisible(false);
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

  const onSelectPropertyDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setPropertyModalVisible(false);
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

  const onSelectCategoryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCategoryModalVisible(false);
    setSelectedListCategory(selectedList);

    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        categoryDropdownList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const onSelectAssignneDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setAssigneeModalVisible(false);
    setSelectedListAssignne(selectedList);
    if (selectedList.length > 0) {
      let fieldValue = "";
      const listDataDisplay: string[] = [];
      if (selectedList.length === 1) {
        listAssignee.map((element) => {
          if (element._key === selectedList[0]) {
            fieldValue = element._key;
          }
        });
      } else {
        listAssignee.forEach((item) => {
          if (selectedList.includes(item._key)) {
            listDataDisplay.push(item._key);
          }
        });
        fieldValue = listDataDisplay.join(", ");
      }
      setFieldValue(key, fieldValue);
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

  const renderModalCategory = (setFieldValue: any) => {
    return <Modal
      key={'category'}
      hideModalContentWhileAnimating
      isVisible={isCategoryModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseCategoryModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={categoryDropdownList}
        selectedList={selectedListCategory}
        onCloseModal={onClosePropertyModal}
        onDone={(selectedList: string[]) => {
          onSelectCategoryDone(selectedList, setFieldValue, 'category');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderTaskTitle = (formikProps: any) => {
    return <CustomInput
      inputRef={(input: any) => putInputRef(input)}
      description={`${translate('task.task_title')}`}
      onChangeText={
        formikProps.handleChange('title')
      }
      returnKeyType="next"
      value={formikProps.values.title}
      onFocus={() => setCurrentInputIndex(0)}
      onBlur={formikProps.handleBlur('title')}

    />;
  };

  const onTaskStatusChange = (obj: RadioButtonObject, formikProps: any, setFieldValue: any) => {
    setFieldValue('status', obj.key);
  };
  const renderTaskStatus = (formikProps: any) => {
    return <CustomGroupRadioButton
      styleContainerRadioBtn={styles.groupRadioButton}
      radioBtnsData={hardStatus}
      onDataChange={(data: RadioButtonObject) => onTaskStatusChange(data, formikProps, formikProps.setFieldValue)}
      title={translate("task.task_status")}
    />;
  };

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  const renderPriority = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomDropdownSelect
          numberOfInput={numberOfInput}
          currentInputIndex={currentInputIndex}
          arrData={dataPriority}
          textTitle={`${translate('task.priority')}`}
          lineBottom={false}
          containerStyle={styles.filter}
          selected={selectedPriorityType}
          onChangeDropDown={(object) => {
            setSelectedPriorityType(dataPriority.findIndex(item => item._key === object._key));
            onChangeDropdownCategory(object, formikProps.setFieldValue, 'priority');
            formikProps.handleBlur('priority');
          }}
          inputRef={(input: any) => putInputRef(input)}
          onFocus={() => setCurrentInputIndex(1)}
          onPressDown={nextInput}
          onPressUp={previousInput}
          textStyle={[styles.textDropdown, { color: getColorPriorityText(formikProps.values.priority) }]}
        />
        <ErrorMessage errorValue={formikProps.touched.priority && formikProps.errors.priority} />
      </View>
    );
  };

  const renderDescription = (formikProps: any) => {
    return <CustomInput
      inputRef={(input: any) => putInputRef(input)}
      description={`${translate('task.note')}`}
      onChangeText={(field: string) => {
        formikProps.setValues({ ...formikProps.values, description: field.toString() });
        setScrollEnabled(true);
      }}
      returnKeyType="next"
      value={formikProps.values.description}
      onFocus={() => setCurrentInputIndex(2)}
      onBlur={() => {
        formikProps.handleBlur('description');
        setScrollEnabled(false);
      }}
      moreStyle={styles.description}
      multiline={true}
      scrollEnabled={scrollEnabled}
    />;
  };

  const renderSelectAssignee = (handleChange: any, handleBlur: any, values: any) => {
    return <View>
      <CustomText
        text={translate('task.assignee')}
        style={styles.titleInputText}
        styleContainer={styles.titleInputContainer}
      />
      <CustomTouchable
        onPress={onOpenAssignneModal}
      >
        <CustomInput
          pointerEvents={'none'}
          multiline={true}
          moreStyle={styles.moreStyleDescription}
          containerStyle={styles.containerStyleInput}
          onChangeText={handleChange('assignee')}
          inputStyle={styles.selectStyle}
          numberOfInput={1}
          onBlur={handleBlur('assignee')}
          currentInputIndex={currentInputIndex}
          editable={false}
          value={values.assignee ? setTextFromKey(listAssignee, selectedListAssignne) : ''}
        />
      </CustomTouchable>
    </View>;
  };

  const renderModalAssignee = (setFieldValue: any) => {
    return <Modal
      key={'assignee'}
      hideModalContentWhileAnimating
      isVisible={isAssigneeModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseAssignneModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={listAssignee}
        selectedList={selectedListAssignne}
        onCloseModal={onCloseAssignneModal}
        onDone={(selectedList: string[]) => {
          onSelectAssignneDone(selectedList, setFieldValue, 'assignee');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderInterval = (formikProps: any) => {
    return <View style={styles.intervalContainer}>
      <CustomText style={styles.titleInterval} text={translate('task.interval_to_perform_this_task')} />
      <View style={styles.intervalContents}>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          onChangeText={
            formikProps.handleChange('interval')}
          mask={false}
          containerStyle={styles.intervalInput}
          keyboardType="number-pad"
          value={formikProps.values.interval}
          onFocus={() => setCurrentInputIndex(3)}
          onBlur={formikProps.handleBlur('interval')}
        />
        <CustomDropdownSelect
          arrData={dataFrequency}
          numberOfInput={numberOfInput}
          currentInputIndex={currentInputIndex}
          containerMainStyle={styles.intervalDropdown}
          lineBottom={false}
          containerStyle={styles.filter}
          selected={selectedIntervalType}
          onChangeDropDown={object => {
            setSelectedIntervalType(dataFrequency.findIndex(item => item._key === object._key));
            onChangeDropdownCategory(object, formikProps.setFieldValue, 'intervalType');
            formikProps.handleBlur('intervalType');
          }}
          inputRef={(input: any) => putInputRef(input)}
          onFocus={() => setCurrentInputIndex(4)}
          onPressDown={nextInput}
          onPressUp={previousInput}
        />
      </View>
    </View>;
  };

  const onCheckBoxClick = (item: any, index: number, formikProps: any) => {
    const monthOfYearsClone = clone(monthsOfYear);
    monthOfYearsClone[index].isActive = !monthOfYearsClone[index].isActive;
    setMonthsOfYear(monthOfYearsClone);
    formikProps.setValues({ ...formikProps.values, monthsOfYear: monthOfYearsClone });
  };

  const renderMonthsOfYearItem = (item: any, index: number, formikProps: any) => {
    return (
      <CustomCheckBox
        stylesContainer={styles.containerCheckBox}
        text={item.name}
        isCheck={item.isActive}
        onPress={() => onCheckBoxClick(item, index, formikProps)} />
    );
  };

  const renderMonthsOfYear = (formikProps: any) => {
    return <View style={styles.monthsOfYearContainer}>
      <CustomText style={styles.titleInterval} text={translate('task.months_of_year')} />
      <CustomFlatList
        onLoad={onLoad}
        columnWrapperStyle={styles.columnWrapperStyle}
        horizontal={false}
        numColumns={2}
        data={monthsOfYear}
        contentContainerStyle={styles.contentContainerStyleGrid}
        renderItem={(item: any, index: number) => renderMonthsOfYearItem(item, index, formikProps)}
        keyExtractor={(item: any, index: number) => String(index)}
      />
    </View>;
  };

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={{
          country: '',
          building: '',
          title: '',
          status: 1,
          category: '',
          priority: '',
          description: '',
          interval: '',
          intervalType: '',
          monthsOfYear: monthsOfYear,
          assignee: ''
          // isMonthChecked: monthsOfYear.length > 0
        }}
        onSubmit={onAddNewTask}
        validationSchema={validationSchema}>
        {formikProps => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>

                {renderTaskTitle(formikProps)}
                <ErrorMessage errorValue={formikProps.touched.title && formikProps.errors.title} />

                {/* COUNTRY */}
                {renderModalCountry(formikProps.setFieldValue)}
                <CustomInputSelect
                  description={translate('task.country')}
                  text={formikProps.values.country ? setTextFromKey(countryDropdownList, selectedListCountry) : 'Please choose...'}
                  onPress={onOpenCountryModal}
                />
                <ErrorMessage errorValue={formikProps.touched.country && formikProps.errors.country} />

                {/* BUIDLING */}
                {renderModalBuilding(formikProps.setFieldValue)}
                <CustomInputSelect
                  description={translate('task.building')}
                  text={formikProps.values.building ? setTextFromKey(propertyList, selectedListProperty) : 'Please choose...'}
                  onPress={onOpenPropertyModal}
                />
                <ErrorMessage errorValue={formikProps.touched.building && formikProps.errors.building} />

                {/* ASSIGNEE */}
                {renderModalAssignee(formikProps.setFieldValue)}

                {renderSelectAssignee(formikProps.handleChange, formikProps.handleBlur, formikProps.values)}
                <ErrorMessage errorValue={formikProps.touched.assignee && formikProps.errors.assignee} />

                {renderTaskStatus(formikProps)}

                {/* CATEGORY */}
                {renderModalCategory(formikProps.setFieldValue)}
                <CustomInputSelect
                  description={translate('task.category')}
                  text={formikProps.values.category ? setTextFromKey(categoryDropdownList, selectedListCategory) : 'Please choose...'}
                  onPress={onOpenCategoryModal}
                />
                <ErrorMessage errorValue={formikProps.touched.category && formikProps.errors.category} />

                {renderPriority(formikProps)}

                {renderDescription(formikProps)}
                <ErrorMessage errorValue={formikProps.touched.description && formikProps.errors.description} />

                {renderInterval(formikProps)}
                <ErrorMessage errorValue={(formikProps.touched.interval && formikProps.errors.interval) ||
                  (formikProps.touched.intervalType && formikProps.errors.intervalType)} />

                {/* {renderMonthsOfYear(formikProps)}
                <ErrorMessage errorValue={formikProps.touched.isMonthChecked && formikProps.errors.isMonthChecked} /> */}
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton onPress={formikProps.handleSubmit} text={translate('new_notification.submit')} style={styles.button} />
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
          title={translate('task.new_task')}
          isShowHeader={true}
          spaceBottom={true}
          isDisplayMenuButton={false}
        >
          <View style={styles.container}>
            <CustomSectionHeader
              style={styles.sectionHeader}
              title={upperCase(translate('task.create_new_task'))}
              icon={ADD_PLUS}
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

export default NewTaskTenant;
