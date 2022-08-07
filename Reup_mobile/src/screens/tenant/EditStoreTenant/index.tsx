import React, { useState, useEffect } from 'react';
import styles from './styles';
import { View, ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from 'react-native';
import { EDIT_PROFILE } from '@src/constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { Formik } from 'formik';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string, array, number, ValidationError } from 'yup';
import { clone, upperCase } from 'lodash';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import getStyles from '@src/utils/getStyles';
import { formatCurrency, formatText, getApartmentName, getKeyboardAdvoidStyle, isAndroid } from '@src/utils';
import { CustomFlatList } from '@src/components/FlatList';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import NavigationActionsService from '@src/navigation/navigation';
import { useRoute } from '@react-navigation/native';
import AddImage from '@src/components/AddImage';
import { uploadImage } from '@src/modules/auth/actions';
import moment from 'moment';
import { CurrencyList } from '@reup/reup-api-sdk/libs/api/enum';
import AddImageItem from '@src/components/FlatListItem/AddImageItem';
import { createFormData, ImageUploadModel, ObservebleImageModel } from '@src/utils/image';
import { combineLatest, from, of } from 'rxjs';
import { map, switchMap, findIndex } from 'rxjs/operators';
import { ICompanyUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { getUnitListMe } from '@src/modules/Units/actions';
import { LimitLoadMore } from '@src/constants/vars';
import { getListProductCategory, updateShoppingProduct } from '@src/modules/shopping_store/action';
import { Config } from '@src/configs/appConfig';
import { IProductCategoryGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';
import { IProductUpdateRequest, IProductGetResponse } from '@reup/reup-api-sdk/libs/api/resident/shopping_store/models';

interface ItemProps {
  product: IProductGetResponse,
  flatList: any,
  wholeStoreList: any
}


let isShowKeyboard = false;
const EditStoreTenant = () => {

  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultProperty = me && me.default_property ? me.default_property : ''
  const route = useRoute();
  const { product, flatList, wholeStoreList } = route.params as ItemProps;
  let editStoreObservable: any = null
  const default_choose = translate('new_product.please_choose')

  const dataCurrency = [
    { _key: '', _value: default_choose },
    { _key: CurrencyList.Usd, _value: 'USD' },
    { _key: CurrencyList.Vnd, _value: 'VND' },
  ];

  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState(0);

  const [isCategoryModalVisible, setCategoryModalVisible] = useState<boolean>(false);
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
  const [categoryDropdownList, setCategoryDropdownList] = useState<ObjDropdown[]>([]);
  const inputComponents: any[] = [];
  const numberOfInput = 4;

  const [images, setImages] = useState<ImageUploadModel[]>(product.image_urls.map(product => ({
    file: {
      uri: product,
    },
    isUploaded: true
  })));

  const infoProduct = {
    product_name: product.name ? product.name : '',
    category: product.category ? product.category.id : '',
    price: product.price ? product.price : '',
    currency: product.currency ? product.currency : '',
    description: product.description ? product.description : '',
    images: product.image_urls ?? images,
  }
  const [selectedListCategory, setSelectedListCategory] = useState<string[]>([infoProduct.category]);

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
      editStoreObservable && editStoreObservable.unsubscribe()
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide)
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow)
    };
  }, []);

  const validationSchema = object().shape({
    product_name: string()
      .trim()
      .required(`${translate('edit_product.product_name')} ${translate('error.required')}`),
    category: string()
      .trim()
      .required(`${translate('edit_product.category')} ${translate('error.required')}`),
    price: number()
      .test(
        'price',
        `${translate('edit_product.price')} ${translate('error.required')}`,
        value => {
          return value > 0
        }
      ),
    currency: string()
      .trim()
      .required(`${translate('edit_product.currency')} ${translate('error.required')}`),
    description: string()
      .trim()
      .required(`${translate('edit_product.description')} ${translate('error.required')}`),
    images: array()
      .min(1, `${translate('edit_product.add_image')} ${translate('error.required')}`)
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

  useEffect(() => {
    fetchListProductCategory()
  }, []);

  const fetchListProductCategory = () => {
    dispatch(
      getListProductCategory({
        isSave: false,
        id: defaultProperty,
        page: 1,
        limit: Config.Manager.limitGetAll,
        onSuccess: data => {
          const mapData = data && data.results && data.results.map((item: IProductCategoryGetResponse) => ({
            _key: item.id ? item.id + "" : '',
            _value: item.name,
          }))
          setCategoryDropdownList(mapData);
        }
      })
    )
  }

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

  const onSubmit = (values: any) => {
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

    editStoreObservable = of(source$).pipe(
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
        onUpdateShoppingProduct(response.map(item => item.url) as string[], values);
      })
    ).subscribe();
  }


  const onUpdateShoppingProduct = (responseUrls: string[], values: any) => {
    Keyboard.dismiss();

    const params: IProductUpdateRequest = {
      name: values.product_name,
      price: values.price,
      currency: values.currency,
      description: values.description,
      image_urls: responseUrls,
      category: values.category
    };

    dispatch(updateShoppingProduct({
      propertyId: defaultProperty,
      id: product.id ?? '',
      params: params,
      onSuccess: (data) => {
        NavigationActionsService.hideLoading();
        flatList && flatList.current && flatList.current.reloadData()
        wholeStoreList && wholeStoreList.current && wholeStoreList.current.reloadData()
        NavigationActionsService.popTo(2)
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }))
  };

  const onChangeDropdownCategory = (obj: ObjDropdown, setFieldValue: any, key: string) => {
    if (obj._key) {
      setFieldValue(key, obj._key);
      return;
    }
    setFieldValue(key, '');
  };

  const onOpenCategoryModal = () => {
    setCategoryModalVisible(true);
  };

  const onCloseCategoryModal = () => {
    setCategoryModalVisible(false);
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

  const onLoadImage = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };

  const onRemoveImage = (index: number, setFieldValue: any) => {
    const cloneData = clone(images);
    cloneData.splice(index, 1);
    setImages(cloneData);
    setFieldValue('images', cloneData);
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

  const setTextFromKey = (dropDownList: ObjDropdown[], listSelected: string[]) => {
    const findIndex = dropDownList.findIndex(item => item._key === listSelected[0]);
    return findIndex != -1 ? dropDownList[dropDownList.findIndex(item => item._key === listSelected[0])]._value : default_choose;
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

  const renderProductName = (formikProps: any) => {
    return <CustomInput
      inputRef={(input: any) => putInputRef(input)}
      description={`${translate('edit_product.product_name')}`}
      onChangeText={
        formikProps.handleChange('product_name')
      }
      returnKeyType="next"
      value={formikProps.values.product_name}
      onFocus={() => setCurrentInputIndex(0)}
      onBlur={formikProps.handleBlur('product_name')}
    />;
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
        onCloseModal={onCloseCategoryModal}
        onDone={(selectedList: string[]) => {
          onSelectCategoryDone(selectedList, setFieldValue, 'category');
        }}
        type={CustomSelectType.SingleSelect}
      />
    </Modal>;
  };

  const renderPrice = (formikProps: any) => {
    const { values, handleBlur, touched, errors, setFieldValue } = formikProps
    const value = formatCurrency(values.price ? values.price : 0).replace('$', '')
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
          componentContainer={styles.containerInputPrice}
          keyboardType="number-pad"
          maxLength={14}
        />
        <ErrorMessage errorValue={touched.price && errors.price} />
      </>
    )
  };

  const renderDescription = (formikProps: any) => {
    return <CustomInput
      inputRef={(input: any) => putInputRef(input)}
      description={`${translate('edit_product.description')}`}
      onChangeText={(field: string) => {
        formikProps.setValues({ ...formikProps.values, description: field.toString() });
        setScrollEnabled(true);
      }}
      returnKeyType="next"
      value={formikProps.values.description}
      onFocus={() => setCurrentInputIndex(3)}
      onBlur={() => {
        formikProps.handleBlur('description');
        setScrollEnabled(false);
      }}
      moreStyle={styles.description}
      multiline={true}
      scrollEnabled={scrollEnabled}
    />;
  };


  const renderCurrency = (formikProps: any) => {

    const selectedCurrencyType = dataCurrency.findIndex(data => data._value == formikProps.values.currency);
    return <View style={{ flex: 1 }}>
      <CustomDropdownSelect
        numberOfInput={numberOfInput}
        currentInputIndex={currentInputIndex}
        arrData={dataCurrency}
        textTitle={`${translate('edit_product.currency')}`}
        lineBottom={false}
        containerStyle={styles.filter}
        selected={selectedCurrencyType}
        onChangeDropDown={(object) => {
          onChangeDropdownCategory(object, formikProps.setFieldValue, 'currency');
          formikProps.handleBlur('currency');
        }}
        inputRef={(input: any) => putInputRef(input)}
        onFocus={() => setCurrentInputIndex(2)}
        onPressDown={nextInput}
        onPressUp={previousInput}
        textStyle={styles.textDropdown}
      />
      <ErrorMessage errorValue={formikProps.touched.currency && formikProps.errors.currency} />
    </View>
  };

  const renderItem = (item: ImageUploadModel, index: number, setFieldValue: any) => {
    return (
      <AddImageItem
        item={item.file.uri}
        index={index}
        deleteOnpress={(index => { onRemoveImage(index, setFieldValue); })} />
    );
  };

  const renderAddImage = (formikProps: any) => {
    const { errors } = formikProps;
    return (
      <View style={{ width: '100%' }}>
        <AddImage
          description={translate('edit_product.add_image')}
          onCompletedPickerImage={
            (imageResponse => { onCompletedPickerImage(imageResponse, formikProps.setFieldValue); })
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
          renderItem={(item: any, index: number) => renderItem(item, index, formikProps.setFieldValue)}
        />
        < ErrorMessage errorValue={errors.images as string} />
      </View>
    );
  };

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={infoProduct}
        onSubmit={onSubmit}
        validationSchema={validationSchema}>
        {formikProps => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>

                {renderProductName(formikProps)}
                <ErrorMessage errorValue={formikProps.touched.product_name && formikProps.errors.product_name} />

                {renderModalCategory(formikProps.setFieldValue)}
                <CustomInputSelect
                  description={translate('edit_product.category')}
                  text={formikProps.values.category ? setTextFromKey(categoryDropdownList, selectedListCategory) : default_choose}
                  onPress={onOpenCategoryModal}
                />
                <ErrorMessage errorValue={formikProps.touched.category && formikProps.errors.category} />

                {renderPrice(formikProps)}

                {renderCurrency(formikProps)}

                {renderDescription(formikProps)}
                <ErrorMessage errorValue={formikProps.touched.description && formikProps.errors.description} />

                {renderAddImage(formikProps)}
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton onPress={formikProps.handleSubmit} text={translate('edit_product.submit_button')} style={styles.button} />
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
          title={translate('edit_product.title_navigation')}
          isShowHeader={true}
          spaceBottom={true}
          isDisplayMenuButton={false}
        >
          <View style={[styles.container, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <CustomSectionHeader
              style={styles.sectionHeader}
              title={upperCase(translate('edit_product.title_section_header'))}
              icon={EDIT_PROFILE}
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

export default React.memo(EditStoreTenant);
