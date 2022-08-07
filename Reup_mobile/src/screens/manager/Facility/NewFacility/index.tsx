import React, { useState, useEffect, useRef } from 'react';
import { View, Keyboard, KeyboardAvoidingView, ScrollView, Alert, TouchableWithoutFeedback } from 'react-native';
import styles from './styles';
import Container from '@src/components/Container';
import translate from '@src/localize';
import { ADD_PLUS } from '@src/constants/icons';
import { Formik } from 'formik';
import { of, combineLatest, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
import { clone, find, filter } from 'lodash';
import AddImageItem from '@src/components/FlatListItem/AddImageItem';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import NavigationActionsService from '@src/navigation/navigation';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { uploadImage } from '@src/modules/auth/actions';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import Modal from 'react-native-modal';
import CustomInputSelect from '@src/components/CustomInputSelect';
import moment from 'moment';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { CreateFacilityParams } from '@reup/reup-api-sdk/libs/api/company/facility';
import { useRoute } from '@react-navigation/native';
import { createFacility } from '@src/modules/FrontDesk/actions';
import { Theme } from '@src/components/Theme';
import { createFormData, ImageUploadModel, ObservebleImageModel } from '@src/utils/image';

let isShowKeyboard = false;
const NewFacility = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  let newFacilityObservable: any = null;
  // DATA DROPDOWN COUNTRIES
  const myCountryList = useSelector<RootState, ObjDropdown[]>((state: RootState) => {
    return state.company.listMyCountry.results.map(obj => {
      return { _key: `${obj.id}`, _value: obj.name }
    })
  });
  const [countries, setCountries] = useState<ObjDropdown[]>(myCountryList);
  // DATA DROPDOWN BUILDINGS
  const buildingList = useSelector<RootState, ICompanyProperty[]>((state: RootState) => state.company.listProperty.results);
  const [buildings, setBuildings] = useState<ObjDropdown[]>([]);

  const [paddingBottom, setPaddingBottom] = useState(0);
  /*Keyboard Accessory define */
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputNumb = 4;
  const inputComponents: any[] = [];
  const [images, setImages] = useState<ImageUploadModel[]>([]);
  const { flatList } = useRoute().params as any;

  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [isBuildingModalVisible, setBuildingModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);
  const [selectedListBuilding, setSelectedListBuilding] = useState<string[]>([]);

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
      if (newFacilityObservable) {
        newFacilityObservable.unsubscribe();
      }
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    };
  }, []);

  const onLoadImage = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };

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
    setFieldValue("images", cloneData);
  };

  const renderHeaderTitle = () => (
    <CustomSectionHeader
      styleIcon={{ tintColor: Theme.new_staff.icon }}
      style={styles.headerTitle}
      title={translate('new_facility.title_section_header')}
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

  const validationSchema = object().shape({
    name: string()
      .trim()
      .required(`${translate('new_facility.facility_name')} ${translate('error.required')}!`)
      .min(3, `${translate('new_facility.facility_name')} ${translate('error.too_short')}!`),
    country: string()
      .trim()
      .required(`${translate('new_facility.country')} ${translate('error.required')}`),
    building: string()
      .trim()
      .required(`${translate('new_facility.building')} ${translate('error.required')}`),
    description: string()
      .trim()
      .required(`${translate('new_facility.description')} ${translate('error.required')}`),
    images: array()
      .min(1, `${translate('new_facility.new_facility_images')} ${translate('error.required')}`)
  });

  const initialValue = {
    name: '',
    country: '',
    building: '',
    description: '',
    images: images,
  };

  const onSubmitData = (responseUrls: string[], values: any) => {
    const params: CreateFacilityParams = {
      name: values.name,
      property: values.building,
      description: values.description,
      image_urls: responseUrls
    }

    dispatch(createFacility({
      companyId: me.default_company.id ?? '',
      params,
      onSuccess: () => {
        NavigationActionsService.hideLoading();
        flatList && flatList.current && flatList.current.reloadData()
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
    ))
  }
  const onCreateBuilding = (values: any) => {
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

    newFacilityObservable = of(source$).pipe(
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
  };

  const onCompletedPickerImage = (imageResponse: any, setFieldValue: any) => {
    const cloneData = clone(images);
    cloneData.push({
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
              completed: false
            });
          },
          onFail: error => {
            resolve({ completed: false });
          },
        }),
      );
    })
  }
  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  const onOpenStateModal = () => {
    setBuildingModalVisible(true);
  };

  const onCloseStateModal = () => {
    setBuildingModalVisible(false);
  };

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);
    setSelectedListCountry(selectedList);

    const objFind = countries && find(countries, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "");
  };

  const handleDataBuilding = (selectedList: string[], setFieldValue: any) => {
    const objFind = countries && find(countries, { _key: selectedList[0] });
    const filterBuilding = buildingList && objFind && filter(buildingList, building => building.country.id == parseInt(objFind._key)).map(obj => {
      return { _key: obj.id, _value: obj.name }
    })
    if (filterBuilding) {
      setBuildings(filterBuilding);
    } else {
      setBuildings([]);
    }
  }

  const onSelectBuildingDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setBuildingModalVisible(false);
    setSelectedListBuilding(selectedList);

    const objFind = buildings && find(buildings, { _key: selectedList[0] });
    objFind ? setFieldValue(key, objFind._key) : setFieldValue(key, "")
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
        checkListData={myCountryList}
        selectedList={selectedListCountry}
        onCloseModal={onCloseCountryModal}
        onDone={(selectedList: string[]) => {
          onSelectCountryDone(selectedList, setFieldValue, 'country');
          handleDataBuilding(selectedList, setFieldValue)
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderModalBuilding = (setFieldValue: any) => {
    return <Modal
      key={'building'}
      hideModalContentWhileAnimating
      isVisible={isBuildingModalVisible}
      useNativeDriver
      customBackdrop={
        <TouchableWithoutFeedback onPress={onCloseStateModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }
    >
      <CustomSelect
        checkListData={buildings}
        selectedList={selectedListBuilding}
        onCloseModal={onCloseStateModal}
        onDone={(selectedList: string[]) => {
          onSelectBuildingDone(selectedList, setFieldValue, 'building');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderFields = () => {
    return (
      <Formik
        initialValues={initialValue}
        onSubmit={(values: any) => onCreateBuilding(values)}
        validationSchema={validationSchema}>
        {({ values, touched, handleChange, setFieldValue, errors, handleSubmit, handleBlur }) => {
          return (
            <View style={[styles.containerInput, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.containerScrollView}>
                <View style={[styles.content]}>
                  {/* FACILITY NAME */}
                  <CustomInput
                    onChangeText={handleChange('name')}
                    value={values.name}
                    onFocus={() => onFocus(0)}
                    inputRef={(input: any) => putInputRef(input)}
                    description={translate('new_facility.facility_name')}
                    componentContainer={{ marginTop: 25 }}
                  />
                  <ErrorMessage errorValue={touched.name && errors.name} />

                  {/* COUNTRY */}
                  {renderModalCountry(setFieldValue)}
                  <CustomInputSelect
                    description={translate('new_facility.country')}
                    text={values.country ? setTextFromKey(countries, selectedListCountry) : 'Please choose...'}
                    onPress={onOpenCountryModal}
                  />
                  <ErrorMessage errorValue={touched.country && errors.country} />

                  {/* BUILDING */}
                  {renderModalBuilding(setFieldValue)}
                  <CustomInputSelect
                    description={translate('new_facility.building')}
                    text={values.building ? setTextFromKey(buildings, selectedListBuilding) : 'Please choose...'}
                    onPress={onOpenStateModal}
                  />
                  <ErrorMessage errorValue={touched.building && errors.building} />

                  {/* DESCRIPTION */}
                  <CustomInput
                    onChangeText={handleChange('description')}
                    value={values.description}
                    onFocus={() => onFocus(0)}
                    inputRef={(input: any) => putInputRef(input)}
                    description={translate('new_facility.description')}
                    moreStyle={styles.description}
                    multiline={true}
                  />
                  <ErrorMessage errorValue={touched.description && errors.description} />

                  {/* ADD IMAGE */}
                  <View style={{ width: '100%' }}>
                    <AddImage
                      description={translate('new_facility.add_image')}
                      onCompletedPickerImage={
                        (imageResponse => { onCompletedPickerImage(imageResponse, setFieldValue); })
                      }
                      images={images.map(item => item.file.uri)}
                      numberOfImage={5}
                    />
                    <CustomFlatList
                      horizontal={true}
                      onLoad={onLoadImage}
                      data={images}
                      contentContainerStyle={styles.imagesList}
                      showEmpty={false}
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
                  text={translate('new_facility.submit_button')}
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
          title={translate('new_facility.title_navigation')}
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

export default React.memo(NewFacility);
