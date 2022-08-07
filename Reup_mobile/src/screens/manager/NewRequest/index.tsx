import React, { useState, useEffect, useRef } from 'react';
import {
  View, KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import Modal from 'react-native-modal';
import Container from '@src/components/Container';
import translate from '@src/localize';
import styles from './styles';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle, isAndroid, upperCaseFirstChar, getUserNameFromMail, getFullName, getApartmentName } from '@src/utils';
import { Formik } from 'formik';
import { object, string, array } from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { ADD_PLUS } from '@src/constants/icons';
import { upperCase, findIndex, find, clone, pickBy, identity } from 'lodash';
import CustomSectionHeader from '@src/components/CustomSection';
import { CustomButton } from '@src/components/CustomButton';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { Priority } from '@reup/reup-api-sdk/libs/api/enum';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { Theme } from '@src/components/Theme';
import { ICompanyUser } from '@reup/reup-api-sdk/libs/api/company/user/models';
import { getListStaff, getListProperty, getListApartment } from '@src/modules/Company/actions';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import { getListMaintenanceCategory, createRequest, getGeneral } from '@src/modules/Maintenance/actions';
import { ICompanyMaintenanceCategory } from '@reup/reup-api-sdk/libs/api/company/maintenance/category/models';
import { CustomText } from '@src/components/CustomText';
import CustomDateTimePicker, { getToday } from '@src/components/CustomDateTimePicker';
import AddImage from '@src/components/AddImage';
import { CustomFlatList } from '@src/components/FlatList';
import AddImageItem from '@src/components/FlatListItem/AddImageItem';
import moment from 'moment';
import NavigationActionsService from '@src/navigation/navigation';
import { uploadImage } from '@src/modules/auth/actions';
import { CreateMaintenanceRequest, QueryMaintenanceRequestGeneralParams } from '@reup/reup-api-sdk/libs/api/maintenance/request';
import { formatDateWith, formatUIToApi } from '@src/utils/date';
import { Config } from '@src/configs/appConfig';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { ICompanyUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { createFormData, ImageUploadModel, ObservebleImageModel } from '@src/utils/image';
import { of, combineLatest, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

let isShowKeyboard = false;

interface Props {
  MaintenanceRequestRef: any;
  StatusRequests: any;
}
const defaultDataDropdown = [{ _key: '', _value: 'Please Choose' }];
const NewRequest = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { MaintenanceRequestRef, StatusRequests } = route.params as Props;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const [images, setImages] = useState<ImageUploadModel[]>([]);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
  const inputComponents: any[] = [];
  const numberOfInput = 4;
  const limitGetAll = 1000;

  let newRequestObservable: any = null;

  const myCountryList = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([""]);

  const [isBuildingModalVisible, setBuildingModalVisible] = useState<boolean>(false);
  const [selectedListBuilding, setSelectedListBuilding] = useState<string[]>([""]);
  const [buildings, setBuildings] = useState<ICompanyProperty[]>([]);

  const [isApartmentModalVisible, setApartmentModalVisible] = useState<boolean>(false);
  const [selectedListApartment, setSelectedListApartment] = useState<string[]>([""]);
  const [apartments, setApartments] = useState<ICompanyUnit[]>([]);

  const [isAssigneeModalVisible, setAssigneeModalVisible] = useState<boolean>(false);
  const [selectedListAssignee, setSelectedListAssignee] = useState<string[]>([""]);
  const [assignee, setAssignee] = useState<ICompanyUser[]>([]);

  const [isCategoryModalVisible, setCategoryModalVisible] = useState<boolean>(false);
  const [selectedListCategory, setSelectedListCategory] = useState<string[]>([""]);
  const [category, setCategory] = useState<ICompanyMaintenanceCategory[]>([]);

  const dataCountries: ObjDropdown[] = [
    ...myCountryList.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item.name,
    }))
  ]

  const dataBuildings: ObjDropdown[] = [
    ...buildings.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item.name,
    }))
  ]

  const dataApartments: ObjDropdown[] = [
    ...apartments.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: getApartmentName(item.block, item.floor, item.code)
    }))
  ]

  const dataPriority: ObjDropdown[] = [
    { _key: Priority.High, _value: upperCaseFirstChar(Priority.High.valueOf()) },
    { _key: Priority.Medium, _value: upperCaseFirstChar(Priority.Medium.valueOf()) },
    { _key: Priority.Low, _value: upperCaseFirstChar(Priority.Low.valueOf()) }
  ]

  const dataAssignee: ObjDropdown[] = [
    ...assignee.map(item => ({
      _key: item.user ? item.user.user_id : '',
      _value: !item.user.first_name && !item.user.last_name
        ? getUserNameFromMail(item.user.email)
        : getFullName(item.user.first_name, item.user.last_name)
    }))
  ]

  const dataCategory: ObjDropdown[] = [
    ...category.map(item => ({
      _key: item.id,
      _value: item.name
    }))
  ]

  const fetchListStaff = (companyId: string) => {
    // API: Get list staff
    if (companyId !== "") {
      dispatch(
        getListStaff({
          id: companyId,
          isSave: false,
          limit: limitGetAll,
          page: 1,
          onSuccess: data => {
            setAssignee(data.results);
          },
        }));
    }
  };

  const fetchListMaintenanceCategory = (companyId: string) => {
    // API: Get list category
    if (companyId) {
      dispatch(
        getListMaintenanceCategory({
          companyId,
          isSave: false,
          limit: limitGetAll,
          page: 1,
          onSuccess: data => {
            setCategory(data.results);
          }
        }));
    }
  };

  const fetchListBuilding = (companyId: string, countryId: string) => {
    // API: Get list Building
    if (companyId) {
      NavigationActionsService.showLoading();
      dispatch(
        getListProperty({
          companyId,
          params: {
            country_id: countryId,
          },
          isSave: false,
          limit: limitGetAll,
          page: 1,
          onSuccess: async (data) => {
            console.log("===== Success List Building: ", data);
            setBuildings(data.results);
            NavigationActionsService.hideLoading();
          },
          onFail: error => {
            setBuildings([])
            NavigationActionsService.hideLoading();
          }
        }));
    } else {
      setBuildings([])
    }
  };

  const fetchListApartment = (companyId: string, countryId: string, propertyId: string) => {
    if (companyId) {
      NavigationActionsService.showLoading();
      const companyId = me.default_company.id ?? ''
      dispatch(
        getListApartment({
          companyId,
          page: 1,
          isSave: false,
          limit: limitGetAll,
          q: {
            country_id: countryId,
            property_id: propertyId
          },
          onSuccess: data => {
            console.log("===== Success List Apartment: ", data);
            setApartments(data.results);
            NavigationActionsService.hideLoading();
          },
          onFail: error => {
            setApartments([]);
            NavigationActionsService.hideLoading();
          }
        })
      );
    } else {
      setApartments([]);
    }
  }

  const fetchGeneralMaintenanceRequest = () => {
    // API: Get Count Request
    dispatch(
      getGeneral({
        companyId: me && me.default_company ? me.default_company.id : '',
        onSuccess: data => {
          console.log("===== Success general: ", data);
        },
        onFail: error => {
          console.log('Error', error && error.message);
        }
      })
    )
  }

  const onCreateRequest = (params: CreateMaintenanceRequest) => {
    dispatch(
      createRequest({
        companyId: me && me.default_company ? me.default_company.id : '',
        params,
        onSuccess: data => {
          NavigationActionsService.hideLoading();
          fetchGeneralMaintenanceRequest();
          if (MaintenanceRequestRef && MaintenanceRequestRef.current) {
            MaintenanceRequestRef.current.resetInitPage(1);
            MaintenanceRequestRef.current.scrollToTop();
            MaintenanceRequestRef.current.reloadData();
          }

          if (StatusRequests && StatusRequests.current) {
            StatusRequests.current.resetInitPage(1);
            StatusRequests.current.scrollToTop();
            StatusRequests.current.reloadData();
          }
          setTimeout(() => {
            NavigationActionsService.pop();
          }, 500);
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
    me && me.default_company && fetchListStaff(me.default_company.id);
    me && me.default_company && fetchListMaintenanceCategory(me.default_company.id);
    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    isShowKeyboard = false;
    return () => {
      if (newRequestObservable) {
        newRequestObservable.unsubscribe()
      }
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
  }

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const nextInput = () => {
    const currentInput = getInputRef(currentInputIndex);
    currentInput.dismiss && currentInput.dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex + 1).focus();
    }, 300);
  };

  const previousInput = () => {
    getInputRef(currentInputIndex).dismiss && getInputRef(currentInputIndex).dismiss();
    setTimeout(() => {
      return getInputRef(currentInputIndex - 1).focus();
    }, 300);
  };

  const renderHeader = () => {
    return (
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={upperCase(translate('requests.create_new_request'))}
        icon={ADD_PLUS}
        styleIcon={styles.sectionHeaderIcon}
      />
    );
  }

  const getColorPriorityText = (priority: string) => {
    if (priority == Priority.High) {
      return Theme.priority.high;
    } else if (priority == Priority.Medium) {
      return Theme.priority.medium;
    } else if (priority == Priority.Low) {
      return Theme.priority.low;
    } else {
      return Theme.priority.default;
    }
  };

  const initialValues = {
    title: '',
    country_id: '',
    property: '',
    unit: '',
    priority: dataPriority[0]._key,
    assignee: '',
    category: '',
    request_date: getToday(),
    note: '',
    img_urls: images,
  }

  const validationSchema = object().shape({
    title: string()
      .trim()
      .required(`${translate('requests.title')} ${translate('error.required')}`),
    country_id: string()
      .trim()
      .required(`${translate('transfer_apartment.country')} ${translate('error.required')}`),
    property: string()
      .trim()
      .required(`${translate('transfer_apartment.building_name')} ${translate('error.required')}`),
    unit: string()
      .trim()
      .required(`${translate('requests.apartment')} ${translate('error.required')}`),
    priority: string()
      .trim()
      .required(`${translate('requests.priority')} ${translate('error.required')}`),
    assignee: string()
      .trim()
      .required(`${translate('requests.assignee')} ${translate('error.required')}`),
    category: string()
      .trim()
      .required(`${translate('requests.category')} ${translate('error.required')}`),
    request_date: string()
      .trim()
      .required(`${translate('requests.request_date')} ${translate('error.required')}`),
    note: string()
      .trim()
      .required(`${translate('requests.note')} ${translate('error.required')}`),
    img_urls: array()
      .min(1, `${translate('new_apartment.images')} ${translate('error.required')}`)
  })

  const onChangeDropdown = (obj: ObjDropdown, setFieldValue: any, field: string) => {
    if (obj._key) {
      setFieldValue(field, obj._key)
      return
    }
    setFieldValue(field, '')
  }

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  const handleDataBuilding = (selectedList: string[], setFieldValue: any) => {
    const companyId = me && me.default_company ? me.default_company.id : ''
    selectedList[0] ? fetchListBuilding(companyId, selectedList[0]) : setBuildings([]);

    // Reset data when choose Country
    setSelectedListBuilding([""]);
    setFieldValue('property', defaultDataDropdown[0]._key);

    setApartments([]);
    setSelectedListApartment([""]);
    setFieldValue('unit', defaultDataDropdown[0]._key);
  }

  const handleDataApartment = (selectedList: string[], setFieldValue: any) => {
    const companyId = me && me.default_company ? me.default_company.id : ''
    selectedList[0] ? fetchListApartment(companyId, selectedListCountry[0], selectedList[0]) : setApartments([]);;

    // Reset data when choose Building
    setSelectedListApartment([""]);
    setFieldValue('unit', defaultDataDropdown[0]._key);
  }

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);
    setSelectedListCountry(selectedList);
    const objFind = dataCountries && find(dataCountries, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
  };

  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onSelectBuildingDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setBuildingModalVisible(false);
    setSelectedListBuilding(selectedList);
    const objFind = dataBuildings && find(dataBuildings, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
  };

  const onOpenBuildingModal = () => {
    setBuildingModalVisible(true);
  };

  const onCloseBuildingModal = () => {
    setBuildingModalVisible(false);
  };

  const onSelectApartmentDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setApartmentModalVisible(false);
    setSelectedListApartment(selectedList);
    const objFind = dataApartments && find(dataApartments, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
  };

  const onOpenApartmentModal = () => {
    setApartmentModalVisible(true);
  };

  const onCloseApartmentModal = () => {
    setApartmentModalVisible(false);
  };

  const onSelectAssigneeDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setAssigneeModalVisible(false);
    setSelectedListAssignee(selectedList);
    const objFind = dataAssignee && find(dataAssignee, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
  };

  const onOpenAssigneeModal = () => {
    setAssigneeModalVisible(true);
  };

  const onCloseAssigneeModal = () => {
    setAssigneeModalVisible(false);
  };

  const onSelectCategoryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCategoryModalVisible(false);
    setSelectedListCategory(selectedList);
    const objFind = dataCategory && find(dataCategory, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
  };

  const onOpenCategoryModal = () => {
    setCategoryModalVisible(true);
  };

  const onCloseCategoryModal = () => {
    setCategoryModalVisible(false);
  };

  const renderTitle = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomInput
          onFocus={() => setCurrentInputIndex(0)}
          inputRef={(input: any) => putInputRef(input)}
          description={translate('requests.title')}
          onChangeText={formikProps.handleChange('title')}
          returnKeyType="next"
          value={formikProps.values.apartmentCode}
          onBlur={formikProps.handleBlur('title')}
        />
        <ErrorMessage errorValue={formikProps.touched.title && formikProps.errors.title} />
      </View>
    )
  }

  const renderCountry = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          key={'country_id'}
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
            checkListData={dataCountries}
            selectedList={selectedListCountry}
            onCloseModal={onCloseCountryModal}
            onDone={(selectedList: string[]) => {
              onSelectCountryDone(selectedList, formikProps.setFieldValue, 'country_id');
              handleDataBuilding(selectedList, formikProps.setFieldValue);
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('filter.country')}
          text={formikProps.values.country_id ? setTextFromKey(dataCountries, selectedListCountry) : 'Please choose'}
          onPress={onOpenCountryModal}
        />
        <ErrorMessage errorValue={formikProps.touched.country_id && formikProps.errors.country_id} />
      </View>
    );
  }

  const renderBuilding = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          key={'property'}
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
            checkListData={dataBuildings}
            selectedList={selectedListBuilding}
            onCloseModal={onCloseBuildingModal}
            onDone={(selectedList: string[]) => {
              onSelectBuildingDone(selectedList, formikProps.setFieldValue, 'property');
              handleDataApartment(selectedList, formikProps.setFieldValue);
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('new_apartment.building')}
          text={formikProps.values.property ? setTextFromKey(dataBuildings, selectedListBuilding) : 'Please choose'}
          onPress={onOpenBuildingModal}
        />
        <ErrorMessage errorValue={formikProps.touched.property && formikProps.errors.property} />
      </View>
    )
  }

  const renderApartment = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          key={'unit'}
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
            checkListData={dataApartments}
            selectedList={selectedListApartment}
            onCloseModal={onCloseApartmentModal}
            onDone={(selectedList: string[]) => {
              onSelectApartmentDone(selectedList, formikProps.setFieldValue, 'unit');
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('requests.apartment')}
          text={formikProps.values.unit ? setTextFromKey(dataApartments, selectedListApartment) : 'Please choose'}
          onPress={onOpenApartmentModal}
        />
        <ErrorMessage errorValue={formikProps.touched.unit && formikProps.errors.unit} />
      </View>
    )
  }

  const renderPriority = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomDropdownSelect
          numberOfInput={numberOfInput}
          currentInputIndex={currentInputIndex}
          arrData={dataPriority}
          textTitle={translate('edit_recurring_task.priority')}
          lineBottom={false}
          containerStyle={styles.priority}
          selected={findIndex(dataPriority, { _key: upperCase(formikProps.values.priority) })}
          onChangeDropDown={(object: ObjDropdown) => {
            onChangeDropdown(object, formikProps.setFieldValue, 'priority')
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
  }

  const renderAssignee = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <Modal
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
            checkListData={dataAssignee}
            selectedList={selectedListAssignee}
            onCloseModal={onCloseAssigneeModal}
            onDone={(selectedList: string[]) => {
              onSelectAssigneeDone(selectedList, formikProps.setFieldValue, 'assignee');
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('requests.assignee')}
          text={formikProps.values.assignee ? setTextFromKey(dataAssignee, selectedListAssignee) : 'Please choose'}
          onPress={onOpenAssigneeModal}
        />
        <ErrorMessage errorValue={formikProps.touched.assignee && formikProps.errors.assignee} />
      </View>
    );
  }

  const renderCategory = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <Modal
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
            checkListData={dataCategory}
            selectedList={selectedListCategory}
            onCloseModal={onCloseCategoryModal}
            onDone={(selectedList: string[]) => {
              onSelectCategoryDone(selectedList, formikProps.setFieldValue, 'category');
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('requests.category')}
          text={formikProps.values.category ? setTextFromKey(dataCategory, selectedListCategory) : 'Please choose'}
          onPress={onOpenCategoryModal}
        />
        <ErrorMessage errorValue={formikProps.touched.category && formikProps.errors.category} />
      </View>
    );
  }

  const renderRequestDate = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomText text={`${translate('requests.request_date')}`} style={styles.title} styleContainer={styles.titleContainer} />
        <CustomDateTimePicker
          minDate={getToday()}
          ref={putInputRef.bind(undefined)}
          onFocus={() => setCurrentInputIndex(2)}
          date={formikProps.values.request_date}
          onDateChange={(date: any) => {
            formikProps.setFieldValue('request_date', date);
          }} />
        <ErrorMessage errorValue={formikProps.touched.request_date && formikProps.errors.request_date} />
      </View>
    )
  }

  const renderNote = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={`${translate('requests.note')}`}
          onChangeText={(field: string) => {
            formikProps.setValues({ ...formikProps.values, note: field })
            setScrollEnabled(true);
          }}
          returnKeyType="done"
          value={formikProps.values.note}
          onFocus={() => setCurrentInputIndex(3)}
          onBlur={() => {
            formikProps.handleBlur('note');
            setScrollEnabled(false);
          }}
          moreStyle={styles.note}
          multiline={true}
          scrollEnabled={scrollEnabled}
        />
        <ErrorMessage errorValue={formikProps.touched.note && formikProps.errors.note} />
      </View>
    )
  }

  const onLoadImage = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };

  const onRemoveImage = (index: number, setFieldValue: any) => {
    const cloneData = clone(images);
    cloneData.splice(index, 1);
    setImages(cloneData);
    setFieldValue('img_urls', cloneData)
  };

  const onCompletedPickerImage = (imageResponse: any, setFieldValue: any) => {
    if (images.length > 4) {
      Alert.alert(translate('alert.title_error'), 'Maximum is 5 images');
      return;
    }
    const cloneData = clone(images);
    cloneData.push(
      {
        file: {
          uri: imageResponse.path,
          type: imageResponse.mime,
          name: moment().valueOf().toString() + ".jpg"
        },
        isUploaded: false
      });
    setImages(cloneData);

    setFieldValue('img_urls', cloneData);
  };

  const onUploadImage = (formData: FormData) => {
    return new Promise<ObservebleImageModel>((resolve, reject) => {
      dispatch(
        uploadImage({
          data: formData,
          progress: () => { },
          onSuccess: (data) => {
            resolve({
              url: data.url,
              completed: true
            })
          },
          onFail: error => {
            resolve({
              completed: false
            })
          },
        }),
      );
    })
  }

  const onSubmitData = (responseUrls: string[], formikProps: any) => {
    const params: CreateMaintenanceRequest = pickBy({
      title: formikProps.title,
      priority: formikProps.priority,
      assignee: formikProps.assignee,
      category: formikProps.category,
      request_date: formatUIToApi(formikProps.request_date),
      note: formikProps.note,
      img_urls: responseUrls,
      property: formikProps.property,
      unit: formikProps.unit,
    }) as CreateMaintenanceRequest;
    onCreateRequest(params);
  }

  const onAddRequest = (values: any) => {
    const source$ = images.map((val: ImageUploadModel) => {
      if (!val.isUploaded) {
        const formData = createFormData(val.file)
        return from(onUploadImage(formData))
      }
      return of({
        url: val.file.uri,
        completed: true
      });
    })
    newRequestObservable = of(source$).pipe(
      switchMap(() => {
        NavigationActionsService.showLoading();
        return combineLatest(source$)
      }),
      map((response) => {
        if (response && response.filter(item => !item.completed).length > 0) {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            Alert.alert(translate('alert.title_error'), translate('alert.message_error_default'));
          }, 700);
          return;
        }
        onSubmitData(response.map(item => item.url) as string[], values);
      })
    ).subscribe();
  }

  const renderItem = (item: any, index: number, setFieldValue: any) => {
    return (
      <AddImageItem item={item.file.uri} index={index} deleteOnpress={(index => { onRemoveImage(index, setFieldValue) })} />
    );
  };

  const renderAddImage = (formikProps: any) => {
    return (
      <View style={{ width: '100%' }}>
        <AddImage
          description={translate('new_apartment.add_image')}
          onCompletedPickerImage={(imageResponse => { onCompletedPickerImage(imageResponse, formikProps.setFieldValue) })}
          images={images.map(item => item.file.uri)}
        />
        <CustomFlatList
          horizontal={true}
          onLoad={onLoadImage}
          data={images}
          showEmpty={false}
          contentContainerStyle={styles.imagesList}
          renderItem={(item: any, index: number) => renderItem(item, index, formikProps.setFieldValue)}
        />
        < ErrorMessage errorValue={formikProps.errors.img_urls as string} style={styles.error} />
      </View>
    )
  }

  const renderInputFields = (formikProps: any) => {
    return (
      <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
        <ScrollView style={styles.containerScrollView}>
          <View style={styles.inputFormSubContainer}>
            {renderTitle(formikProps)}
            {renderCountry(formikProps)}
            {renderBuilding(formikProps)}
            {renderApartment(formikProps)}
            {renderPriority(formikProps)}
            {renderAssignee(formikProps)}
            {renderCategory(formikProps)}
            {renderRequestDate(formikProps)}
            {renderNote(formikProps)}
            {renderAddImage(formikProps)}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomButton onPress={formikProps.handleSubmit} text={translate('new_apartment.submit')} style={styles.button} />
        </View>
      </View>
    );
  }

  const renderFormik = () => {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values: any) => onAddRequest(values)}>
        {formikProps => {
          return (
            <View style={styles.container}>
              {renderHeader()}
              {renderInputFields(formikProps)}
            </View>
          )
        }}
      </Formik>
    );
  }

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

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior='padding' >
        <Container
          spaceBottom={true}
          isShowHeader={true}
          isDisplayBackButton={true}
          title={translate('requests.new_request')}>
          {renderFormik()}
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View>
  )
}

export default React.memo(NewRequest);
