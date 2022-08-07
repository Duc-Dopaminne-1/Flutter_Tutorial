import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { View, ScrollView, Keyboard, KeyboardAvoidingView, Alert, TouchableWithoutFeedback } from 'react-native';
import ICON_FILTER from '@src/res/icons/icon_filter.png';
import { CustomButton } from '@src/components/CustomButton';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { Formik } from 'formik';
import { object } from 'yup';
import { upperCase, findIndex, pickBy, identity, concat, find } from 'lodash';
//@ts-ignore
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle, isAndroid, getApartmentName } from '@src/utils';
import { LimitGetAll } from '@src/constants/vars';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { CustomText } from '@src/components/CustomText';
import CustomDateTimePicker, { getToday } from '@src/components/CustomDateTimePicker';
import { useRoute } from '@react-navigation/native';
import NavigationActionsService from '@src/navigation/navigation';
import { hardMonthWeek, hardLastest, hardStatus, hardYear, hardAllType } from './dummyData';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { getListBlock, getListFloor } from '@src/modules/Config/actions';
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { getListProperty } from '@src/modules/Company/actions';
import { ICompanyUnit } from '@reup/reup-api-sdk/src/api/company/unit/model';
import { getListApartment } from '@src/modules/Company/actions';
import { QueryCompanyUnitParams } from '@reup/reup-api-sdk/libs/api/company/unit';
import moment from 'moment';
import CustomMonthYearPicker, { Type } from '@src/components/CustomMonthYearPicker';
import ICON_CALENDAR from '@src/res/icons/icon-calendar.png';
import CustomGroupRadioButton, { RadioButtonObject } from '@src/components/CustomGroupRadioButton';

/*
------ Use Screen ------
NavigationActionsService.push(FILTER, {
  numberOfInput:12,
  isBlockFloor: true,
  isSortByWeekMonth: true,
  indexSortByWeekMonth: 4,
  isSortByLatest: true,
  indexSortByLatest: 5,
  isShowBy: true,
  indexShowBy: 6,
  isStatus: true,
  indexStatus: 7,
  isAllType: true,
  indexAllType: 8,
  isYear: true,
  indexYear: 9,
  isFromTo: true,
  indexFrom: 10,
  indexTo: 11,
  onFilter: onApplyFilter
})

or ex....
NavigationActionsService.push(FILTER,
{
  numberOfInput: 7,
  isBlockFloor: true,
  isSortByWeekMonth: true,
  indexSortByWeekMonth: 4,
  isFromTo: true,
  indexFrom: 5,
  indexTo: 6,
   onFilter: onApplyFilter
})

const onApplyFilter = (filter: any) => {
  console.log('filter:', filter)
}
*/
interface Props {
  isBuilding: boolean;
  isBlockFloor: boolean;
  isSortByWeekMonth: boolean;
  isSortByLatest: boolean;
  isShowBy: boolean;
  isCategory: boolean;
  isStatus: boolean;
  isAllType: boolean;
  isYear: boolean;
  isFromTo: boolean;
  isApartment?: boolean;
  isFilterMonth?: boolean;
  numberOfInput: number;
  indexSortByWeekMonth: number;
  indexSortByLatest: number;
  indexShowBy: number;
  indexStatus: number;
  indexAllType: number;
  indexYear: number;
  indexFrom: number;
  indexTo: number;
  onFilter: (filter: any) => void;
  dataShowBy: any[],
  dataStatus: any[],
  dataSortByLatest: any[],
  dataType: any[],
  dataCategory: any[]
}

const defaultChoose = translate('filter.please_choose')
const defaultDate = moment()
const defaultDataDropdown = [{ _key: '', _value: defaultChoose }];
let isShowKeyboard = false;

