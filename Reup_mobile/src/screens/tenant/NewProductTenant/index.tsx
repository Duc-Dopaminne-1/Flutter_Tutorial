import Container from "@src/components/Container";
import styles from "./styles";
import translate from "@src/localize";
import React, { useEffect, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { formatCurrency, formatText, getApartmentName, getKeyboardAdvoidStyle, isAndroid } from "@src/utils";
import getStyles from "@src/utils/getStyles";
import CustomAccessory from "@src/components/CustomAccessory";
import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
import CustomSectionHeader from "@src/components/CustomSection";
import { ADD_PLUS } from "@src/constants/icons";
import { Formik } from "formik";
import { array, number, object, string } from "yup";
import { ObjDropdown } from "@src/components/Dropdown/DropdownNative";
import { createFormData, ImageUploadModel, ObservebleImageModel } from "@src/utils/image";
import { CustomButton } from "@src/components/CustomButton";
import CustomInput from "@src/components/CustomInput";
import ErrorMessage from "@src/components/ErrorMessage";
import { CustomDropdownSelect } from "@src/components/CustomDropdownSelect";
import { ICompanyUnit } from "@reup/reup-api-sdk/libs/api/company/unit/model";
import { useDispatch, useSelector } from "react-redux";
import { getUnitListMe } from "@src/modules/Units/actions";
import { LimitLoadMore } from "@src/constants/vars";
import NavigationActionsService from "@src/navigation/navigation";
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from "@src/components/CustomSelect";
import CustomInputSelect from "@src/components/CustomInputSelect";
import { uploadImage } from "@src/modules/auth/actions";
import { combineLatest, from, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import AddImage from "@src/components/AddImage";
import moment from "moment";
import { clone } from "lodash";
import { CustomFlatList } from "@src/components/FlatList";
import AddImageItem from "@src/components/FlatListItem/AddImageItem";
import { IProductCategoryGetResponse, IProductRequestParams } from "@reup/reup-api-sdk/libs/api/resident/shopping_store/models";
import { RootState } from "@src/types/types";
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models";
import { createResidentShoppingProduct, getListResidentProductCategory } from "@src/modules/shopping_store/action";
import { useRoute } from "@react-navigation/native";
import { CurrencyList } from "@reup/reup-api-sdk/libs/api/enum";
import { Config } from "@src/configs/appConfig";

interface Props {

}

const NewProductTenant = (props: Props) => {
  const route = useRoute();
  const { flatListMyShopRef } = route.params as any;
  const dispatch = useDispatch();
  const default_choose = translate('new_product.please_choose');
  let newProductObservable: any = null;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultPropertyId = me && me.default_property;

  const currency: ObjDropdown[] = [
    { _key: '', _value: default_choose },
    { _key: CurrencyList.Usd, _value: CurrencyList.Usd },
    { _key: CurrencyList.Vnd, _value: CurrencyList.Vnd },
  ];

  const [images, setImages] = useState<ImageUploadModel[]>([]);

  const [isCategoryModalVisible, setCategoryModalVisible] = useState<boolean>(false);
  const [selectedListCategory, setSelectedListCategory] = useState<string[]>([]);
  const [category, setCategory] = useState<ObjDropdown[]>([]);

  useEffect(() => {
    fetchListResidentProductCategory();
  }, []);

  const fetchListResidentProductCategory = () => {
    if (!defaultPropertyId) {
      return;
    }
    NavigationActionsService.showLoading();
    dispatch(
      getListResidentProductCategory({
        propertyId: defaultPropertyId,
        page: 1,
        limit: Config.Tenant.limitGetAll,
        onSuccess: data => {
          NavigationActionsService.hideLoading();
          const mapData = data && data.results && data.results.map((item: IProductCategoryGetResponse) => ({
            _key: item.id ? item.id + "" : '',
            _value: item.name,
          }));
          setCategory(mapData);
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const inputComponents: any[] = [];
  const numberOfInput = 4;
  let isShowKeyboard = false;

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
      newProductObservable && newProductObservable.unsubscribe();
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

  const initialValues = {
    product_name: '',
    category: '',
    price: 0,
    currency: '',
    description: '',
    images: images
  };

  const validationSchema = object().shape({
    product_name: string()
      .trim()
      .required(`${translate('new_product.input_product_name')} ${translate('error.required')}`),
    category: string()
      .trim()
      .required(`${translate('new_product.input_category')} ${translate('error.required')}`),
    price: number()
      .test(
        'price',
        `${translate('new_product.input_price')} ${translate('error.required')}`,
        value => {
          return value > 0;
        }
      ),
    currency: string()
      .trim()
      .required(`${translate('new_product.input_currency')} ${translate('error.required')}`),
    description: string()
      .trim()
      .required(`${translate('new_product.input_description')} ${translate('error.required')}`),
    images: array()
      .min(1, `${translate('new_product.input_images')} ${translate('error.required')}`)
  });

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : 'Please Choose';
  };

  const onChangeDropdown = (obj: ObjDropdown, setFieldValue: any, key: string) => {
    if (obj._key) {
      setFieldValue(key, obj._key);
      return;
    }
    setFieldValue(key, '');
  };

  const onLoad = () => { };

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

  const onRemoveImage = (index: number, setFieldValue: any) => {
    const cloneData = clone(images);
    cloneData.splice(index, 1);
    setImages(cloneData);
    setFieldValue('images', cloneData);
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

  const onNewProductTenant = (responseUrls: string[], values: any) => {
    const params: IProductRequestParams = {
      property_id: defaultPropertyId,
      name: values.product_name,
      price: values.price,
      currency: values.currency,
      description: values.description,
      image_urls: responseUrls,
      thumbnail: responseUrls[0],
      category: values.category
    };
    NavigationActionsService.showLoading();
    dispatch(
      createResidentShoppingProduct({
        propertyId: defaultPropertyId,
        params,
        onSuccess: data => {
          flatListMyShopRef && flatListMyShopRef.current && flatListMyShopRef.current.reloadData();
          NavigationActionsService.hideLoading();
          NavigationActionsService.pop();
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

  const onSubmit = (values: any) => {
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
    newProductObservable = of(source$).pipe(
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
        onNewProductTenant(response.map(item => item.url) as string[], values);
      })
    ).subscribe();
  };

  const renderInputProductName = (formikProps: any) => {
    const { values, handleBlur, touched, errors, handleChange } = formikProps;
    return (
      <>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={translate('new_product.input_product_name')} x
          onChangeText={handleChange('product_name')}
          returnKeyType="next"
          value={values.product_name}
          onFocus={() => setCurrentInputIndex(0)}
          onBlur={handleBlur('product_name')}
          componentContainer={styles.containerInputProductName}
        />
        <ErrorMessage errorValue={touched.product_name && errors.product_name} />
      </>
    );
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
        category.map((element: ObjDropdown) => {
          if (element._key === selectedList[0]) {
            onChangeDropdown(element, setFieldValue, key);
          }
        });
      }
    } else {
      setFieldValue(key, '');
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
        checkListData={category}
        selectedList={selectedListCategory}
        onCloseModal={onCloseCategoryModal}
        onDone={(selectedList: string[]) => {
          onSelectCategoryDone(selectedList, setFieldValue, 'category');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderInputCategory = (formikProps: any) => {
    const { setFieldValue, values, touched, errors } = formikProps;
    const text = (values.category && category.length > 0) ?
      setTextFromKey(category, selectedListCategory)
      : default_choose;
    return (
      <>
        {renderModalCategory(setFieldValue)}
        <CustomInputSelect
          description={translate('new_product.input_category')}
          text={text}
          onPress={onOpenCategoryModal}
        />
        <ErrorMessage errorValue={touched.category && errors.category} />
      </>
    );
  };

  const renderInputPrice = (formikProps: any) => {
    const { values, handleBlur, touched, errors, setFieldValue } = formikProps;
    const value = formatCurrency(values.price ? values.price : 0).replace('$', '');
    return (
      <>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={translate('new_product.input_price')}
          onChangeText={(text: string) =>
            setFieldValue('price', parseInt(formatText(text)))
          }
          returnKeyType="next"
          value={value}
          onFocus={() => setCurrentInputIndex(1)}
          onBlur={handleBlur('price')}
          keyboardType="number-pad"
          maxLength={14}
        />
        <ErrorMessage errorValue={touched.price && errors.price} />
      </>
    );
  };

  const renderInputCurrency = (formikProps: any) => {
    const { values, errors, setValues, touched } = formikProps;
    const currencySelected = currency.findIndex(item => item._key === values.currency);
    return (
      <>
        <CustomDropdownSelect
          numberOfInput={numberOfInput}
          currentInputIndex={currentInputIndex}
          containerStyle={styles.dropdownCurrency}
          inputRef={(input: any) => { putInputRef(input); }}
          textTitle={translate("new_product.input_currency")}
          onFocus={() => setCurrentInputIndex(2)}
          arrData={currency}
          onPressDown={nextInput}
          onPressUp={previousInput}
          selected={currencySelected > 0 ? currencySelected : 0}
          onChangeDropDown={(obj: ObjDropdown) => {
            setValues({ ...values, currency: obj._key });
          }}
        />
        <ErrorMessage errorValue={touched.currency && errors.currency} style={styles.errorMessage} />
      </>
    );
  };

  const renderInputDescription = (formikProps: any) => {
    const { values, setValues, handleBlur, touched, errors } = formikProps;
    return (
      <>
        <CustomInput
          inputRef={(input: any) => putInputRef(input)}
          description={translate('new_product.input_description')}
          onChangeText={(text: string) => {
            setValues({ ...values, description: text });
            setScrollEnabled(true);
          }}
          returnKeyType="next"
          value={values.description}
          onFocus={() => setCurrentInputIndex(3)}
          onBlur={() => {
            handleBlur('description');
            setScrollEnabled(false);
          }}
          moreStyle={styles.description}
          multiline={true}
          scrollEnabled={scrollEnabled}
        />
        <ErrorMessage errorValue={touched.description && errors.description} />
      </>
    );
  };

  const _renderItem = (item: ImageUploadModel, index: number, setFieldValue: any) => {
    return (
      <AddImageItem
        item={item.file.uri}
        index={index}
        deleteOnpress={(index => { onRemoveImage(index, setFieldValue); })} />
    );
  };

  const renderAddImages = (formikProps: any) => {
    const { setFieldValue, errors } = formikProps;
    return (
      <>
        <AddImage
          images={images.map(item => item.file.uri)}
          description={translate('new_product.input_images')}
          onCompletedPickerImage={imageResponse => {
            onCompletedPickerImage(imageResponse, setFieldValue);
          }}
        />
        <CustomFlatList
          horizontal={true}
          onLoad={onLoad}
          showEmpty={false}
          data={images}
          contentContainerStyle={styles.imagesList}
          renderItem={(item: any, index: number) => _renderItem(item, index, setFieldValue)}
        />
        < ErrorMessage errorValue={errors.images} />
      </>
    );
  };

  const renderSubmitBtn = (formikProps: any) => {
    return (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={formikProps.handleSubmit}
          text={translate('new_product.submit')}
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
              <ScrollView style={styles.containerScrollView} contentContainerStyle={styles.contentContainerScrollView}>
                {renderInputProductName(formikProps)}
                {renderInputCategory(formikProps)}
                {renderInputPrice(formikProps)}
                {renderInputCurrency(formikProps)}
                {renderInputDescription(formikProps)}
                {renderAddImages(formikProps)}
              </ScrollView>
              {renderSubmitBtn(formikProps)}
            </View>
          );
        }}
      </Formik>
    );
  };

  const renderHeader = () => {
    return (
      <CustomSectionHeader
        title={translate('new_product.title_section_header')}
        icon={ADD_PLUS}
        styleIcon={styles.iconSectionHeader}
        style={styles.sectionHeader}
      />
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

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior={'padding'}>
        <Container
          spaceBottom={true}
          title={translate('new_product.title')}
          isShowHeader={true}
          isDisplayMenuButton={false}
          isDisplayNotification={false}
        >
          {renderHeader()}
          {renderInputFields()}
        </Container>
      </KeyboardAvoidingView>
      {renderKeyboardAccessory()}
    </View>
  );
};

export default NewProductTenant;
