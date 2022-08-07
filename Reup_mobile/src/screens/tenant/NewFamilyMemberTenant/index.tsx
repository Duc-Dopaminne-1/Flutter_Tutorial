import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { View, ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from 'react-native';
import { ADD_PLUS } from '@src/constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { Formik } from 'formik';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string, array } from 'yup';
import { clone, upperCase } from 'lodash';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import CustomAccessory from '@src/components/CustomAccessory';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle, isAndroid, getFullName, getUserNameFromMail } from '@src/utils';
import { CustomFlatList } from '@src/components/FlatList';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { RootState } from '@src/types/types';
import { IUserProfile, IDType } from '@reup/reup-api-sdk/libs/api/user/models';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import CustomSelect, { CustomSelectType } from '@src/components/CustomSelect';
import CustomInputSelect from '@src/components/CustomInputSelect';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import NavigationActionsService from '@src/navigation/navigation';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import { uploadImage } from '@src/modules/auth/actions';
import AddImageItem from '@src/components/FlatListItem/AddImageItem';
import AddImage from '@src/components/AddImage';
import { CustomDropdownSelect } from '@src/components/CustomDropdownSelect';
import { createMember } from '@src/modules/Units/actions';
import { role } from '@src/screens/manager/NewMember';
import CustomPhoneInput from '@src/components/CustomPhoneInput';

