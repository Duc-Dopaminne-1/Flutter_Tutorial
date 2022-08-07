import Container from "@src/components/Container"
import React, { useState, useEffect } from "react"
import translate from "@src/localize"
import CustomSectionHeader from "@src/components/CustomSection"
import { IC_ELECTRICITY, IC_WATER, IC_SERVICE, IC_TELECOM, ICON_EDIT_WHITE } from "@src/constants/icons"
import styles from "./styles"
import { KeyboardAvoidingView, Keyboard, View, ScrollView, TouchableWithoutFeedback, Alert } from "react-native"
import getStyles from "@src/utils/getStyles"
import { getKeyboardAdvoidStyle, isAndroid, formatCurrency, getApartmentName, formatText } from "@src/utils"
import { KeyboardAccessoryView } from "react-native-keyboard-accessory"
import CustomAccessory from "@src/components/CustomAccessory"
import { Formik } from "formik"
import { CustomButton } from "@src/components/CustomButton"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@src/types/types"
import { ObjDropdown } from "@src/components/Dropdown/DropdownNative"
import { ICompanyProperty } from "@reup/reup-api-sdk/libs/api/company/property/model"
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models"
import CustomInputSelect from "@src/components/CustomInputSelect"
import CustomSelect, { CustomSelectType } from "@src/components/CustomSelect"
import ErrorMessage from "@src/components/ErrorMessage"
import Modal from "react-native-modal"
import { object, string, number } from "yup"
import NavigationActionsService from "@src/navigation/navigation"
import { getListProperty, getListApartment } from "@src/modules/Company/actions"
import { ICompanyUnit } from "@reup/reup-api-sdk/libs/api/company/unit/model"
import { QueryCompanyUnitParams } from "@reup/reup-api-sdk/libs/api/company/unit"
import moment from "moment"
import { CustomText } from "@src/components/CustomText"
import CustomInput from "@src/components/CustomInput"
import CustomTextInput from "@src/components/CustomTextInput"
import CustomMonthYearPicker from "@src/components/CustomMonthYearPicker"
import ICON_CALENDAR from '@src/res/icons/icon-calendar.png';
import { UpdateExpenseData } from "@reup/reup-api-sdk/libs/api/bulletin/expense"
import { editMonthlyBill } from "@src/modules/bulletin/actions"
import { useRoute } from "@react-navigation/native"
import { IExpense } from "@reup/reup-api-sdk/libs/api/bulletin/expense/model"
import { monthFormatToString, monthOrDayFormatNumberToString } from "@src/utils/date"

interface Props {
  item: IExpense,
  flatListRef: any
}

