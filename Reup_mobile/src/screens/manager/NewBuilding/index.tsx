import React, { useState, useEffect, useRef } from 'react';
import { View, Keyboard, KeyboardAvoidingView, ScrollView, Alert, TouchableWithoutFeedback } from 'react-native';
import styles from './styles';
import Container from '@src/components/Container';
import translate from '@src/localize';
import { ADD_PLUS } from '@src/constants/icons';
import { Formik } from 'formik';
import { of, combineLatest, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect/index';
import CustomInput from '@src/components/CustomInput';
import { CustomButton } from '@src/components/CustomButton';
import CustomAccessory from '@src/components/CustomAccessory';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { isAndroid, getKeyboardAdvoidStyle } from '@src/utils';
import CustomSectionHeader from '@src/components/CustomSection';
import getStyles from '@src/utils/getStyles';
import { object, string, array } from 'yup';
import ErrorMessage from '@src/components/ErrorMessage';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import AddImage from '@src/components/AddImage';
import { CustomFlatList } from '@src/components/FlatList';
import { clone } from 'lodash';
import AddImageItem from '@src/components/FlatListItem/AddImageItem';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { getListState, getListCountry } from '@src/modules/Config/actions';
import { IState } from '@reup/reup-api-sdk/libs/api/country/model';
import { getListPropertyType, createProperty } from '@src/modules/Company/actions';
import { IPropertyType } from '@reup/reup-api-sdk/libs/api/company/models';
import { CreateCompanyPropertyParams } from '@reup/reup-api-sdk/libs/api/company/property';
import NavigationActionsService from '@src/navigation/navigation';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { uploadImage } from '@src/modules/auth/actions';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import Modal from 'react-native-modal';
import CustomInputSelect from '@src/components/CustomInputSelect';
import CustomPhoneInput from '@src/components/CustomPhoneInput';
import { phoneRegExp } from '@src/utils/validation';
import moment from 'moment';
import { emailRegex } from '@src/constants/regex';
import { useRoute } from '@react-navigation/native';
import { Theme } from '@src/components/Theme';
import { createFormData, ImageUploadModel, ObservebleImageModel } from '@src/utils/image';

let isShowKeyboard = false;
const NewBuilding = () => {
  const route = useRoute();
  const { flatListRef } = route.params as any;
  const [paddingBottom, setPaddingBottom] = useState(0);
  /*Keyboard Accessory define */
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputNumb = 5;
  const inputComponents: any[] = [];
  let newBuildingObservable: any = null;
  const [images, setImages] = useState<ImageUploadModel[]>([]);
  const onLoadImage = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };
  const [countryDropdownList, setCountryDropdownList] = useState<ObjDropdown[]>([]);
  const [stateDropdownList, setStateDropdownList] = useState<ObjDropdown[]>([]);
  const [propertyTypeDropdownList, setPropertyTypeDropdownList] = useState<ObjDropdown[]>([]);
  const countryList = useSelector<RootState, ICountry[]>((state: RootState) => state.config.listCountry.results);
  const propertyTypeList = useSelector<RootState, IPropertyType[]>((state: RootState) => state.company.listPropertyType);
  const [selectedPropertyType, setSelectedPropertyType] = useState<number>(0);
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [isStateModalVisible, setStateModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);
  const [selectedListState, setSelectedListState] = useState<string[]>([]);
  const telephoneRef = useRef(undefined);

  /*========================== */

  /* KeyBoard Accessory Handle*/
  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

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
    const countriesList: ObjDropdown[] = [];
    countryList.forEach((item) => {
      const obj: ObjDropdown = {
        _key: item.id + "",
        _value: item.name,
      };
      countriesList.push(obj);
    });
    setCountryDropdownList(countriesList);
  }, [countryList]);

  const fetchListPropertyType = () => {
    dispatch(
      getListPropertyType({
        onSuccess: (data) => {
          console.log("===== Success property type data: ", data);
        },
        onFail: error => {
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  useEffect(() => {
    fetchListPropertyType();
    Keyboard.addListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
    Keyboard.addListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    isShowKeyboard = false;
    return () => {
      if (newBuildingObservable) {
        newBuildingObservable.unsubscribe();
      }
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    };
  }, []);

  useEffect(() => {
    const propertyTypes: ObjDropdown[] = [{ _key: '', _value: "Please choose..." }];
    propertyTypeList.forEach((item) => {
      const obj: ObjDropdown = {
        _key: item.id + "",
        _value: item.title,
      };
      propertyTypes.push(obj);
    });
    setPropertyTypeDropdownList(propertyTypes);
  }, [propertyTypeList]);

  const fetchListState = (countryId: string, setFieldValue: any) => {
    if (countryId !== "") {
      NavigationActionsService.showLoading();
      dispatch(
        getListState({
          countryId,
          onSuccess: (data) => {
            console.log("===== Success state data: ", data);
            const stateList: ObjDropdown[] = [];
            data && data.results.forEach((item: IState) => {
              const obj: ObjDropdown = {
                _key: item.id + "",
                _value: item.name,
              };
              stateList.push(obj);
            });
            NavigationActionsService.hideLoading();
            setStateDropdownList(stateList);
            setFieldValue("state", "");

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
  };

  const onChangeDropdownCategory = (obj: ObjDropdown, setFieldValue: any, key: string) => {
    if (obj._key) {
      setFieldValue(key, obj._key);
      return;
    }
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
  /*=============== */

  const onFocus = (index: number) => {
    setCurrentInputIndex(index);
  };

  const onRemoveImage = (index: number, setFieldValue: any) => {
    const cloneData = clone(images);
    cloneData.splice(index, 1);
    setImages(cloneData);
    setFieldValue('images', cloneData);
  };

  const renderHeaderTitle = () => (
    <CustomSectionHeader
      styleIcon={{ tintColor: Theme.new_staff.icon }}
      style={styles.headerTitle}
      title={translate('new_building.create_new_building')}
      icon={ADD_PLUS}
    />
  );

  const renderItem = (item: ImageUploadModel, index: number, setFieldValue: any) => {
    return (
      <AddImageItem
        item={item.file.uri}
        index={index}
        deleteOnpress={(index => { onRemoveImage(index, setFieldValue); })} />
    );
  };

  //***********************FORMIK***********************

  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const validateNoState = object().shape({
    name: string()
      .trim()
      .required(`${translate('new_building.building_name')} ${translate('error.required')}!`)
      .min(3, `${translate('new_building.building_name')} ${translate('error.too_short')}!`),
    address: string()
      .required(`${translate('new_building.building_address')} ${translate('error.required')}`),
    propertyType: string()
      .trim()
      .required(`${translate('new_building.property_type')} ${translate('error.required')}`),
    country: string()
      .trim()
      .required(`${translate('new_building.country')} ${translate('error.required')}`),
    state: string()
      .trim(),
    email: string()
      .trim()
      .required(translate('authentication.registered_email'))
      .test(
        "email",
        translate("authentication.valid_email"),
        value => {
          if (validateEmail(value)) {
            return true;
          }
          return false;
        }
      ),
    phone: string()
      .trim()
      .matches(phoneRegExp, `${translate('error_validate_field.phone_number_not_valid')}`)
      .required(`${translate('new_building.phone')} ${translate('error.required')}`),
    phoneFake: string()
      .trim(),
    images: array()
      .min(1, `${translate('post.new_post_images')} ${translate('error.required')}`)
  });

  const validateRequiredState = object().shape({
    name: string()
      .trim()
      .required(`${translate('new_building.building_name')} ${translate('error.required')}!`)
      .min(3, `${translate('new_building.building_name')} ${translate('error.too_short')}!`),
    address: string()
      .required(`${translate('new_building.building_address')} ${translate('error.required')}`),
    propertyType: string()
      .trim()
      .required(`${translate('new_building.property_type')} ${translate('error.required')}`),
    country: string()
      .trim()
      .required(`${translate('new_building.country')} ${translate('error.required')}`),
    state: string()
      .trim()
      .required(`${translate('new_building.state')} ${translate('error.required')}`),
    email: string()
      .trim()
      .required(translate('authentication.registered_email'))
      .test(
        "email",
        translate("authentication.valid_email"),
        value => {
          if (validateEmail(value)) {
            return true;
          }
          return false;
        }
      ),
    phone: string()
      .trim()
      .matches(phoneRegExp, `${translate('error_validate_field.phone_number_not_valid')}`)
      .required(`${translate('new_building.phone_valid')}`),
    phoneFake: string()
      .trim(),
    images: array()
      .min(1, `${translate('post.new_post_images')} ${translate('error.required')}`)
  });

  const validationSchema = stateDropdownList.length > 0 ? validateRequiredState : validateNoState;

  const initialValue = {
    name: '',
    propertyType: '',
    country: '',
    state: '',
    address: '',
    email: '',
    phone: '',
    images: images,
    phoneFake: '',
    phoneCode: '',
  };

  const onCreateBuilding = (values: any) => {
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
    newBuildingObservable = of(source$).pipe(
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
        onSubmitData(response.map(item => item.url) as string[], values);
      })
    ).subscribe();
  };

  const onSubmitData = (responseUrls: string[], values: any) => {
    const params: CreateCompanyPropertyParams = stateDropdownList.length > 1 ? {
      name: values.name,
      address: values.address,
      country: Number(values.country),
      state: Number(values.state),
      type: values.propertyType,
      email: values.email,
      phone: values.phone,
      image_urls: responseUrls,
      phone_code: values.phoneCode,
    } : {
        name: values.name,
        address: values.address,
        country: Number(values.country),
        type: values.propertyType,
        email: values.email,
        phone: values.phone,
        image_urls: responseUrls,
        phone_code: values.phoneCode,
      };

    if (me && me.default_company) {
      dispatch(createProperty({
        companyId: me.default_company.id,
        params: params,
        onSuccess: () => {
          NavigationActionsService.hideLoading();
          flatListRef && flatListRef.current && flatListRef.current.reloadData();
          fetchListCountry();
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
      }
      ));
    }
  };

  const fetchListCountry = () => {
    dispatch(getListCountry({
      onSuccess: (data) => {
        console.log("===== Success country data: ", data);
      },
      onFail: error => {
        console.log('Error', error && error.message);
      }
    }));
  };

  const onCompletedPickerImage = (imageResponse: any, setFieldValue: any) => {
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
              completed: true
            });
          },
        }),
      );
    });
  };
  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onOpenStateModal = () => {
    setStateModalVisible(true);
  };

  const onCloseStateModal = () => {
    setStateModalVisible(false);
  };

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);
    setSelectedListCountry(selectedList);

    if (selectedList !== []) {
      if (selectedList.length === 1) {
        countryDropdownList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
            setFieldValue('state', '');
            fetchListState(element._key, setFieldValue);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const onSelectStateDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setStateModalVisible(false);
    setSelectedListState(selectedList);

    if (selectedList !== []) {
      if (selectedList.length === 1) {
        stateDropdownList.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            setFieldValue(key, element._key);
          }
        });
      }
    } else {
      setFieldValue(key, "");
    }
  };

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  //========================================================================

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

  const renderModalState = (setFieldValue: any) => {
    return <Modal
      key={'state'}
      hideModalContentWhileAnimating
      isVisible={isStateModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseStateModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={stateDropdownList}
        selectedList={selectedListState}
        onCloseModal={onCloseStateModal}
        onDone={(selectedList: string[]) => {
          onSelectStateDone(selectedList, setFieldValue, 'state');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderFields = () => {
    return (
      <Formik initialValues={initialValue} onSubmit={onCreateBuilding} validationSchema={validationSchema}>
        {({ values, touched, handleChange, setFieldValue, setValues, errors, handleSubmit, handleBlur }) => {
          return (
            <View style={[styles.containerInput, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.containerScrollView}>
                <View style={[styles.content]}>
                  {/* BUILDING NAME */}
                  <CustomInput
                    onChangeText={handleChange('name')}
                    value={values.name}
                    onFocus={() => onFocus(0)}
                    inputRef={(input: any) => putInputRef(input)}
                    description={translate('new_building.building_name')}
                    componentContainer={{ marginTop: 25 }}
                    onBlur={handleBlur('name')}
                  />
                  <ErrorMessage errorValue={touched.name && errors.name} />

                  {/* BUILDING ADDRESS */}
                  <CustomInput
                    onChangeText={handleChange('address')}
                    value={values.address}
                    onFocus={() => onFocus(1)}
                    inputRef={(input: any) => putInputRef(input)}
                    description={translate('new_building.building_address')}
                    onBlur={handleBlur('address')}
                  />
                  <ErrorMessage errorValue={touched.address && errors.address} />

                  {/* PROPERTY TYPE */}
                  <CustomDropdownSelect
                    onFocus={() => onFocus(2)}
                    numberOfInput={inputNumb}
                    currentInputIndex={currentInputIndex}
                    onPressUp={previousInput}
                    onPressDown={nextInput}
                    containerMainStyle={styles.dropdownWrapper}
                    inputRef={(input: any) => putInputRef(input)}
                    textTitle={translate('new_building.property_type')}
                    arrData={propertyTypeDropdownList}
                    contentDropdownStyle={styles.contentDropdownStyle}
                    containerStyle={styles.dropdownContainer}
                    textStyle={styles.textStyle}
                    iconRightStyle={styles.arrowImage}
                    selected={selectedPropertyType}
                    lineBottom={true}
                    onChangeDropDown={(object) => {
                      setSelectedPropertyType(propertyTypeDropdownList.findIndex(item => item._key === object._key));
                      onChangeDropdownCategory(object, setFieldValue, 'propertyType');
                      handleBlur('propertyType'); handleChange('propertyType');
                    }}
                  />
                  <ErrorMessage errorValue={touched.propertyType && errors.propertyType} />

                  {/* COUNTRY */}
                  {renderModalCountry(setFieldValue)}
                  <CustomInputSelect
                    description={translate('new_building.country')}
                    text={values.country ? setTextFromKey(countryDropdownList, selectedListCountry) : 'Please choose...'}
                    onPress={onOpenCountryModal}
                  />
                  <ErrorMessage errorValue={touched.country && errors.country} />

                  {/* STATE */}
                  {renderModalState(setFieldValue)}
                  <CustomInputSelect
                    description={translate('new_building.state')}
                    text={values.state ? setTextFromKey(stateDropdownList, selectedListState) : 'Please choose...'}
                    onPress={onOpenStateModal}
                  />
                  <ErrorMessage errorValue={touched.state && errors.state} />

                  {/* EMAIL */}
                  <CustomInput
                    onChangeText={handleChange('email')}
                    value={values.email}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => onFocus(3)}
                    inputRef={(input: any) => putInputRef(input)}
                    description={translate('staff.email')}
                    keyboardType="email-address"
                    onSubmitEditing={handleSubmit}
                    onBlur={handleBlur('email')}
                  />
                  <ErrorMessage errorValue={touched.email && errors.email} />

                  {/* PHONE */}
                  <CustomPhoneInput
                    inputRef={(input: any) => {
                      telephoneRef.current = input;
                      putInputRef(input);
                    }}
                    description={translate('new_building.phone')}
                    onFocus={() => onFocus(4)}
                    onChangePhoneNumber={(phoneFake: string, phone: string, phoneCode: string) => {
                      setValues({ ...values, phoneFake, phone, phoneCode });
                    }}
                    inputStyle={styles.inputStyle}
                    value={values.phoneFake}
                    onBlur={handleBlur('phone')}
                  />
                  <ErrorMessage errorValue={touched.phone && errors.phone} />

                  <View style={{ width: '100%' }}>
                    <AddImage
                      description={translate('new_notification.add_image')}
                      onCompletedPickerImage={
                        (imageResponse => { onCompletedPickerImage(imageResponse, setFieldValue); })
                      }
                      images={images.map(item => item.file.uri)}
                      numberOfImage={1}
                    />
                    <CustomFlatList
                      horizontal={true}
                      onLoad={onLoadImage}
                      data={images}
                      showEmpty={false}
                      contentContainerStyle={styles.imagesList}
                      renderItem={(item: any, index: number) => renderItem(item, index, setFieldValue)}
                    />
                    < ErrorMessage errorValue={errors.images as string} />
                  </View>
                </View>
              </ScrollView>
              <View style={styles.buttonContainer}>
                <CustomButton
                  onPress={handleSubmit}
                  textStyle={styles.buttonText}
                  text={translate('new_building.submit')}
                  style={styles.button}
                />
              </View>
            </View>
          );
        }}
      </Formik>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Container
          spaceBottom={true}
          title={translate('new_building.new_building')}
          isShowHeader={true}
          isDisplayNotification={false}
          isDisplayMenuButton={false}
        >
          <View style={styles.container}>
            {renderHeaderTitle()}
            {renderFields()}
          </View>
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View>
  );
};

export default React.memo(NewBuilding);