export const REQUEST = 'REQUEST';
let isShowKeyboard = false;
const NewFamilyMemberTenant = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);

  const route = useRoute();
  const { flatList }: any = route.params;
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { unitId }: any = route.params;
  const inputComponents: any[] = [];
  const numberOfInput = 5;
  const phoneRef = useRef(undefined);

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
      Keyboard.removeListener(isAndroid() ? 'keyboardDidHide' : 'keyboardWillHide', keyboardDidHide);
      Keyboard.removeListener(isAndroid() ? 'keyboardDidShow' : 'keyboardWillShow', keyboardDidShow);
    };
  }, []);

  const validationSchema = object().shape({
    firstName: string()
      .trim()
      .required(`${translate('new_family_member.first_name')} ${translate('error.required')}`),
    lastName: string()
      .trim()
      .required(`${translate('new_family_member.last_name')} ${translate('error.required')}`),
    role: string()
      .trim()
      .required(`${translate('new_family_member.role')} ${translate('error.required')}`),
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

  const onSubmit = async (values: any) => {
    const param: any = {
      member: {
        email: values.email ? values.email : '',
        first_name: values.firstName ? values.firstName : '',
        last_name: values.lastName ? values.lastName : '',
        avatar: values.images ? values.images[0] : '',
        phone: values.phoneFake,
        phone_code: values.phoneCode,
      },
      role: values.role
    };

    const newParam: any = {
      member: {},
      role: values.role
    };

    Object.keys(param.member).map(key => {
      if (param.member[key]) {
        newParam['member'][key] = param.member[key];
      }
    });

    NavigationActionsService.showLoading();
    dispatch(createMember({
      unitId: unitId,
      params: newParam,
      onSuccess: () => {
        NavigationActionsService.hideLoading();
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
  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };

  const onChangeDropdownCategory = (obj: ObjDropdown, setFieldValue: any, key: string) => {
    if (obj._key) {
      setFieldValue(key, obj._key);
      return;
    }
    setFieldValue(key, '');
  };

  const onRemoveImage = (index: number) => {
    const cloneData = clone(images);
    cloneData.splice(index, 1);
    setImages(cloneData);
  };

  const onCompletedPickerImage = (imageResponse: any, setFieldValue: any) => {
    if (images.length > 4) {
      Alert.alert(translate('alert.title_error'), 'Maximum is 5 images');
      return;
    }
    const cloneData = clone(images);
    cloneData.push(imageResponse.path);
    setImages(cloneData);

    let file = {};
    if (imageResponse) {
      file = {
        uri: imageResponse.path,
        type: imageResponse.mime,
        name: moment().valueOf().toString() + ".jpg"
      };
    }
    const formData = new FormData();
    formData.append("folder_name", 'media/photos');
    formData.append('file', file);
    NavigationActionsService.showLoading();
    dispatch(
      uploadImage({
        data: formData,
        progress: () => { },
        onSuccess: (data) => {
          const imageUrlsData = clone(imageUrls);
          imageUrlsData.push(data.url);
          setImageUrls(imageUrlsData);
          setFieldValue("images", imageUrlsData);
          NavigationActionsService.hideLoading();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
      }),
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

  const renderInputFirstName = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps;
    return (
      <>
        <CustomInput
          description={translate("new_family_member.first_name")}
          onChangeText={(text: string) => {
            setValues({ ...values, firstName: text });
          }}
          autoCapitalize="words"
          returnKeyType="next"
          value={values.firstName}
          onBlur={handleBlur('firstName')}
          isShowRequired={true}
          inputRef={(input: any) => { putInputRef(input); }}
          onFocus={() => setCurrentInputIndex(0)}
        />
        <ErrorMessage errorValue={touched.firstName && errors.firstName} />
      </>
    );
  };

  const renderInputLastName = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps;
    return (
      <>
        <CustomInput
          description={translate("new_family_member.last_name")}
          onChangeText={(text: string) => {
            setValues({ ...values, lastName: text });
          }}
          autoCapitalize="words"
          returnKeyType="next"
          value={values.lastName}
          onBlur={handleBlur('lastName')}
          isShowRequired={true}
          inputRef={(input: any) => { putInputRef(input); }}
          onFocus={() => setCurrentInputIndex(1)}
        />
        <ErrorMessage errorValue={touched.lastName && errors.lastName} />
      </>
    );
  };


  const renderInputRole = (formikProps: any) => {
    const { values, errors, setValues, touched } = formikProps;

    const countrySelected = role.findIndex(item => item._key === values.role);

    return (
      <>
        <CustomDropdownSelect
          numberOfInput={numberOfInput}
          currentInputIndex={currentInputIndex}
          containerStyle={styles.dropdownRole}
          inputRef={(input: any) => { putInputRef(input); }}
          textTitle={translate("new_family_member.role")}
          onFocus={() => setCurrentInputIndex(2)}
          arrData={role}
          onPressDown={nextInput}
          onPressUp={previousInput}
          selected={countrySelected > 0 ? countrySelected : 0}
          onChangeDropDown={(obj: ObjDropdown) => {
            setValues({ ...values, role: obj._key });
          }}
          isShowRequired={true}
        />
        <ErrorMessage errorValue={formikProps.touched.role && formikProps.errors.role} />
      </>
    );
  };

  const renderInputPhone = (formikProps: any) => {
    const { values, errors, handleChange, touched, handleBlur, setValues } = formikProps;
    return (
      <>
        <CustomPhoneInput
          inputRef={(input: any) => {
            phoneRef.current = input;
            putInputRef(input);
          }}
          description={translate('new_member.title_phone')}
          onFocus={() => setCurrentInputIndex(3)}
          onChangePhoneNumber={(phoneFake: string, phone: string, phoneCode: string) => {
            setValues({ ...values, phoneFake, phone, phoneCode });
          }}
          value={values.phoneFake}
          onBlur={handleBlur('phone')}
        />
        <ErrorMessage errorValue={touched.phone && errors.phone} />
      </>
    );
  };

  const renderEmail = (formikProps: any) => {
    return <CustomInput
      inputRef={(input: any) => putInputRef(input)}
      description={`${translate('new_family_member.email')}`}
      onChangeText={
        formikProps.handleChange('email')
      }
      returnKeyType="next"
      value={formikProps.values.email}
      onFocus={() => setCurrentInputIndex(4)}
      onBlur={formikProps.handleBlur('email')}
      autoCapitalize="none"
    />;
  };

  const _renderItem = (item: any, index: number) => {
    return (
      <AddImageItem item={item} index={index} deleteOnpress={onRemoveImage} />
    );
  };


  const renderInputFields = () => {
    return (
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          role: role[0]._key,
          phone: '',
          phoneFake: '',
          phoneCode: '',
          email: '',
          images: images
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}>
        {formikProps => (
          <View style={[styles.listContainer, !isAndroid() ? { paddingBottom: paddingBottom } : {}]}>
            <ScrollView style={styles.containerScrollView}>
              <View style={styles.inputFormSubContainer}>

                {renderInputFirstName(formikProps)}
                {renderInputLastName(formikProps)}

                {/* ROLE */}
                {renderInputRole(formikProps)}

                {renderInputPhone(formikProps)}

                {renderEmail(formikProps)}
                <ErrorMessage errorValue={formikProps.touched.email && formikProps.errors.email} />

                {/* IMAGE */}
                <AddImage
                  images={images}
                  description={translate('new_notification.add_image')}
                  numberOfImage={1}
                  onCompletedPickerImage={
                    (imageResponse => { onCompletedPickerImage(imageResponse, formikProps.setFieldValue); })
                  }
                />
                <CustomFlatList
                  horizontal={true}
                  onLoad={onLoad}
                  showEmpty={false}
                  data={images}
                  contentContainerStyle={styles.imagesList}
                  renderItem={_renderItem}
                />
                < ErrorMessage errorValue={formikProps.errors.images as string} />
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CustomButton onPress={formikProps.handleSubmit} text={translate('new_notification.submit')} style={styles.button} />
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
          title={translate('new_family_member.title')}
          isShowHeader={true}
          spaceBottom={true}
          isDisplayMenuButton={false}
        >
          <View style={styles.container}>
            <CustomSectionHeader
              style={styles.sectionHeader}
              title={upperCase(translate('new_family_member.title_header'))}
              icon={ADD_PLUS}
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

export default NewFamilyMemberTenant;