const Filter = (props: Props) => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const route = useRoute();
  const {
    isBlockFloor,
    isSortByWeekMonth,
    isSortByLatest,
    isShowBy,
    isBuilding = true,
    isCategory,
    isStatus,
    isAllType,
    isYear,
    isFromTo,
    isApartment = false,
    isFilterMonth = false,
    numberOfInput = 2,
    indexSortByWeekMonth = 4,
    indexSortByLatest = 5,
    indexShowBy = 6,
    indexStatus = 7,
    indexAllType = 8,
    indexYear = 9,
    indexFrom = 10,
    indexTo = 11,
    dataShowBy = [],
    dataStatus = [],
    dataSortByLatest = [],
    dataType = [],
    dataCategory = [],
    onFilter,
  } = route.params as Props;

  // DATA DROPDOWN COUNTRIES
  const myCountryList = useSelector<RootState, ObjDropdown[]>((state: RootState) => {
    return state.company.listMyCountry.results.map(obj => {
      return { _key: `${obj.id}`, _value: obj.name }
    })
  });

  const [countries, setCountries] = useState<ObjDropdown[]>(concat(defaultDataDropdown, myCountryList));

  // DATA DROPDOWN BUILDINGS
  const buildingList = useSelector<RootState, ICompanyProperty[]>((state: RootState) => state.company.listProperty.results);
  const [buildings, setBuildings] = useState<ICompanyProperty[]>([]);
  const listBuilding: ObjDropdown[] = [
    defaultDataDropdown[0],
    ...buildings.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item.name,
    }))
  ]

  // DATA CATEGORY
  const [category, setCategory] = useState<ObjDropdown[]>(dataCategory ? concat(defaultDataDropdown, dataCategory) : defaultDataDropdown);

  // DATA DROPDOWN BLOCK, FLOOR
  const blockList = useSelector<RootState, string[]>((state: RootState) => state.config.listBlock.results);
  const wrapBlock = blockList && blockList.map((obj) => {
    return { _key: `${obj}`, _value: obj }
  });
  const floorList = useSelector<RootState, string[]>((state: RootState) => state.config.listFloor.results);
  const wrapFloor = floorList && floorList.map((obj) => {
    return { _key: `${obj}`, _value: obj }
  });
  const [blocks, setBlocks] = useState<ObjDropdown[]>(defaultDataDropdown);
  const [floors, setFloors] = useState<ObjDropdown[]>(defaultDataDropdown);

  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([""]);
  const [isBuildingModalVisible, setBuildingModalVisible] = useState<boolean>(false);
  const [selectedListBuilding, setSelectedListBuilding] = useState<string[]>([""]);
  const [isBlockModalVisible, setBlockModalVisible] = useState<boolean>(false);
  const [selectedListBlock, setSelectedListBlock] = useState<string[]>([""]);
  const [isFloorModalVisible, setFloorModalVisible] = useState<boolean>(false);
  const [selectedListFloor, setSelectedListFloor] = useState<string[]>([""]);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState<boolean>(false);
  const [selectedListCategory, setSelectedListCategory] = useState<string[]>([""]);

  // DATA APARTMENT
  const [isApartmentModalVisible, setApartmentModalVisible] = useState<boolean>(false);
  const [selectedListApartment, setSelectedListApartment] = useState<string[]>([""]);
  const [apartments, setApartments] = useState<ICompanyUnit[]>([]);
  const dataApartment: ObjDropdown[] = [
    defaultDataDropdown[0],
    ...apartments.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item ? getApartmentName(item.block, item.floor, item.code) : '',
    }))
  ]

  // API: GET BLOCK, FLOOR
  const fetchListBlock = (property_id: string) => {
    dispatch(
      getListBlock({
        property_id,
        page: 1,
        limit: LimitGetAll,
        onSuccess: (data) => {
          NavigationActionsService.hideLoading();
          if (data && data.results) {
            console.log('data.results Block: ', data.results)
            const wrapBlocks = data.results.map((obj: string) => {
              return { _key: `${obj}`, _value: obj }
            });
            setBlocks(concat(defaultDataDropdown, wrapBlocks))
          }
        },
        onFail: (error) => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    )
  }

  const fetchListFloor = (property_id: string) => {
    dispatch(
      getListFloor({
        property_id,
        page: 1,
        limit: LimitGetAll,
        onSuccess: (data) => {
          NavigationActionsService.hideLoading();
          if (data && data.results) {
            console.log('data.results Floor: ', data.results)
            const wrapFloors = data.results.map((obj: string) => {
              return { _key: `${obj}`, _value: obj }
            });
            setFloors(concat(defaultDataDropdown, wrapFloors))
          }
        },
        onFail: (error) => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    )
  }

  const fetchListBuilding = (companyId: string, countryId: string) => {
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

  const fetchListApartment = (companyId: string, params: QueryCompanyUnitParams) => {
    if (companyId) {
      NavigationActionsService.showLoading()
      dispatch(
        getListApartment({
          companyId,
          page: 1,
          limit: LimitGetAll,
          isSave: false,
          q: params,
          onFail: error => {
            NavigationActionsService.hideLoading();
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          },
          onSuccess: data => {
            NavigationActionsService.hideLoading();
            setApartments(data.results)
          }
        })
      )
    }
  }

  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];
  const [paddingBottom, setPaddingBottom] = useState(0);

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
    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    isShowKeyboard = false;
    return () => {
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    };
  }, []);

  const validationSchema = object().shape({
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
    }, 500);
  };

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : defaultChoose;
  };

  const onApplyFilter = (values: any, actions: any) => {
    const dataFilter = {
      companyId: me && me.default_company ? me.default_company.id : '',
      country: values.country,
      building: values.building,
      block: isBlockFloor ? values.block : null,
      floor: isBlockFloor ? values.floor : null,
      sortByMonthWeek: isSortByWeekMonth ? values.sortByMonthWeek : null,
      sortByLatest: isSortByLatest ? values.sortByLatest : null,
      showBy: isShowBy ? values.showBy : null,
      category: isCategory ? values.category : null,
      status: isStatus ? values.status : null,
      allType: isAllType ? values.allType : null,
      year: isYear ? values.year : null,
      from: isFromTo || (find(dataShowBy, { _value: translate('filter.specific_time') })) ? values.from : null,
      to: isFromTo || (find(dataShowBy, { _value: translate('filter.specific_time') })) ? values.to : null,
      apartment: isApartment ? values.apartment : null,
      month: isFilterMonth
        ? values.month
          ? moment(values.month).format("YYYY-MM")
          : ''
        : null,
    }
    NavigationActionsService.pop();
    onFilter(pickBy(dataFilter, identity));
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

  const onSelectCategoryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCategoryModalVisible(false);
    setSelectedListCategory(selectedList);
    const objFind = category && find(category, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
  };

  const onOpenCategoryModal = () => {
    setCategoryModalVisible(true);
  };

  const onCloseCategoryModal = () => {
    setCategoryModalVisible(false);
  };

  const renderCategory = (formikProps: any) => {
    return (
      <View style={{ flex: 1, paddingBottom: 25 }}>
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
            checkListData={category}
            selectedList={selectedListCategory}
            onCloseModal={onCloseCountryModal}
            onDone={(selectedList: string[]) => {
              onSelectCategoryDone(selectedList, formikProps.setFieldValue, 'category');
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('filter.category')}
          text={formikProps.values.category ? setTextFromKey(category, selectedListCategory) : defaultChoose}
          onPress={onOpenCategoryModal}
        />
      </View>
    );
  }

  const handleDataBuilding = (selectedList: string[], setFieldValue: any) => {
    // Reset data when choose Country
    if (isBuilding) {
      const companyId = me && me.default_company ? me.default_company.id : ''
      selectedList[0] ? fetchListBuilding(companyId, selectedList[0]) : setBuildings([]);
      setSelectedListBuilding([""]);
      setFieldValue('building', defaultDataDropdown[0]._key);
    }
    if (isBlockFloor) {
      setSelectedListBlock([""]);
      setSelectedListFloor([""]);
      setBlocks(defaultDataDropdown);
      setFloors(defaultDataDropdown);
      setFieldValue('block', defaultDataDropdown[0]._key);
      setFieldValue('floor', defaultDataDropdown[0]._key);
    }
    if (isApartment) {
      setSelectedListApartment([""])
      setApartments([])
      setFieldValue('apartment', defaultDataDropdown[0]._key)
    }
  }

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);
    setSelectedListCountry(selectedList);
    const objFind = countries && find(countries, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
  };

  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const renderCountry = (formikProps: any) => {
    return (
      <View style={{ flex: 1, paddingBottom: 25 }}>
        <Modal
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
            checkListData={countries}
            selectedList={selectedListCountry}
            onCloseModal={onCloseCountryModal}
            onDone={(selectedList: string[]) => {
              onSelectCountryDone(selectedList, formikProps.setFieldValue, 'country');
              handleDataBuilding(selectedList, formikProps.setFieldValue);
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('filter.country')}
          text={formikProps.values.country ? setTextFromKey(countries, selectedListCountry) : defaultChoose}
          onPress={onOpenCountryModal}
        />
      </View>
    );
  }

  const handleDataBlockFloor = (selectedList: string[], setFieldValue: any) => {
    if (!isBlockFloor) {
      return
    }
    const objFind = listBuilding && find(listBuilding, { _key: selectedList[0] });
    if (objFind && objFind._key !== '') {
      fetchListBlock(objFind._key);
      fetchListFloor(objFind._key);
    } else {
      setBlocks(defaultDataDropdown);
      setFloors(defaultDataDropdown);
      setFieldValue('block', defaultDataDropdown[0]._key);
      setFieldValue('floor', defaultDataDropdown[0]._key);
    }
    // Reset data when choose Building
    setSelectedListBlock([""]);
    setSelectedListFloor([""]);
  }

  const handleDataApartment = (selectedList: string[], formikProps: any) => {
    if (!isApartment) {
      return
    }
    const { values, setFieldValue } = formikProps
    const objFind = listBuilding && find(listBuilding, { _key: selectedList[0] });
    if (objFind && objFind._key !== '') {
      const companyId = me && me.default_company ? me.default_company.id : ''
      fetchListApartment(companyId, {
        country_id: values.country,
        property_id: values.building,
      })
    } else {
      setApartments([])
      setFieldValue('apartment', defaultDataDropdown[0]._key);
    }
    setSelectedListApartment([""])
  }

  const onSelectBuildingDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setBuildingModalVisible(false);
    setSelectedListBuilding(selectedList);
    const objFind = listBuilding && find(listBuilding, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
  };

  const onOpenBuildingModal = () => {
    setBuildingModalVisible(true);
  };

  const onCloseBuildingModal = () => {
    setBuildingModalVisible(false);
  };

  const renderBuilding = (formikProps: any) => {
    return (
      <View style={{ flex: 1, paddingBottom: 25 }}>
        <Modal
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
              onSelectBuildingDone(selectedList, formikProps.setFieldValue, 'building');
              handleDataBlockFloor(selectedList, formikProps.setFieldValue);
              handleDataApartment(selectedList, formikProps);
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('new_apartment.building')}
          text={formikProps.values.building ? setTextFromKey(listBuilding, selectedListBuilding) : defaultChoose}
          onPress={onOpenBuildingModal}
        />
      </View>
    )
  }

  const onSelectBlockDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setBlockModalVisible(false);
    setSelectedListBlock(selectedList);
    const objFind = blocks && find(blocks, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
  };

  const onSelectFloorDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setFloorModalVisible(false);
    setSelectedListFloor(selectedList);
    const objFind = floors && find(floors, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
  };

  const onOpenBlockModal = () => {
    setBlockModalVisible(true);
  };

  const onCloseBlockModal = () => {
    setBlockModalVisible(false);
  };

  const onOpenFloorModal = () => {
    setFloorModalVisible(true);
  };

  const onCloseFloorModal = () => {
    setFloorModalVisible(false);
  };

  const renderBlockFloor = (formikProps: any) => {
    return (
      <View style={styles.viewRow}>
        <View style={{ flex: 1 }}>
          <Modal
            key={'block'}
            hideModalContentWhileAnimating
            isVisible={isBlockModalVisible}
            useNativeDriver
            customBackdrop={
              <TouchableWithoutFeedback onPress={onCloseBlockModal}>
                <View style={styles.backgroundModal} />
              </TouchableWithoutFeedback>
            }
          >
            <CustomSelect
              checkListData={blocks}
              selectedList={selectedListBlock}
              onCloseModal={onCloseBlockModal}
              onDone={(selectedList: string[]) => {
                onSelectBlockDone(selectedList, formikProps.setFieldValue, 'block');
              }}
              type={CustomSelectType.SingleSelect}
            />
          </Modal>
          <CustomInputSelect
            description={translate('filter.block')}
            text={formikProps.values.block ? setTextFromKey(blocks, selectedListBlock) : defaultChoose}
            onPress={onOpenBlockModal}
          />
        </View>
        <View style={{ width: 30 }} />
        <View style={{ flex: 1 }}>
          <Modal
            key={'floor'}
            hideModalContentWhileAnimating
            isVisible={isFloorModalVisible}
            useNativeDriver
            customBackdrop={
              <TouchableWithoutFeedback onPress={onCloseFloorModal}>
                <View style={styles.backgroundModal} />
              </TouchableWithoutFeedback>
            }
          >
            <CustomSelect
              checkListData={floors}
              selectedList={selectedListFloor}
              onCloseModal={onCloseFloorModal}
              onDone={(selectedList: string[]) => {
                onSelectFloorDone(selectedList, formikProps.setFieldValue, 'floor');
              }}
              type={CustomSelectType.SingleSelect}
            />
          </Modal>
          <CustomInputSelect
            description={translate('filter.floor')}
            text={formikProps.values.floor ? setTextFromKey(floors, selectedListFloor) : defaultChoose}
            onPress={onOpenFloorModal}
          />
        </View>
      </View>
    );
  }

  const renderSortByMonthWeek = (formikProps: any) => {
    return <CustomDropdownSelect
      numberOfInput={numberOfInput}
      currentInputIndex={currentInputIndex}
      arrData={hardMonthWeek}
      textTitle={`${translate('filter.sort_by')}`}
      containerMainStyle={styles.building}
      lineBottom={false}
      containerStyle={styles.filter}
      selected={findIndex(hardMonthWeek, { _key: formikProps.values.sortByMonthWeek }) ?? 0}
      onChangeDropDown={object => {
        formikProps.setValues({ ...formikProps.values, sortByMonthWeek: object._key })
      }}
      inputRef={putInputRef.bind(undefined)}
      onFocus={setCurrentInputIndex.bind(undefined, indexSortByWeekMonth)}
      onPressDown={nextInput}
      onPressUp={previousInput}
    />
  }

  const renderSortByLatest = (formikProps: any) => {
    const data = (dataSortByLatest && dataSortByLatest.length != 0) ? dataSortByLatest : hardLastest
    const index = data.findIndex(item => item._key == formikProps.values.sortByLatest)

    return <CustomDropdownSelect
      numberOfInput={numberOfInput}
      currentInputIndex={currentInputIndex}
      arrData={data}
      textTitle={`${translate('filter.sort_by')}`}
      containerMainStyle={styles.building}
      lineBottom={false}
      containerStyle={styles.filter}
      selected={index >= 0 ? index : 0}
      onChangeDropDown={object => {
        formikProps.setValues({ ...formikProps.values, sortByLatest: object._key })
      }}
      inputRef={putInputRef.bind(undefined)}
      onFocus={setCurrentInputIndex.bind(undefined, indexSortByLatest)}
      onPressDown={nextInput}
      onPressUp={previousInput}
    />
  }

  const radioBtnData: RadioButtonObject[] = [
    { key: Type.AllTime, label: translate('filter.all_time') },
    { key: Type.SpecificTime, label: translate('filter.specific_time') }
  ]

  const onChangeType = (obj: RadioButtonObject, formikProps: any) => {
    formikProps.setValues({ ...formikProps.values, showBy: String(obj.key) })
  }

  const renderShowBy = (formikProps: any) => {
    if (find(dataShowBy, { _value: translate('filter.specific_time') })) {
      return (
        <View style={styles.building}>
          <CustomText styleContainer={styles.row} numberOfLines={1} style={styles.title} text={translate('filter.month')} />
          <CustomGroupRadioButton
            styleContainerRadioBtn={styles.containerGroupRadioButton}
            radioBtnsData={radioBtnData}
            onDataChange={(obj: RadioButtonObject) => onChangeType(obj, formikProps)}
          />
        </View>
      )
    } else {
      return <CustomDropdownSelect
        numberOfInput={numberOfInput}
        currentInputIndex={currentInputIndex}
        arrData={dataShowBy}
        textTitle={`${translate('filter.show_by')}`}
        containerMainStyle={styles.building}
        lineBottom={false}
        containerStyle={styles.filter}
        selected={findIndex(dataShowBy, { _key: formikProps.values.showBy })}
        onChangeDropDown={object => {
          formikProps.setValues({ ...formikProps.values, showBy: object._key })
        }}
        inputRef={putInputRef.bind(undefined)}
        onFocus={setCurrentInputIndex.bind(undefined, indexShowBy)}
        onPressDown={nextInput}
        onPressUp={previousInput}
      />
    }
  }

  const renderStatus = (formikProps: any) => {
    const data = (dataStatus && dataStatus.length != 0) ? dataStatus : hardStatus
    const index = data.findIndex(item => item._key == formikProps.values.status)
    return <CustomDropdownSelect
      numberOfInput={numberOfInput}
      currentInputIndex={currentInputIndex}
      arrData={data}
      textTitle={`${translate('filter.status')}`}
      containerMainStyle={styles.building}
      lineBottom={false}
      contentDropdownStyle={styles.statusContentDropdownStyle}
      containerStyle={styles.filter}
      selected={index >= 0 ? index : 0}
      onChangeDropDown={object => {
        formikProps.setValues({ ...formikProps.values, status: object._key })
      }}
      inputRef={putInputRef.bind(undefined)}
      onFocus={setCurrentInputIndex.bind(undefined, indexStatus)}
      onPressDown={nextInput}
      onPressUp={previousInput}
    />
  }


  const renderAllType = (formikProps: any) => {
    const data = (dataType && dataType.length != 0) ? dataType : hardAllType
    const index = data.findIndex(item => item._key == formikProps.values.allType)
    return <CustomDropdownSelect
      numberOfInput={numberOfInput}
      currentInputIndex={currentInputIndex}
      arrData={data}
      textTitle={`${translate('filter.type')}`}
      containerMainStyle={styles.building}
      lineBottom={false}
      containerStyle={styles.filter}
      selected={index >= 0 ? index : 0}
      onChangeDropDown={object => {
        formikProps.setValues({ ...formikProps.values, allType: object._key })
      }}
      inputRef={putInputRef.bind(undefined)}
      onFocus={setCurrentInputIndex.bind(undefined, indexAllType)}
      onPressDown={nextInput}
      onPressUp={previousInput}
    />
  }

  const renderYear = (formikProps: any) => {
    return <CustomDropdownSelect
      numberOfInput={numberOfInput}
      currentInputIndex={currentInputIndex}
      arrData={hardYear}
      textTitle={`${translate('filter.year')}`}
      containerMainStyle={styles.building}
      lineBottom={false}
      containerStyle={styles.filter}
      selected={findIndex(hardYear, { _key: formikProps.values.year })}
      onChangeDropDown={object => {
        formikProps.setValues({ ...formikProps.values, year: object._key })
      }}
      inputRef={putInputRef.bind(undefined)}
      onFocus={setCurrentInputIndex.bind(undefined, indexYear)}
      onPressDown={nextInput}
      onPressUp={previousInput}
    />
  }

  const renderFromTo = (formikProps: any) => {
    return (
      <View style={styles.viewRow}>
        <View style={styles.row}>
          <CustomText text={`${translate('filter.from')}`} style={styles.title} />
          <CustomDateTimePicker
            ref={putInputRef.bind(undefined)}
            onFocus={setCurrentInputIndex.bind(undefined, indexFrom)}
            date={formikProps.values.from}
            onDateChange={(date: any) => {
              formikProps.setValues({ ...formikProps.values, from: date, to: date })
            }} />
        </View>
        <View style={{ width: 15 }} />
        <View style={styles.row}>
          <CustomText text={`${translate('filter.to')}`} style={styles.title} />
          <CustomDateTimePicker
            ref={putInputRef.bind(undefined)}
            minDate={formikProps.values.from}
            onFocus={setCurrentInputIndex.bind(undefined, indexTo)}
            date={formikProps.values.to}
            onDateChange={(date: any) => {
              formikProps.setValues({ ...formikProps.values, to: date })
            }} />
        </View>
      </View>
    );
  }

  const onSelectApartmentDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setApartmentModalVisible(false);
    setSelectedListApartment(selectedList);
    const objFind = dataApartment && find(dataApartment, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
  };

  const onOpenApartmentModal = () => {
    setApartmentModalVisible(true);
  };

  const onCloseApartmentModal = () => {
    setApartmentModalVisible(false);
  };

  const renderApartment = (formikProps: any) => {
    return (
      <View style={{ flex: 1, paddingBottom: 25 }}>
        <Modal
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
            checkListData={dataApartment}
            selectedList={selectedListApartment}
            onCloseModal={onCloseApartmentModal}
            onDone={(selectedList: string[]) => {
              onSelectApartmentDone(selectedList, formikProps.setFieldValue, 'apartment');
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('filter.apartment')}
          text={formikProps.values.apartment ? setTextFromKey(dataApartment, selectedListApartment) : defaultChoose}
          onPress={onOpenApartmentModal}
        />
      </View>
    );
  }

  const renderMonth = (formikProps: any) => {
    const { values, setFieldValue } = formikProps
    const month = values.month ?? defaultDate
    return (
      <CustomMonthYearPicker
        title={translate('filter.month')}
        selectedMonth={moment(month).month() + 1}
        selectedYear={moment().year()}
        onDateChange={(month: number, year: number) => {
          if (month == 0 && year == 0) {
            setFieldValue('month', '')
          } else {
            setFieldValue('month', `${year}-${month}`)
          }
        }}
        buttonContainerStyle={styles.containerMonthYearPicker}
        containerTextStyle={styles.containerTextMonthYearPicker}
        textStyle={styles.textMonthYearPicker}
        icon={ICON_CALENDAR}
        iconRightStyle={styles.iconMonthYearPicker}
        isFilterType={true}
      />
    )
  }

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={{
          country: '',
          building: '',
          block: '',
          floor: '',
          sortByMonthWeek: hardMonthWeek[0]._key,
          sortByLatest: '',
          showBy: dataShowBy.length > 0 ? dataShowBy[0]._key : '',
          category: '',
          status: (dataStatus && dataStatus.length != 0) ? dataStatus[0]._key : hardStatus[0]._key,
          allType: (dataType && dataType.length != 0) ? dataType[0]._key : hardAllType[0]._key,
          year: hardYear[0]._key,
          from: getToday(),
          to: getToday(),
          apartment: '',
          month: ''
        }}
        onSubmit={onApplyFilter}
        validationSchema={validationSchema}>
        {formikProps => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>

                {renderCountry(formikProps)}

                {isBuilding ? renderBuilding(formikProps) : null}

                {isBlockFloor ? renderBlockFloor(formikProps) : null}

                {isApartment ? renderApartment(formikProps) : null}

                {isSortByWeekMonth ? renderSortByMonthWeek(formikProps) : null}

                {isSortByLatest ? renderSortByLatest(formikProps) : null}

                {isCategory ? renderCategory(formikProps) : null}

                {isStatus ? renderStatus(formikProps) : null}

                {isAllType ? renderAllType(formikProps) : null}

                {isShowBy ? renderShowBy(formikProps) : null}

                {isYear ? renderYear(formikProps) : null}

                {isFromTo ? renderFromTo(formikProps) : null}

                {/* Check render From-To when data Show by is All time - This month */}
                {isShowBy && find(dataShowBy, { _value: translate('filter.specific_time') }) && formikProps.values.showBy == '1' ? renderFromTo(formikProps) : null}

                {isFilterMonth ? renderMonth(formikProps) : null}

              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={formikProps.handleSubmit}
                text={upperCase(translate('filter.apply'))}
                style={styles.button} />
            </View>
          </View>
        )}
      </Formik>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Container spaceBottom={true} isDisplayNotification={false} isDisplayMenuButton={false} title={translate('filter.filter')} isShowHeader={true}>
          <View style={styles.container}>
            <CustomSectionHeader
              style={styles.sectionHeader}
              title={upperCase(translate('filter.filter'))}
              icon={ICON_FILTER}
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

export default React.memo(Filter);

