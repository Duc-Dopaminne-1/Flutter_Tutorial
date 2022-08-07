import React, { useState, useEffect } from 'react';
import {
  View, KeyboardAvoidingView,
  Keyboard, ScrollView, Alert,
  TouchableWithoutFeedback
} from 'react-native';
import Container from '@src/components/Container';
import translate from '@src/localize';
import getStyles from '@src/utils/getStyles';
import { of, combineLatest, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { getKeyboardAdvoidStyle, isAndroid } from '@src/utils';
import { Formik } from 'formik';
import { object, string, array } from 'yup';
import CustomSectionHeader from '@src/components/CustomSection';
import { ADD_PLUS } from '@src/constants/icons';
import styles from './styles';
//@ts-ignore
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { LimitGetAll } from '@src/constants/vars';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import AddImage from '@src/components/AddImage';
import { CustomFlatList } from '@src/components/FlatList';
import { clone } from 'lodash';
import AddImageItem from '@src/components/FlatListItem/AddImageItem';
import { CustomButton } from '@src/components/CustomButton';
import CustomAccessory from '@src/components/CustomAccessory';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import NavigationActionsService from '@src/navigation/navigation';
import { uploadImage } from '@src/modules/auth/actions';
import { createApartment, getListProperty } from '@src/modules/Company/actions';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { ICompany } from '@reup/reup-api-sdk/libs/api/company/models';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import { createFormData, ImageUploadModel, ObservebleImageModel } from '@src/utils/image';

let isShowKeyboard = false;

const NewApartment = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  let newApartmentObservable: any = null;
  const { flatList } = route.params as { flatList: any };
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const myCountryList = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const companyList = useSelector<RootState, ICompany[]>((state: RootState) => state.company.listCompany.results);
  const defaultCompany = companyList.find(item => item.id === me.default_company.id);
  const companyId = defaultCompany ? defaultCompany.id : '';
  const [images, setImages] = useState<ImageUploadModel[]>([]);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];
  const numberOfInput = 7;
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
  const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [selectedListCountry, setSelectedListCountry] = useState<string[]>([]);
  const [isBuildingModalVisible, setBuildingModalVisible] = useState<boolean>(false);
  const [selectedListBuilding, setSelectedListBuilding] = useState<string[]>([]);

  const countriesList: ObjDropdown[] = [
    ...myCountryList.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item.name,
    }))
  ];

  const [property, setProperty] = useState<ICompanyProperty[]>([]);
  const propertyList: ObjDropdown[] = [
    ...property.map(item => ({
      _key: item.id ? item.id + "" : '',
      _value: item.name,
    }))
  ];

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
      if (newApartmentObservable) {
        newApartmentObservable.unsubscribe();
      }
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    };
  }, []);

  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

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

  const initialValues = {
    country: '',
    building: '',
    block: '',
    floor: '',
    apartmentCode: '',
    square: '',
    bedroom: '',
    bathroom: '',
    description: '',
    images: images,
  };

  const validationSchema = object().shape({
    country: string()
      .trim()
      .required(`${translate('new_apartment.country')} ${translate('error.required')}`),
    building: string()
      .trim()
      .required(`${translate('new_apartment.building')} ${translate('error.required')}`),
    block: string()
      .trim()
      .required(`${translate('new_apartment.block')} ${translate('error.required')}`),
    floor: string()
      .trim()
      .required(`${translate('new_apartment.floor')} ${translate('error.required')}`),
    apartmentCode: string()
      .trim()
      .required(`${translate('new_apartment.apartment_code')} ${translate('error.required')}`),
    square: string()
      .trim()
      .required(`${translate('new_apartment.square_require')} ${translate('error.required')}`),
    bedroom: string()
      .trim()
      .required(`${translate('new_apartment.bedroom')} ${translate('error.required')}`),
    bathroom: string()
      .trim()
      .required(`${translate('new_apartment.bathroom')} ${translate('error.required')}`),
    description: string()
      .trim()
      .required(`${translate('new_apartment.description')} ${translate('error.required')}`),
    images: array()
      .min(1, `${translate('new_apartment.images')} ${translate('error.required')}`)
  });

  const onNewApartment = (values: any) => {
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
    newApartmentObservable = of(source$).pipe(
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

  const onSubmitData = (responseUrls: string[], values: any,) => {
    Keyboard.dismiss();
    const params = {
      property_id: values.building,
      code: values.apartmentCode,
      block: values.block,
      floor: values.floor,
      bedroom: parseInt(values.bedroom),
      restroom: parseInt(values.bathroom),
      square: values.square,
      descriptions: values.description,
      image_urls: responseUrls
    };
    dispatch(
      createApartment({
        companyId,
        params,
        onSuccess: (data) => {
          NavigationActionsService.hideLoading();
          flatList && flatList.current && flatList.current.reloadData();
          NavigationActionsService.pop();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
      })
    );
  };



  const onRemoveImage = (index: number, setFieldValue: any) => {
    const cloneData = clone(images);
    cloneData.splice(index, 1);
    setImages(cloneData);
    setFieldValue('images', cloneData);
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
              completed: false
            });
          },
        }),
      );
    });
  };

  const onLoadImage = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  const onSelectCountryDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setCountryModalVisible(false);
    setSelectedListCountry(selectedList);
    if (selectedList.length > 0) {
      if (selectedList.length === 1) {
        countriesList.map((element: ObjDropdown) => {
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

  const onOpenCountryModal = () => {
    setCountryModalVisible(true);
  };

  const onCloseCountryModal = () => {
    setCountryModalVisible(false);
  };

  // Render - Building
  const onSelectBuildingDone = (selectedList: string[], setFieldValue: any, key: string) => {
    setBuildingModalVisible(false);
    setSelectedListBuilding(selectedList);
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

  const onOpenBuildingModal = () => {
    setBuildingModalVisible(true);
  };

  const onCloseBuildingModal = () => {
    setBuildingModalVisible(false);
  };

  const renderItem = (item: ImageUploadModel, index: number, setFieldValue: any) => {
    return (
      <AddImageItem
        item={item.file.uri}
        index={index}
        deleteOnpress={(index => { onRemoveImage(index, setFieldValue); })} />
    );
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

  const renderHeader = () => {
    return (
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate('new_apartment.header_title')}
        icon={ADD_PLUS}
        styleIcon={styles.sectionHeaderIcon}
      />
    );
  };

  const renderCountry = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
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
            checkListData={countriesList}
            selectedList={selectedListCountry}
            onCloseModal={onCloseCountryModal}
            onDone={(selectedList: string[]) => {
              onSelectCountryDone(selectedList, formikProps.setFieldValue, 'country');
              formikProps.handleBlur('country');
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('new_apartment.country')}
          text={formikProps.values.country ? setTextFromKey(countriesList, selectedListCountry) : 'Please choose'}
          onPress={onOpenCountryModal}
        />
        <ErrorMessage errorValue={formikProps.touched.country && formikProps.errors.country} />
      </View>
    );
  };

  const renderBuilding = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
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
            checkListData={propertyList}
            selectedList={selectedListBuilding}
            onCloseModal={onCloseBuildingModal}
            onDone={(selectedList: string[]) => {
              onSelectBuildingDone(selectedList, formikProps.setFieldValue, 'building');
              formikProps.handleBlur('building');
            }}
            type={CustomSelectType.SingleSelect}
          />
        </Modal>
        <CustomInputSelect
          description={translate('new_apartment.building')}
          text={formikProps.values.building ? setTextFromKey(propertyList, selectedListBuilding) : 'Please choose'}
          onPress={onOpenBuildingModal}
        />
        <ErrorMessage errorValue={formikProps.touched.building && formikProps.errors.building} />
      </View>
    );
  };

  const renderBlockFloor = (formikProps: any) => {
    return (
      <View style={styles.viewRow}>
        <View style={{ flex: 1 }}>
          <CustomInput
            onFocus={() => setCurrentInputIndex(0)}
            inputRef={(input: any) => putInputRef(input)}
            description={translate('new_apartment.block')}
            onChangeText={formikProps.handleChange('block')}
            returnKeyType="next"
            value={formikProps.values.block}
            onBlur={formikProps.handleBlur('block')}
          />
          <ErrorMessage errorValue={formikProps.touched.block && formikProps.errors.block} />
        </View>
        <View style={{ width: 30, }} />
        <View style={{ flex: 1 }}>
          <CustomInput
            onFocus={() => setCurrentInputIndex(1)}
            inputRef={(input: any) => putInputRef(input)}
            description={translate('new_apartment.floor')}
            onChangeText={formikProps.handleChange('floor')}
            returnKeyType="next"
            keyboardType="number-pad"
            value={formikProps.values.floor}
            onBlur={formikProps.handleBlur('floor')}
          />
          <ErrorMessage errorValue={formikProps.touched.floor && formikProps.errors.floor} />
        </View>
      </View>
    );
  };

  const renderApartmentCode = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomInput
          onFocus={() => setCurrentInputIndex(2)}
          inputRef={(input: any) => putInputRef(input)}
          description={translate('new_apartment.apartment_code')}
          onChangeText={formikProps.handleChange('apartmentCode')}
          returnKeyType="next"
          value={formikProps.values.apartmentCode}
          onBlur={formikProps.handleBlur('apartmentCode')}
        />
        <ErrorMessage errorValue={formikProps.touched.apartmentCode && formikProps.errors.apartmentCode} />
      </View>
    );
  };

  const renderSquare = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomInput
          onFocus={() => setCurrentInputIndex(3)}
          inputRef={(input: any) => putInputRef(input)}
          description={translate('new_apartment.square')}
          onChangeText={formikProps.handleChange('square')}
          keyboardType="number-pad"
          value={formikProps.values.square}
          onBlur={formikProps.handleBlur('square')}
        />
        <ErrorMessage errorValue={formikProps.touched.square && formikProps.errors.square} />
      </View>
    );
  };

  const renderRooms = (formikProps: any) => {
    return (
      <View style={styles.viewRow}>
        <View style={{ flex: 1 }}>
          <CustomInput
            onFocus={() => setCurrentInputIndex(4)}
            inputRef={(input: any) => putInputRef(input)}
            description={translate('new_apartment.bedroom')}
            onChangeText={formikProps.handleChange('bedroom')}
            returnKeyType="next"
            keyboardType="number-pad"
            value={formikProps.values.bedroom}
            onBlur={formikProps.handleBlur('bedroom')}
          />
          <ErrorMessage errorValue={formikProps.touched.bedroom && formikProps.errors.bedroom} />
        </View>
        <View style={{ width: 30 }} />
        <View style={{ flex: 1 }}>
          <CustomInput
            onFocus={() => setCurrentInputIndex(5)}
            inputRef={(input: any) => putInputRef(input)}
            description={translate('new_apartment.bathroom')}
            onChangeText={formikProps.handleChange('bathroom')}
            returnKeyType="next"
            keyboardType="number-pad"
            value={formikProps.values.bathroom}
            onBlur={formikProps.handleBlur('bathroom')}
          />
          <ErrorMessage errorValue={formikProps.touched.bathroom && formikProps.errors.bathroom} />
        </View>
      </View>
    );
  };

  const renderDescription = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={`${translate('new_apartment.description')}`}
          onChangeText={(field: string) => {
            formikProps.setValues({ ...formikProps.values, description: field });
            setScrollEnabled(true);
          }}
          returnKeyType="done"
          value={formikProps.values.description}
          onFocus={() => setCurrentInputIndex(6)}
          onBlur={() => {
            formikProps.handleBlur('description');
            setScrollEnabled(false);
          }}
          moreStyle={styles.description}
          multiline={true}
          scrollEnabled={scrollEnabled}
        />
        <ErrorMessage errorValue={formikProps.touched.description && formikProps.errors.description} />
      </View>
    );
  };

  const renderAddImage = (formikProps: any) => {
    return (
      <View style={{ width: '100%' }}>
        <AddImage
          description={translate('new_apartment.add_image')}
          onCompletedPickerImage={(imageResponse => { onCompletedPickerImage(imageResponse, formikProps.setFieldValue); })}
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
        {
          console.log(formikProps.errors)}
        < ErrorMessage errorValue={formikProps.errors.images as string} style={styles.error} />
      </View>
    );
  };
  const renderInputFields = (formikProps: any) => {
    return (
      <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
        <ScrollView style={styles.containerScrollView}>
          <View style={styles.inputFormSubContainer}>
            {renderCountry(formikProps)}
            {renderBuilding(formikProps)}
            {renderBlockFloor(formikProps)}
            {renderApartmentCode(formikProps)}
            {renderSquare(formikProps)}
            {renderRooms(formikProps)}
            {renderDescription(formikProps)}
            {renderAddImage(formikProps)}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomButton onPress={formikProps.handleSubmit} text={translate('new_apartment.submit')} style={styles.button} />
        </View>
      </View>
    );
  };

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
          isDisplayNotification={false}
          isDisplayMenuButton={false}
          title={translate('new_apartment.navigation_title')}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onNewApartment}>
            {formikProps => {
              return (
                <View style={styles.container}>
                  {renderHeader()}
                  {renderInputFields(formikProps)}
                </View>
              );
            }}
          </Formik>
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View>
  );
};

export default React.memo(NewApartment);
