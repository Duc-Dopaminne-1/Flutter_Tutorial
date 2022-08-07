import Container from "@src/components/Container"
import React, { useState, useEffect } from "react"
import { ICompanyMaintenanceRecurringTask } from "@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task/models"
import { useRoute } from "@react-navigation/native"
import translate from "@src/localize"
import { KeyboardAvoidingView, TouchableWithoutFeedback, Alert, Keyboard, View, } from "react-native"
import getStyles from "@src/utils/getStyles"
import { getKeyboardAdvoidStyle, getFullName, getUserNameFromMail } from "@src/utils"
import { Formik } from 'formik';
import styles from "./styles"
import CustomSectionHeader from "@src/components/CustomSection"
import { ICON_EDIT_WHITE } from "@src/constants/icons"
import { object, string, number } from "yup"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@src/types/types"
import { IPagination } from "@reup/reup-api-sdk/libs/type"
import { ICompanyProperty } from "@reup/reup-api-sdk/libs/api/company/property/model"
import { ObjDropdown } from "@src/components/Dropdown/DropdownNative"
import CustomInput from "@src/components/CustomInput"
import ErrorMessage from "@src/components/ErrorMessage"
import { CustomButton } from "@src/components/CustomButton"
import { ScrollView } from "react-native-gesture-handler"
import Modal from 'react-native-modal'
import CustomInputSelect from "@src/components/CustomInputSelect"
import CustomSelect, { CustomSelectType } from "@src/components/CustomSelect"
import NavigationActionsService from "@src/navigation/navigation"
import { getListProperty, getListStaff } from "@src/modules/Company/actions"
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models"
import { ICompanyUser } from "@reup/reup-api-sdk/libs/api/company/user/models"
import { QueryCompanyUserParams } from "@reup/reup-api-sdk/libs/api/company/user"
import CustomGroupRadioButton, { RadioButtonObject } from "@src/components/CustomGroupRadioButton"
import { ICompanyMaintenanceCategory } from "@reup/reup-api-sdk/libs/api/company/maintenance/category/models"
import { getListMaintenanceCategory, updateRecurringTask } from "@src/modules/Maintenance/actions"
import { CustomDropdownSelect } from "@src/components/CustomDropdownSelect"
import { Theme } from "@src/components/Theme"
import { CustomText } from "@src/components/CustomText"
import { KeyboardAccessoryView } from "react-native-keyboard-accessory"
import CustomAccessory from "@src/components/CustomAccessory"
import { UpdateCompanyMaintenanceRecurringTaslParams } from "@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task"
import { Priority, FrequencyType } from "@reup/reup-api-sdk/libs/api/enum"

interface Props {
  item: ICompanyMaintenanceRecurringTask
  ref: any
}

