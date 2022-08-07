import React, { useState, useEffect } from 'react';
import styles from './styles';
import {
  View, ScrollView,
  Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Alert
} from 'react-native';
import Modal from 'react-native-modal';
import Container from '@src/components/Container';
import translate from '@src/localize';
import { CustomButton } from '@src/components/CustomButton';
import CustomSectionHeader from '@src/components/CustomSection';
import { ADD_PLUS } from '@src/constants/icons';
import { Formik } from 'formik';
import { object, string, array } from 'yup';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import CustomAccessory from '@src/components/CustomAccessory';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle, isAndroid, getApartmentName } from '@src/utils';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { HEIGHT, LimitGetAll } from '@src/constants/vars';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { CustomText } from '@src/components/CustomText';
import AddImage from '@src/components/AddImage';
import { CustomFlatList } from '@src/components/FlatList';
import AddImageItem from '@src/components/FlatListItem/AddImageItem';
import { clone, isEqual, pickBy } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import NavigationActionsService from '@src/navigation/navigation';
import { getListProperty, getListApartment } from '@src/modules/Company/actions';
import { useRoute } from '@react-navigation/native';
import { PerList, CurrencyList } from '@reup/reup-api-sdk/libs/api/enum';
import moment from "moment";
import { uploadImage } from "@src/modules/auth/actions";
import { ICompanyUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { createPostForLease, createPostForSale } from '@src/modules/bulletin/actions';
import { QueryCompanyUnitParams } from '@reup/reup-api-sdk/libs/api/company/unit';
import { createFormData, ImageUploadModel, ObservebleImageModel } from '@src/utils/image';
import { of, combineLatest, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export const postType: ObjDropdown[] = [
  { _key: '', _value: 'Please Choose' },
  { _key: 'For Lease', _value: 'For Lease' },
  { _key: 'For Sale', _value: 'For Sale' },
];

export const currency: ObjDropdown[] = [
  { _key: CurrencyList.Usd, _value: 'USD' },
  { _key: CurrencyList.Vnd, _value: 'VND' },
];

export const pers: ObjDropdown[] = [
  { _key: PerList.Day, _value: translate('post.pers_day') },
  { _key: PerList.Month, _value: translate('post.pers_month') },
  { _key: PerList.Year, _value: translate('post.pers_year') },
];

let isShowKeyboard = false;
const NewPost = () => {

  const route = useRoute();
  const { forLeaseFlatList, forSaleFlatList, currentPage } = route.params as any;

  const dispatch = useDispatch();

  const myCountry = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);

  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];
  const [paddingBottom, setPaddingBottom] = useState(0);
  const inputNumb = 6;
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
  const onLoadImage = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };
  const [images, setImages] = useState<ImageUploadModel[]>([]);
  let newPostObservable: any = null;
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
  const [isApartmentModalVisible, setApartmentModalVisible] = useState<boolean>(false);
  const [selectedListApartment, setSelectedListApartment] = useState<string[]>([]);
  const [apartmentList, setApartmentList] = useState<ICompanyUnit[]>([]);
  const apartmentDropdownList: ObjDropdown[] = [
    ...apartmentList.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: getApartmentName(item.block, item.floor, item.code)
    }))
  ];
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

  const fetchListApartment = (propertyId: string) => {
    // API: Get list apartment
    if (propertyId) {
      const params: QueryCompanyUnitParams = {
        property_id: propertyId
      };
      dispatch(
        getListApartment({
          companyId: me.default_company.id,
          q: params,
          isSave: false,
          limit: LimitGetAll,
          page: 1,
          onSuccess: async (data) => {
            // console.log("===== Success List Apartment: ", data);
            setApartmentList(data.results);
            NavigationActionsService.hideLoading();
          },
          onFail: error => {
            setProperty([]);
            console.log("===== Fail List Apartment: ", error);
            NavigationActionsService.hideLoading();
          }
        })
      );
    }
  };



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
      if (newPostObservable) {
        newPostObservable.unsubscribe();
      }
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    };
  }, []);

  /* KeyBoard Accessory Handle*/
  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

  const nextInput = () => {
    const currentInput = getInputRef(currentInputIndex);

    if (currentInput) {
      currentInput.dismiss && currentInput.dismiss(); //For dropdown
      currentInput.blur && currentInput.blur(); //For Input

      setTimeout(() => {
        const nextInput = getInputRef(currentInputIndex + 1);
        if (nextInput) {
          return nextInput.focus();
        }
      });
    }
  };
  const previousInput = () => {
    const currentInput = getInputRef(currentInputIndex);

    if (currentInput) {
      currentInput.dismiss && getInputRef(currentInputIndex).dismiss(); //For dropdown
      currentInput.blur && currentInput.blur(); //For Input

      setTimeout(() => {
        const previousInput = getInputRef(currentInputIndex - 1);
        if (previousInput) {
          return previousInput.focus();
        }
      });
    }
  };
  const validationSchema = object().shape({
    country: string()
      .trim()
      .required(`${translate('post.new_post_country')} ${translate('error.required')}`),
    building: string()
      .trim()
      .required(`${translate('post.new_post_building')} ${translate('error.required')}`),
    title: string()
      .trim()
      .required(`${translate('post.new_post_title')} ${translate('error.required')}`),
    apartment: string()
      .trim()
      .required(`${translate('post.new_post_apartment')} ${translate('error.required')}`),
    type: string()
      .trim()
      .required(`${translate('post.new_post_type')} ${translate('error.required')}`),
    price: string()
      .trim()
      .required(`${translate('post.new_post_price')} ${translate('error.required')}`),
    descriptions: string()
      .trim()
      .required(`${translate('post.new_post_description')} ${translate('error.required')}`),
    images: array()
      .min(1, `${translate('post.new_post_images')} ${translate('error.required')}`)
  });

  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const onFocus = (index: number) => {
    setCurrentInputIndex(index);
  };

  const initialValues = {
    country: '',
    building: '',
    title: '',
    type: currentPage ? currentPage : '',
    apartment: '',
    price: '',
    currency: 'USD',
    per: 'MONTH',
    descriptions: '',
    images: images,
  };

  const renderKeyboardAccessory = () => (
    <KeyboardAccessoryView style={{ padding: 0, height: 45 }} androidAdjustResize>
      <CustomAccessory
        currentInputIndex={currentInputIndex}
        numberOfInput={inputNumb}
        onPressDown={nextInput}
        onPressUp={previousInput}
        onPressDone={doneTyping}
      />
    </KeyboardAccessoryView>
  );

  const createNewPostForLease = (params: any) => {
    NavigationActionsService.showLoading();
    dispatch(
      createPostForLease({
        id: me.default_company.id,
        params: params,
        onSuccess: async (data) => {
          forLeaseFlatList && forLeaseFlatList.current && forLeaseFlatList.current.reloadData();
          NavigationActionsService.hideLoading();
          NavigationActionsService.pop();
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      }));
  };

  const createNewPostForSale = (params: any) => {
    NavigationActionsService.showLoading();
    dispatch(
      createPostForSale({
        id: me.default_company.id,
        params: params,
        onSuccess: async (data) => {
          forSaleFlatList && forSaleFlatList.current && forSaleFlatList.current.reloadData();
          NavigationActionsService.hideLoading();
          NavigationActionsService.pop();
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      }));
  };

  const renderHeader = () => (
    <CustomSectionHeader
      icon={ADD_PLUS}
      styleIcon={styles.iconHeader}
      title={translate("post.create_post_title")}
      style={styles.headerContainer}
    />
  );

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onOpenApartmentModal = () => {
    setApartmentModalVisible(true);
  };

  const onCloseApartmentModal = () => {
    setApartmentModalVisible(false);
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

  const onSelectApartmentDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setApartmentModalVisible(false);

    setSelectedListApartment(selectedList);
    if (selectedList.length > 0) {
      apartmentDropdownList.map((element: ObjDropdown) => {
        if (element._key === selectedList[0]) {
          setFieldValue(key, element._key);
        }
      });
    } else {
      setFieldValue(key, "");
    }
  };

  const onOpenPropertyModal = () => {
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
            setFieldValue('apartment', "");
            fetchListApartment(element._key);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const onRemoveImage = (index: number, setFieldValue: any) => {
    const cloneData = clone(images);
    cloneData.splice(index, 1);
    setImages(cloneData);
    setFieldValue("images", cloneData);
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

    setFieldValue('images', cloneData);
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
            });
          },
          onFail: error => {
            resolve({
              completed: false
            });
          },
        }),
      );
    });
  };

  const onSubmitData = (responseUrls: string[], formikProps: any) => {
    const params = pickBy({
      image_urls: responseUrls,
      thumbnail: responseUrls[0],
      description: formikProps.descriptions,
      price: formikProps.price,
      currency: formikProps.currency,
      property_id: formikProps.building,
      title: formikProps.title,
      per: formikProps.per,
      unit_id: formikProps.apartment
    });
    if (formikProps.type === 'For Lease') {
      createNewPostForLease(params);
    } else {
      createNewPostForSale(params);
    }
  };

  const onAddPost = (formikProps: any) => {
    const source$ = images.map((val: ImageUploadModel) => {
      if (!val.isUploaded) {
        const formData = createFormData(val.file);
        return from(onUploadImage(formData));
      }
      return of({
        url: val.file.uri,
        completed: true
      });
    });
    newPostObservable = of(source$).pipe(
      switchMap(() => {
        NavigationActionsService.showLoading();
        return combineLatest(source$);
      }),
      map((response) => {
        if (response && response.filter(item => !item.completed).length > 0) {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            Alert.alert(translate('alert.title_error'), translate('alert.message_error_default'));
          }, 700);
          return;
        }
        onSubmitData(response.map(item => item.url) as string[], formikProps);
      })
    ).subscribe();
  };

  const renderItem = (item: any, index: number, setFieldValue: any) => {
    return (
      <AddImageItem
        item={item.file.uri}
        index={index}
        deleteOnpress={(index => { onRemoveImage(index, setFieldValue); })} />
    );
  };

  const onChangeDropdown = (obj: ObjDropdown, setFieldValue: any, key: string) => {
    if (obj._key) {
      setFieldValue(key, obj._key);
      return;
    }
    setFieldValue(key, '');
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
        checkListData={apartmentDropdownList}
        selectedList={selectedListApartment}
        onCloseModal={onCloseApartmentModal}
        onDone={(selectedList: string[]) => {
          onSelectApartmentDone(selectedList, setFieldValue, 'apartment');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderContent = () => (
    <Formik
      initialValues={initialValues}
      onSubmit={(values: any) => onAddPost(values)}
      validationSchema={validationSchema}>
      {({ handleSubmit, values, errors, setValues, touched, handleChange, handleBlur, setFieldValue }) => {

        const typeSelected = postType.findIndex(item => item._value === values.type);
        const currencySelected = currency.findIndex(item => item._key === values.currency);
        const perSelected = pers.findIndex(item => item._key === values.per);

        return (
          <View style={[{ flex: 1 }, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView
              style={styles.contentContainer}
              showsVerticalScrollIndicator={false}>
              <View style={[styles.container]}>
                <View style={styles.formikContainer}>
                  {/* COUNTRY */}
                  {renderModalCountry(setFieldValue)}
                  <CustomInputSelect
                    description={translate('post.new_post_country')}
                    text={values.country ? setTextFromKey(selectListCountry, selectedListCountry) : 'Please choose...'}
                    onPress={onOpenCountryModal}
                  />
                  <ErrorMessage errorValue={touched.country && errors.country} />
                  {/* BUILDING */}
                  {renderModalBuilding(setFieldValue)}
                  <CustomInputSelect
                    description={translate('post.new_post_building')}
                    text={values.building ? setTextFromKey(propertyList, selectedListProperty) : 'Please choose...'}
                    onPress={onOpenPropertyModal}
                  />
                  <ErrorMessage errorValue={touched.building && errors.building} />
                  {/* TITLE */}
                  <CustomInput
                    inputRef={(input: any) => putInputRef(input)}
                    description={`${translate('post.new_post_title')}: `}
                    currentInputIndex={currentInputIndex}
                    onChangeText={(field: string) => setValues({ ...values, title: field })}
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    value={values.title}
                    onFocus={() => onFocus(0)}
                    onBlur={handleBlur('title')}
                  />
                  <ErrorMessage errorValue={touched.title && errors.title} />
                  {/* APARTMENT */}
                  {renderModalApartment(setFieldValue)}
                  <CustomInputSelect
                    description={translate('post.new_post_apartment')}
                    text={values.apartment ? setTextFromKey(apartmentDropdownList, selectedListApartment) : 'Please choose...'}
                    onPress={onOpenApartmentModal}
                  />
                  <ErrorMessage errorValue={touched.apartment && errors.apartment} />
                  {/* TYPE */}
                  <CustomDropdownSelect
                    onFocus={() => onFocus(1)}
                    numberOfInput={inputNumb}
                    currentInputIndex={currentInputIndex}
                    onPressUp={previousInput}
                    onPressDown={nextInput}
                    inputRef={(input: any) => putInputRef(input)}
                    textTitle={translate('post.new_post_type')}
                    arrData={postType}
                    contentDropdownStyle={styles.contentDropdownStyle}
                    containerStyle={styles.dropdownContainer}
                    textStyle={styles.textStyle}
                    selected={typeSelected > 0 ? typeSelected : 0}
                    lineBottom={true}
                    onChangeDropDown={(object) => {
                      onChangeDropdown(object, setFieldValue, 'type');
                    }}
                  />
                  <ErrorMessage errorValue={touched.type && errors.type} />
                  <View style={styles.priceContainer}>
                    {/* PRICE */}
                    <CustomInput
                      inputRef={(input: any) => putInputRef(input)}
                      description={`${translate('post.new_post_price')}: `}
                      currentInputIndex={currentInputIndex}
                      onChangeText={(field: string) => setValues({ ...values, price: field })}
                      autoCapitalize="none"
                      keyboardType="number-pad"
                      returnKeyType="next"
                      value={values.price}
                      onFocus={() => onFocus(2)}
                      onBlur={handleBlur('price')}
                      componentContainer={styles.priceInput}
                    />

                    {/* CURRENCY */}
                    <CustomDropdownSelect
                      onFocus={() => onFocus(3)}
                      numberOfInput={inputNumb}
                      currentInputIndex={currentInputIndex}
                      onPressUp={previousInput}
                      onPressDown={nextInput}
                      inputRef={(input: any) => putInputRef(input)}
                      arrData={currency}
                      contentDropdownStyle={styles.contentCurrencyDropdown}
                      containerStyle={styles.currencyBounds}
                      textStyle={styles.textCurrencyStyle}
                      selected={currencySelected > 0 ? currencySelected : 0}
                      containerMainStyle={styles.currencyContainer}
                      lineBottom={true}
                      onChangeDropDown={(object) => {
                        // handleChange('currency');
                        onChangeDropdown(object, setFieldValue, 'currency');
                      }}
                    />
                    {values.type === postType[1]._key ? (
                      <>
                        <CustomText styleContainer={styles.permonthContainer} text={'/'} />
                        <CustomDropdownSelect
                          onFocus={() => onFocus(4)}
                          numberOfInput={inputNumb}
                          currentInputIndex={currentInputIndex}
                          onPressUp={previousInput}
                          onPressDown={nextInput}
                          inputRef={(input: any) => putInputRef(input)}
                          arrData={pers}
                          contentDropdownStyle={styles.contentPerDropdown}
                          containerStyle={styles.perBounds}
                          textStyle={styles.textStyle}
                          selected={perSelected > 0 ? perSelected : 0}
                          containerMainStyle={styles.perContainer}
                          lineBottom={true}
                          onChangeDropDown={(object) => {
                            onChangeDropdown(object, setFieldValue, 'per');
                          }}
                        />
                      </>
                    ) : null}
                  </View>
                  <ErrorMessage errorValue={touched.price && errors.price} />
                  {/* Description */}
                  <CustomInput
                    inputRef={(input: any) => putInputRef(input)}
                    description={`${translate('post.new_post_description')}: `}
                    currentInputIndex={currentInputIndex}
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    onChangeText={(text: string) => {
                      setScrollEnabled(true);
                      setValues({ ...values, descriptions: text });
                    }}
                    value={values.descriptions}
                    multiline={true}
                    onFocus={() => onFocus(5)}
                    onBlur={() => {
                      handleBlur('descriptions');
                      setScrollEnabled(false);
                    }}
                    scrollEnabled={scrollEnabled}
                    moreStyle={styles.descriptionsContainer}
                  />
                  <ErrorMessage errorValue={touched.descriptions && errors.descriptions} />
                  <View style={{ width: '100%' }}>
                    <AddImage
                      description={translate('new_notification.add_image')}
                      onCompletedPickerImage={(imageResponse => { onCompletedPickerImage(imageResponse, setFieldValue); })}
                      images={images.map(item => item.file.uri)}
                    />
                    <CustomFlatList
                      showEmpty={false}
                      horizontal={true}
                      onLoad={onLoadImage}
                      data={images}
                      contentContainerStyle={styles.imagesList}
                      renderItem={(item: any, index: number) => renderItem(item, index, setFieldValue)}
                    />
                    {
                      console.log(errors)}
                    < ErrorMessage errorValue={errors.images as string} />
                  </View>

                </View>
              </View>
            </ScrollView>
            <View style={styles.bottomButtonView}>
              <CustomButton text={translate("post.submit")} style={styles.submitButton} onPress={handleSubmit} />
            </View>
          </View>);
      }}
    </Formik>);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior={'padding'}>
        <Container
          spaceBottom={true}
          title={translate("post.new_post_title_header")}
          isShowHeader={true}
          isDisplayMenuButton={false}
          isDisplayNotification={false}
        >

          {renderHeader()}
          {renderContent()}
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View >
  );
};
export default NewPost;