const EditMonthlyBill = (props: Props) => {
  const route = useRoute()
  const { item, flatListRef } = route.params as Props
  const dispatch = useDispatch()
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultCompanyId = me.default_company.id ?? '';
  const defaultChoose = translate('edit_monthly_bill.please_choose')
  const defaultDate = moment().format('YYYY-MM')

  const electric_fee = item && item.electric_fee ? item.electric_fee : 0
  const water_fee = item && item.water_fee ? item.water_fee : 0
  const telecom_fee = item && item.telecom_fee ? item.telecom_fee : 0
  const service_fee = item && item.service_fee ? item.service_fee : 0
  const total = electric_fee + water_fee + telecom_fee + service_fee
  const month = item && item.month ? moment(monthFormatToString(item.month)).format('YYYY-MM') : defaultDate

  const initialValues = {
    country: item && item.country ? `${item.country.id}` : '',
    building: item && item.property ? item.property.id : '',
    apartment: item && item.unit ? item.unit.id : '',
    month: month,
    electricity: electric_fee,
    water: water_fee,
    telecom: telecom_fee,
    service: service_fee,
    total: total,
  }

  const validationSchema = object().shape({
    country: string()
      .trim()
      .required(`${translate('edit_monthly_bill.input_country')} ${translate('error.required')}`),
    building: string()
      .trim()
      .required(`${translate('edit_monthly_bill.input_building')} ${translate('error.required')}`),
    apartment: string()
      .trim()
      .required(`${translate('edit_monthly_bill.input_apartment')} ${translate('error.required')}`),
    month: string()
      .trim()
      .required(`${translate('edit_monthly_bill.input_month')} ${translate('error.required')}`)
      .test(
        'month',
        translate('edit_monthly_bill.validate_month'),
        value => {
          const monthSelected = moment(monthFormatToString(value)).month()
          const yearSelected = moment(monthFormatToString(value)).year()
          const defaultMonth = moment(defaultDate).month()
          const defaultYear = moment(defaultDate).year()
          return yearSelected > defaultYear
            ? true
            : yearSelected == defaultYear
              ? monthSelected >= defaultMonth
              : false
        }
      ),
    total: number()
      .test(
        'total',
        translate('edit_monthly_bill.validate_total'),
        value => {
          return value > 0
        }
      )
  })

  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([initialValues.country]);
  const listCountry = useSelector<RootState, ObjDropdown[]>((state: RootState) => {
    return [
      ...state.company.listMyCountry.results.map(item => ({
        _key: item && item.id ? item.id + '' : '',
        _value: item && item.name ? item.name : '',
      }))
    ]
  });

  const [isBuildingModalVisible, setBuildingModalVisible] = useState<boolean>(false);
  const [selectedListBuilding, setSelectedListBuilding] = useState<string[]>([initialValues.building]);
  const [building, setBuilding] = useState<ICompanyProperty[]>([])
  const listBuilding: ObjDropdown[] = [
    ...building.map(item => ({
      _key: item && item.id ? item.id + '' : '',
      _value: item && item.name ? item.name : '',
    }))
  ]

  const [isApartmentModalVisible, setApartmentModalVisible] = useState<boolean>(false);
  const [selectedListApartment, setSelectedListApartment] = useState<string[]>([initialValues.apartment]);
  const [apartment, setApartment] = useState<ICompanyUnit[]>([])
  const listApartment: ObjDropdown[] = [
    ...apartment.map(item => ({
      _key: item && item.id ? item.id + '' : '',
      _value: item ? getApartmentName(item.block, item.floor, item.code) : ''
    }))
  ]

  const [paddingBottom, setPaddingBottom] = useState(0);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0)
  const inputComponents: any[] = [];
  const numberOfInput = 4;
  let isShowKeyboard = false;

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
    fetchDataProperties(initialValues.country)
    fetchDataApartments({
      country_id: initialValues.country,
      property_id: initialValues.building,
    })

    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    isShowKeyboard = false;
    return () => {
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
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
    currentInput.onDonePress && currentInput.onDonePress();
    currentInput.dismiss && currentInput.dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex + 1).focus();
    }, 100);
  };

  const previousInput = () => {
    const currentInput = getInputRef(currentInputIndex);
    currentInput.onDonePress && currentInput.onDonePress();
    currentInput.dismiss && currentInput.dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex - 1).focus();
    }, 100);
  };

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const fetchDataProperties = (countryId: string) => {
    if (defaultCompanyId) {
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
          onSuccess: data => {
            NavigationActionsService.hideLoading()
            setBuilding(data.results)
          }
        })
      )
    }
  }

  const fetchDataApartments = (params: QueryCompanyUnitParams) => {
    if (defaultCompanyId) {
      NavigationActionsService.showLoading()
      dispatch(
        getListApartment({
          companyId: defaultCompanyId,
          q: params,
          isSave: false,
          onSuccess: data => {
            NavigationActionsService.hideLoading()
            setApartment(data.results)
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

  const onSubmit = (values: any) => {
    if (!item || !item.id) {
      return
    }
    NavigationActionsService.showLoading()
    const params: UpdateExpenseData = {
      unit: values.apartment,
      month: monthFormatToString(values.month),
      electric_fee: parseInt(values.electricity ? values.electricity : 0),
      water_fee: parseInt(values.water ? values.water : 0),
      telecom_fee: parseInt(values.telecom ? values.telecom : 0),
      service_fee: parseInt(values.service ? values.service : 0)
    }
    dispatch(
      editMonthlyBill({
        id: item.id,
        params,
        onSuccess: data => {
          NavigationActionsService.hideLoading()
          flatListRef && flatListRef.current && flatListRef.current.reloadData()
          NavigationActionsService.pop()
        },
        onFail: error => {
          NavigationActionsService.hideLoading()
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    )
  }

  const renderHeader = () => {
    return (
      <CustomSectionHeader
        title={translate('edit_monthly_bill.title_section_header')}
        icon={ICON_EDIT_WHITE}
        style={styles.sectionHeader}
        styleIcon={styles.iconSectionHeader}
        styleTitle={styles.titleSectionHeader}
      />
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
            setFieldValue('apartment', '')
            setApartment([])
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
          description={translate('edit_monthly_bill.input_country')}
          text={(values.country && listCountry.length) > 0 ?
            setTextFromKey(listCountry, selectedListCountry)
            : defaultChoose}
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

  const onSelectBuildingDone = (selectedList: string[], formikProps: any, key: string) => {
    setBuildingModalVisible(false);
    setSelectedListBuilding(selectedList);
    if (selectedList !== []) {
      if (selectedList.length === 1) {
        listBuilding.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            onChangeDropdown(element, formikProps.setFieldValue, 'building')
            formikProps.setFieldValue('apartment', '')
            setApartment([])
            fetchDataApartments({
              country_id: formikProps.values.country ?? '',
              property_id: element._key ?? ''
            })
          }
        });
      }
    } else {
      formikProps.setFieldValue(key, "");
    }
  };

  const renderModalBuilding = (formikProps: any) => {
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
          onSelectBuildingDone(selectedList, formikProps, 'building');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>
  }

  const renderInputBuilding = (formikProps: any) => {
    const { values, touched, errors } = formikProps
    const text = (values.building && listBuilding.length > 0) ?
      setTextFromKey(listBuilding, selectedListBuilding)
      : defaultChoose
    return (
      <>
        {renderModalBuilding(formikProps)}
        <CustomInputSelect
          description={translate('edit_monthly_bill.input_building')}
          text={text}
          onPress={onOpenBuildingModal}
        />
        <ErrorMessage errorValue={touched.building && errors.building} />
      </>
    )
  }

  const onCloseApartmentModal = () => {
    setApartmentModalVisible(false);
  };

  const onOpenApartmentModal = () => {
    setApartmentModalVisible(true);
  };

  const onSelectApartmentDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setApartmentModalVisible(false);
    setSelectedListApartment(selectedList);
    if (selectedList !== []) {
      if (selectedList.length === 1) {
        listApartment.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            onChangeDropdown(element, setFieldValue, 'apartment')
          }
        });
      }
    } else {
      setFieldValue(key, '');
    }
  };

  const renderModalApartment = (setFieldValue: any) => {
    return <Modal
      key={'apartment'}
      hideModalContentWhileAnimating
      isVisible={isApartmentModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseApartmentModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={listApartment}
        selectedList={selectedListApartment}
        onCloseModal={onCloseApartmentModal}
        onDone={(selectedList: string[]) => {
          onSelectApartmentDone(selectedList, setFieldValue, 'apartment');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>
  }

  const renderInputApartment = (formikProps: any) => {
    const { setFieldValue, values, touched, errors } = formikProps
    const text = (values.apartment && listApartment.length > 0) ?
      setTextFromKey(listApartment, selectedListApartment)
      : defaultChoose
    return (
      <>
        {renderModalApartment(setFieldValue)}
        <CustomInputSelect
          description={translate('edit_monthly_bill.input_apartment')}
          text={text}
          onPress={onOpenApartmentModal}
        />
        <ErrorMessage errorValue={touched.apartment && errors.apartment} />
      </>
    )
  }

  const renderInputMonth = (formikProps: any) => {
    const { values, setFieldValue, touched, errors } = formikProps
    const month = values.month ?? defaultDate
    return (
      <>
        <CustomMonthYearPicker
          title={translate('edit_monthly_bill.input_month')}
          selectedMonth={moment(month).month() + 1}
          selectedYear={moment(month).year()}
          onDateChange={(month: number, year: number) => {
            setFieldValue('month', `${year}-${month}`)
          }}
          buttonContainerStyle={styles.containerMonthYearPicker}
          containerTextStyle={styles.containerTextMonthYearPicker}
          textStyle={styles.textMonthYearPicker}
          icon={ICON_CALENDAR}
          iconRightStyle={styles.iconMonthYearPicker}
        />
        <ErrorMessage errorValue={touched.month && errors.month} />
      </>
    )
  }

  const renderMonthlyFee = () => {
    return (
      <CustomText
        style={styles.monthlyFee}
        text={translate('edit_monthly_bill.monthly_fee')}
      />
    )
  }

  const onChangeText = (text: string, oldValue: number, formikProps: any, key: string) => {
    const { values, setFieldValue } = formikProps
    const newValue = parseInt(formatText(text))
    const total = values.total - (oldValue - newValue)
    setFieldValue('total', total)
    setFieldValue(key, newValue)
  }

  const renderInputElectricity = (formikProps: any) => {
    const { values, handleBlur, touched, errors } = formikProps
    const value = formatCurrency(values.electricity ? values.electricity : 0).replace('$', '')
    return (
      <>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={translate('edit_monthly_bill.input_electricity')}
          onChangeText={(text: string) =>
            onChangeText(text, values.electricity, formikProps, 'electricity')
          }
          returnKeyType="next"
          value={value}
          onFocus={() => setCurrentInputIndex(0)}
          onBlur={handleBlur('electricity')}
          componentContainer={styles.containerInputElectricity}
          iconDescription={IC_ELECTRICITY}
          keyboardType="number-pad"
          maxLength={14}
        />
        <ErrorMessage errorValue={touched.total && errors.total} />
      </>
    )
  }

  const renderInputWater = (formikProps: any) => {
    const { values, handleBlur, touched, errors } = formikProps
    const value = formatCurrency(values.water ? values.water : 0).replace('$', '')
    return (
      <>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={translate('edit_monthly_bill.input_water')}
          onChangeText={(text: string) =>
            onChangeText(text, values.water, formikProps, 'water')
          }
          returnKeyType="next"
          value={value}
          onFocus={() => setCurrentInputIndex(1)}
          onBlur={handleBlur('water')}
          iconDescription={IC_WATER}
          keyboardType="number-pad"
          maxLength={14}
        />
        <ErrorMessage errorValue={touched.total && errors.total} />
      </>
    )
  }

  const renderInputTelecom = (formikProps: any) => {
    const { values, handleBlur, touched, errors } = formikProps
    const value = formatCurrency(values.telecom ? values.telecom : 0).replace('$', '')
    return (
      <>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={translate('edit_monthly_bill.input_telecom')}
          onChangeText={(text: string) =>
            onChangeText(text, values.telecom, formikProps, 'telecom')
          }
          returnKeyType="next"
          value={value}
          onFocus={() => setCurrentInputIndex(2)}
          onBlur={handleBlur('telecom')}
          iconDescription={IC_TELECOM}
          keyboardType="number-pad"
          maxLength={14}
        />
        <ErrorMessage errorValue={touched.total && errors.total} />
      </>
    )
  }

  const renderInputService = (formikProps: any) => {
    const { values, handleBlur, touched, errors } = formikProps
    const value = formatCurrency(values.service ? values.service : 0).replace('$', '')
    return (
      <>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={translate('edit_monthly_bill.input_service')}
          onChangeText={(text: string) =>
            onChangeText(text, values.service, formikProps, 'service')
          }
          returnKeyType="next"
          value={value}
          onFocus={() => setCurrentInputIndex(3)}
          onBlur={handleBlur('service')}
          iconDescription={IC_SERVICE}
          keyboardType="number-pad"
          maxLength={14}
        />
        <ErrorMessage errorValue={touched.total && errors.total} />
      </>
    )
  }

  const renderTotal = (formikProps: any) => {
    const { values, touched, errors } = formikProps
    return (
      <>
        <CustomTextInput
          description={translate('edit_monthly_bill.total')}
          text={formatCurrency(values.total).replace('$', '')}
        />
        {/* <ErrorMessage errorValue={touched.total && errors.total} /> */}
      </>
    )
  }

  const renderSubmitBtn = (formikProps: any) => {
    return (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={formikProps.handleSubmit}
          text={translate('edit_monthly_bill.save')}
          style={styles.button} />
      </View>
    );
  };

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formikProps) => {
          return (
            <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
              <ScrollView
                style={styles.containerScrollView}
                contentContainerStyle={styles.contentContainerScrollView}
              >
                {renderInputCountry(formikProps)}
                {renderInputBuilding(formikProps)}
                {renderInputApartment(formikProps)}
                {renderInputMonth(formikProps)}
                {renderMonthlyFee()}
                {renderInputElectricity(formikProps)}
                {renderInputWater(formikProps)}
                {renderInputTelecom(formikProps)}
                {renderInputService(formikProps)}
                {renderTotal(formikProps)}
              </ScrollView>
              {renderSubmitBtn(formikProps)}
            </View>
          )
        }}
      </Formik>
    )
  }

  const renderKeyboardAccessory = () => {
    return (
      <KeyboardAccessoryView style={styles.accessory} androidAdjustResize>
        <CustomAccessory
          currentInputIndex={currentInputIndex}
          numberOfInput={numberOfInput}
          onPressDown={nextInput}
          onPressUp={previousInput}
          onPressDone={doneTyping}
        />
      </KeyboardAccessoryView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior={'padding'}>
        <Container
          spaceBottom={true}
          isDisplayNotification={false}
          isDisplayMenuButton={false}
          isShowHeader={true}
          title={translate('edit_monthly_bill.title')}>
          {renderHeader()}
          {renderInputFields()}
        </Container>
      </KeyboardAvoidingView>
      { renderKeyboardAccessory()}
    </View>
  )
}

export default EditMonthlyBill