const EditRecurringTaskTenant = (props: Props) => {

  enum Status {
    ACTIVE = 1,
    INACTIVE = 0,
  }

  const dispatch = useDispatch()
  const router = useRoute()
  const { item, ref } = router.params as Props

  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultCompanyId = me.default_company.id ?? '';

  const listProperty = useSelector<RootState, ICompanyProperty[]>((state: RootState) => state.company.listProperty.results)
  const property = listProperty && listProperty.find(itemProperty => itemProperty.id === item.property?.id)

  const initialValue = {
    title: item.title ?? '',
    country: property ? `${property.country.id}` : '',
    building: property ? property.id : '',
    assignee: item.default_assignee ? item.default_assignee.user_id : '',
    status: item.is_active ?? false,
    category: item.category ? item.category.id : '',
    priority: item.priority ?? '',
    note: item.descriptions ?? '',
    interval: item.frequency ?? 0,
    intervalType: item.frequency_type ?? '',
  }

  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([initialValue.country]);
  const listCountry = useSelector<RootState, ObjDropdown[]>((state: RootState) => {
    return [
      ...state.company.listMyCountry.results.map(item => ({
        _key: item.id + '',
        _value: item.name
      }))
    ]
  });

  const [isBuildingModalVisible, setBuildingModalVisible] = useState<boolean>(false);
  const [selectedListBuilding, setSelectedListBuilding] = useState<string[]>([initialValue.building]);
  const [building, setBuilding] = useState<ICompanyProperty[]>([])
  const listBuilding: ObjDropdown[] = [
    ...building.map(item => ({
      _key: item.id ?? '',
      _value: item.name ?? '',
    }))
  ]

  const [isAssigneeModalVisible, setAssigneeModalVisible] = useState<boolean>(false);
  const [selectedListAssignee, setSelectedListAssignee] = useState<string[]>([initialValue.assignee ?? '']);
  const [assignee, setAssignee] = useState<ICompanyUser[]>([])
  const listAssignee: ObjDropdown[] = [
    ...assignee.map(item => ({
      _key: item.user ? item.user.user_id : '',
      _value: item.user
        ? !item.user.first_name && !item.user.last_name
          ? getUserNameFromMail(item.user.email)
          : getFullName(item.user.first_name, item.user.last_name)
        : ''
    }))
  ]

  const [isCategoryModalVisible, setCategoryModalVisible] = useState<boolean>(false);
  const [selectedListCategory, setSelectedListCategory] = useState<string[]>([initialValue.category ?? '']);
  const [category, setCategory] = useState<ICompanyMaintenanceCategory[]>([])
  const listCategory: ObjDropdown[] = [
    ...category.map(item => ({
      _key: item.id ?? '',
      _value: item.name ?? ''
    }))
  ]

  const default_choose = translate("edit_recurring_task.please_choose")
  const status: RadioButtonObject[] = [
    { key: Status.ACTIVE, label: translate('edit_recurring_task.active') },
    { key: Status.INACTIVE, label: translate('edit_recurring_task.inactive') }
  ]
  const priority: ObjDropdown[] = [
    { _key: Priority.High, _value: translate('edit_recurring_task.high') },
    { _key: Priority.Medium, _value: translate('edit_recurring_task.medium') },
    { _key: Priority.Low, _value: translate('edit_recurring_task.low') },
  ]
  const interval: ObjDropdown[] = [
    // { _key: FrequencyType.DAY, _value: translate('edit_recurring_task.day') },
    { _key: FrequencyType.Weekly, _value: translate('edit_recurring_task.week') },
    { _key: FrequencyType.Monthly, _value: translate('edit_recurring_task.month') },
    { _key: FrequencyType.Yearly, _value: translate('edit_recurring_task.year') },
  ]

  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];
  const numberOfInput = 5;

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

  useEffect(() => {
    fetchDataProperties(initialValue.country)
    fetchDataAssignees({
      country_id: initialValue.country,
      property_id: initialValue.building,
    })
    fetchDataCategory()
  }, [])

  const validationSchema = object().shape({
    country: string()
      .trim()
      .required(`${translate('edit_recurring_task.country')} ${translate('error.required')}`),
    building: string()
      .trim()
      .required(`${translate('edit_recurring_task.building')} ${translate('error.required')}`),
    title: string()
      .trim()
      .required(`${translate('edit_recurring_task.task_title')} ${translate('error.required')}`),
    assignee: string()
      .trim()
      .required(`${translate('edit_recurring_task.assignee')} ${translate('error.required')}`),
    category: string()
      .trim()
      .required(`${translate('edit_recurring_task.category')} ${translate('error.required')}`),
    priority: string()
      .trim()
      .required(`${translate('edit_recurring_task.priority')} ${translate('error.required')}`),
    note: string()
      .trim()
      .required(`${translate('edit_recurring_task.note')} ${translate('error.required')}`),
    intervalType: string()
      .trim()
      .required(`${translate('edit_recurring_task.interval')} ${translate('error.required')}`),
    interval: number()
      .required(`${translate('edit_recurring_task.interval')} ${translate('error.required')}`),
  });

  const fetchDataProperties = (countryId: string) => {
    NavigationActionsService.showLoading()
    dispatch(
      getListProperty({
        companyId: defaultCompanyId,
        params: {
          country_id: countryId,
        },
        isSave: false,
        onFail: (error) => {
          NavigationActionsService.hideLoading()
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
        onSuccess: (data: IPagination<ICompanyProperty>) => {
          NavigationActionsService.hideLoading()
          setBuilding(data.results)
        }
      })
    )
  }

  const fetchDataAssignees = (params: QueryCompanyUserParams) => {
    dispatch(
      getListStaff({
        id: defaultCompanyId,
        isSave: false,
        onSuccess: (data) => {
          NavigationActionsService.hideLoading()
          setAssignee(data.results)
        },
        onFail: error => {
          NavigationActionsService.hideLoading()
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  }

  const fetchDataCategory = () => {
    dispatch(
      getListMaintenanceCategory({
        companyId: defaultCompanyId,
        isSave: false,
        onSuccess: (data) => {
          NavigationActionsService.hideLoading()
          setCategory(data.results)
        },
        onFail: error => {
          NavigationActionsService.hideLoading()
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  }

  const getColorPriorityText = (priority: string) => {
    switch (priority) {
      case Priority.High:
        return Theme.priority.high
      case Priority.Medium:
        return Theme.priority.medium
      case Priority.Low:
      default:
        return Theme.priority.low;
    }
  };

  const onSave = (values: any) => {
    NavigationActionsService.showLoading()
    const params: UpdateCompanyMaintenanceRecurringTaslParams = {
      title: values.title,
      category: values.category,
      is_active: values.status,
      descriptions: values.note,
      priority: values.priority,
      frequency: values.interval,
      frequency_type: values.intervalType,
      type: item.type,
      property: values.building,
      default_assignee: values.assignee,
    }
    dispatch(
      updateRecurringTask({
        companyId: defaultCompanyId,
        id: item.id,
        params: params,
        onSuccess: (data) => {
          NavigationActionsService.hideLoading()
          ref && ref.current && ref.current.reloadData()
          NavigationActionsService.popTo(2)
        },
        onFail: (error) => {
          NavigationActionsService.hideLoading()
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    )
  }

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const position = dropDownList.findIndex(item => item._key === listSelected[0])
    return position >= 0 ? dropDownList[position]._value : '';
  };

  const onChangeDropdown = (obj: ObjDropdown, setFieldValue: any, field: string) => {
    if (obj._key) {
      setFieldValue(field, obj._key)
      return
    }
    setFieldValue(field, '')
  }

  const renderInputTitle = (formikProps: any) => {
    const { handleChange, values, handleBlur, touched, errors } = formikProps
    return (
      <>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={`${translate('edit_recurring_task.task_title')}`}
          onChangeText={handleChange('title')}
          returnKeyType="next"
          value={values.title}
          onFocus={() => setCurrentInputIndex(0)}
          onBlur={handleBlur('title')}
        />
        <ErrorMessage errorValue={touched.title && errors.title} />
      </>
    )
  }

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);
    setSelectedListCountry(selectedList);
    if (selectedList !== []) {
      if (selectedList.length === 1) {
        listCountry.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            onChangeDropdown(element, setFieldValue, 'country')
            fetchDataProperties(element._key ?? '')
            setFieldValue('building', '')
            setBuilding([])
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
        checkListData={listCountry}
        selectedList={selectedListCountry}
        onCloseModal={onCloseCountryModal}
        onDone={(selectedList: string[]) => {
          onSelectCountryDone(selectedList, setFieldValue, 'country');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  }

  const renderInputCountry = (formikProps: any) => {
    const { setFieldValue, values, touched, errors } = formikProps
    return (
      <>
        {renderModalCountry(setFieldValue)}
        <CustomInputSelect
          description={translate('edit_recurring_task.country')}
          text={(values.country && listCountry.length) > 0 ?
            setTextFromKey(listCountry, selectedListCountry)
            : default_choose}
          onPress={onOpenCountryModal}
        />
        <ErrorMessage errorValue={touched.country && errors.country} />
      </>
    )
  }

  const onCloseBuildingModal = () => {
    setBuildingModalVisible(false);
  };

  const onOpenBuildingModal = () => {
    setBuildingModalVisible(true);
  };

  const onSelectBuildingDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setBuildingModalVisible(false);
    setSelectedListBuilding(selectedList);
    if (selectedList !== []) {
      if (selectedList.length === 1) {
        listBuilding.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            onChangeDropdown(element, setFieldValue, 'building')
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const renderModalBuilding = (setFieldValue: any) => {
    return <Modal
      key={'building'}
      hideModalContentWhileAnimating
      isVisible={isBuildingModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseBuildingModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={listBuilding}
        selectedList={selectedListBuilding}
        onCloseModal={onCloseBuildingModal}
        onDone={(selectedList: string[]) => {
          onSelectBuildingDone(selectedList, setFieldValue, 'building');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  }

  const renderInputBuilding = (formikProps: any) => {
    const { setFieldValue, values, touched, errors } = formikProps
    const text = (values.building && listBuilding.length > 0) ?
      setTextFromKey(listBuilding, selectedListBuilding)
      : default_choose
    return (
      <>
        {renderModalBuilding(setFieldValue)}
        <CustomInputSelect
          description={translate('edit_recurring_task.building')}
          text={text}
          onPress={onOpenBuildingModal}
        />
        <ErrorMessage errorValue={touched.building && errors.building} />
      </>
    )
  }

  const onCloseAssigneeModal = () => {
    setAssigneeModalVisible(false);
  };

  const onOpenAssigneeModal = () => {
    setAssigneeModalVisible(true);
  };

  const onSelectAssigneeDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setAssigneeModalVisible(false);
    setSelectedListAssignee(selectedList);
    if (selectedList !== []) {
      if (selectedList.length === 1) {
        listAssignee.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            onChangeDropdown(element, setFieldValue, 'assignee')
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const renderModalAssignee = (setFieldValue: any) => {
    return <Modal
      key={'assignee'}
      hideModalContentWhileAnimating
      isVisible={isAssigneeModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseAssigneeModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={listAssignee}
        selectedList={selectedListAssignee}
        onCloseModal={onCloseAssigneeModal}
        onDone={(selectedList: string[]) => {
          onSelectAssigneeDone(selectedList, setFieldValue, 'assignee');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>
  }

  const renderInputAssignee = (formikProps: any) => {
    const { setFieldValue, values, touched, errors } = formikProps
    const text = (values.assignee && listAssignee.length > 0) ?
      setTextFromKey(listAssignee, selectedListAssignee)
      : default_choose
    return (
      <>
        {renderModalAssignee(setFieldValue)}
        <CustomInputSelect
          description={translate('edit_recurring_task.assignee')}
          text={text}
          onPress={onOpenAssigneeModal}
          showLeftIcon={false}
          moreStyle={styles.containerInputAssignee}
        />
        <ErrorMessage errorValue={touched.assignee && errors.assignee} />
      </>
    )
  }

  const onTaskStatusChange = (obj: RadioButtonObject, formikProps: any) => {
    formikProps.setValues({ ...formikProps.values, status: obj.key });
  };

  const renderInputStatus = (formikProps: any) => {
    const selected = status.find(item => item.key == formikProps.values.status)
    return <CustomGroupRadioButton
      styleContainerRadioBtn={styles.groupRadioButton}
      radioBtnsData={status}
      defaultSelected={selected}
      onDataChange={(data: RadioButtonObject) => onTaskStatusChange(data, formikProps)}
      title={translate("edit_recurring_task.task_status")}
    />;
  };

  const onCloseCategoryModal = () => {
    setCategoryModalVisible(false);
  };

  const onOpenCategoryModal = () => {
    setCategoryModalVisible(true);
  };

  const onSelectCategoryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCategoryModalVisible(false);
    setSelectedListCategory(selectedList);
    if (selectedList !== []) {
      if (selectedList.length === 1) {
        listCategory.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            onChangeDropdown(element, setFieldValue, 'category')
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
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
        checkListData={listCategory}
        selectedList={selectedListCategory}
        onCloseModal={onCloseCategoryModal}
        onDone={(selectedList: string[]) => {
          onSelectCategoryDone(selectedList, setFieldValue, 'category');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>
  }

  const renderInputCategory = (formikProps: any) => {
    const { setFieldValue, values, touched, errors } = formikProps
    const text = (values.category && listCategory.length > 0) ?
      setTextFromKey(listCategory, selectedListCategory)
      : default_choose
    return (
      <>
        {renderModalCategory(setFieldValue)}
        <CustomInputSelect
          description={translate('edit_recurring_task.category')}
          text={text}
          onPress={onOpenCategoryModal}
        />
        <ErrorMessage errorValue={touched.category && errors.category} />
      </>
    )
  };

  const renderInputPriority = (formikProps: any) => {
    const { setFieldValue, handleBlur, touched, errors, values } = formikProps
    const selected = priority.findIndex(item => item._value == values.priority)
    return (
      <>
        <CustomDropdownSelect
          numberOfInput={numberOfInput}
          currentInputIndex={currentInputIndex}
          arrData={priority}
          textTitle={translate('edit_recurring_task.priority')}
          lineBottom={false}
          containerStyle={styles.priority}
          selected={selected >= 0 ? selected : 0}
          onChangeDropDown={(object) => {
            onChangeDropdown(object, setFieldValue, 'priority')
            handleBlur('priority');
          }}
          inputRef={(input: any) => putInputRef(input)}
          onFocus={() => setCurrentInputIndex(1)}
          onPressDown={nextInput}
          onPressUp={previousInput}
          textStyle={[styles.textDropdown, { color: getColorPriorityText(values.priority) }]}
        />
        <ErrorMessage errorValue={touched.priority && errors.priority} />
      </>
    );
  };

  const renderInputNote = (formikProps: any) => {
    const { values, handleBlur, touched, errors, setValues } = formikProps
    return (
      <>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={`${translate('edit_recurring_task.note')}`}
          onChangeText={(text: string) => {
            setValues({ ...values, note: text })
            setScrollEnabled(true)
          }}
          returnKeyType="next"
          value={values.note}
          moreStyle={styles.containerInputNote}
          // multiline={true}
          onFocus={() => setCurrentInputIndex(2)}
          onBlur={() => {
            handleBlur('note')
            setScrollEnabled(false)
          }}
          scrollEnabled={scrollEnabled}
        />
        <ErrorMessage errorValue={touched.note && errors.note} />
      </>
    )
  }

  const renderInputInterval = (formikProps: any) => {
    const { handleChange, values, handleBlur, touched, errors, setFieldValue } = formikProps
    const selected = interval.findIndex(item => item._key == values.intervalType)
    return (
      <>
        <View style={styles.intervalContainer}>
          <CustomText style={styles.titleInterval} text={translate('edit_recurring_task.interval')} />
          <View style={styles.intervalContents}>
            <CustomInput
              inputRef={(input: any) => putInputRef(input)}
              onChangeText={handleChange('interval')}
              mask={false}
              containerStyle={styles.intervalInput}
              keyboardType="number-pad"
              value={`${values.interval}`}
              onFocus={() => setCurrentInputIndex(3)}
              onBlur={handleBlur('interval')}
            />
            <CustomDropdownSelect
              arrData={interval}
              numberOfInput={numberOfInput}
              currentInputIndex={currentInputIndex}
              containerMainStyle={styles.intervalDropdown}
              lineBottom={false}
              containerStyle={styles.interval}
              selected={selected >= 0 ? selected : 0}
              onChangeDropDown={object => {
                onChangeDropdown(object, setFieldValue, 'intervalType');
                handleBlur('intervalType');
              }}
              inputRef={putInputRef.bind(undefined)}
              onFocus={() => setCurrentInputIndex(4)}
              onPressDown={nextInput}
              onPressUp={previousInput}
            />
          </View>
        </View>
        <ErrorMessage errorValue={(touched.interval && errors.interval) || (touched.intervalType && errors.intervalType)} />
      </>
    )
  };

  const renderBottomButton = (onSave: any) => {
    return (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onSave}
          text={translate('edit_recurring_task.save')}
          style={styles.button} />
      </View>
    )
  }

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={onSave}
      >
        {formikProps => {
          return (
            <>
              <ScrollView style={styles.containerInputFields}>
                {renderInputTitle(formikProps)}
                {renderInputCountry(formikProps)}
                {renderInputBuilding(formikProps)}
                {renderInputAssignee(formikProps)}
                {renderInputStatus(formikProps)}
                {renderInputCategory(formikProps)}
                {renderInputPriority(formikProps)}
                {renderInputNote(formikProps)}
                {renderInputInterval(formikProps)}
              </ScrollView>
              {renderBottomButton(formikProps.handleSubmit)}
            </>
          )
        }}
      </Formik >
    )
  }

  const renderKeyboardAccessory = () => (
    <KeyboardAccessoryView style={styles.keyboardAccessory} androidAdjustResize>
      <CustomAccessory
        currentInputIndex={currentInputIndex}
        numberOfInput={numberOfInput}
        onPressDown={nextInput}
        onPressUp={previousInput}
        onPressDone={doneTyping}
      />
    </KeyboardAccessoryView>
  );

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior={'padding'}>
        <Container
          isShowHeader={true}
          spaceBottom={true}
          isDisplayNotification={false}
          isDisplayMenuButton={false}
          title={translate('edit_recurring_task.title')}>
          <View style={styles.container}>
            <CustomSectionHeader
              title={translate('edit_recurring_task.title_section_header')}
              icon={ICON_EDIT_WHITE}
              style={styles.sectionHeader}
              styleIcon={styles.iconSectionHeader}
              styleTitle={styles.titleSectionHeader}
            />
            {renderInputFields()}
          </View>
        </Container >
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View>
  )
}

export default React.memo(EditRecurringTaskTenant)
