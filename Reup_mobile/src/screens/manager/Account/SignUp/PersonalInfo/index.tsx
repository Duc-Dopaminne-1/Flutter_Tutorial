import React, {
  useState, useRef,
  useEffect
} from 'react';
import {
  View, ImageBackground,
  Image, Keyboard, BackHandler, Alert
} from 'react-native';
import Container from '@src/components/Container';
import BG_SIGNIN from '@res/img/bg_signin.png';
import styles from './styles';
import { Formik, FormikValues } from 'formik';
import { object, string } from 'yup';
import translate from '@src/localize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CustomText } from '@src/components/CustomText';
import CustomInput from '@src/components/CustomInput';
//@ts-ignore
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import ErrorMessage from '@src/components/ErrorMessage';
import { CustomButton } from '@src/components/CustomButton';
import { checkInternet } from '@src/utils/internet';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { BACK } from '@src/constants/icons';
import CustomPhoneInput from '@src/components/CustomPhoneInput';
import CustomAccessory from '@src/components/CustomAccessory';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateProfile } from '@src/modules/auth/actions';
import { phoneRegExp } from '@src/utils/validation';
import NavigationActionsService from '@src/navigation/navigation';
import { MAIN_SCREEN, CONFIRMATION } from '@src/constants/screenKeys';
import { RootState } from '@src/types/types';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompany } from '@reup/reup-api-sdk/libs/api/company/models';
import { isAndroid } from '@src/utils';

const PersonalInfo = () => {
  const telephoneRef = useRef(undefined);
  const inputComponents: any[] = [];
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputNumb = 3;
  const dispatch = useDispatch();
  const companyList = useSelector<RootState, IPagination<ICompany>>((state: RootState) => state.company.listCompany);

  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

  const onFocus = (index: number) => {
    setCurrentInputIndex(index);
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

  const initialValues = {
    firstName: '',
    lastName: '',
    phone: '',
    phoneFake: '',
    phoneCode: '',
  };

  const onSubmit = (values: any) => {
    const dataProfile = {
      first_name: values.firstName,
      last_name: values.lastName,
      phone: values.phoneFake,
      phone_code: values.phoneCode,
    };

    NavigationActionsService.showLoading();
    dispatch(
      updateProfile({
        data: dataProfile,
        onSuccess: () => {
          NavigationActionsService.hideLoading();
          if (companyList.results.length > 0) {
            NavigationActionsService.setRoot(MAIN_SCREEN);
          } else {
            NavigationActionsService.push(CONFIRMATION);
          }
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
      }));
  };

  const handleLogout = () => {
    dispatch(logout({}));
  };

  const onPressBack = () => {
    handleLogout();
  };

  const handleBackButtonPress = () => {
    handleLogout();
    return true;
  };

  const addEventListener = useRef(BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress));

  useEffect(() => {
    return () => {
      addEventListener.current.remove();
    };
  }, []);

  const validationSchema = object().shape({
    firstName: string()
      .trim()
      .required(`${translate('personal_info.first_name')} ${translate('error.required')}`),
    lastName: string()
      .trim()
      .required(`${translate('personal_info.last_name')} ${translate('error.required')}`),
    phone: string()
      .trim()
      .required(`${translate('personal_info.phone_number')} ${translate('error.required')}`)
      .matches(phoneRegExp, `${translate('error_validate_field.phone_number_not_valid')}`),
    phoneFake: string()
      .trim(),
  });

  const renderKeyboardAccessory = () => {
    return (
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
  };

  const renderHeader = () => {
    return (
      <View style={{ width: '100%', marginBottom: 24 }}>
        <CustomTouchable onPress={onPressBack}>
          <Image resizeMode="contain" source={BACK} style={{ width: 20, height: 20 }} />
        </CustomTouchable>
        <CustomText style={styles.titleText} text={translate('personal_info.sign_up_title')} />
        <CustomText style={styles.descriptionText} text={translate('personal_info.description')} />
      </View >
    );
  };

  const renderInputField = () => {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}>
        {(formikProps: FormikValues) => (
          <View style={styles.inputFormSubContainer}>
            <CustomInput
              inputRef={putInputRef.bind(undefined)}
              onFocus={() => onFocus(0)}
              description={translate('personal_info.first_name')}
              onChangeText={formikProps.handleChange('firstName')}
              autoCapitalize="none"
              returnKeyType="next"
              inputStyle={styles.inputStyle}
              value={formikProps.values.firstName}
              onBlur={formikProps.handleBlur('firstName')}
            />
            <ErrorMessage errorValue={formikProps.touched.firstName && formikProps.errors.firstName} />
            <CustomInput
              inputRef={putInputRef.bind(undefined)}
              onFocus={() => onFocus(1)}
              description={translate('personal_info.last_name')}
              onChangeText={formikProps.handleChange('lastName')}
              autoCapitalize="none"
              returnKeyType="next"
              inputStyle={styles.inputStyle}
              value={formikProps.values.lastName}
              onBlur={formikProps.handleBlur('lastName')}
            />
            <ErrorMessage errorValue={formikProps.touched.lastName && formikProps.errors.lastName} />
            <CustomPhoneInput
              inputRef={(input: any) => {
                telephoneRef.current = input;
                putInputRef(input);
              }}
              description={translate('personal_info.phone_number')}
              onFocus={() => onFocus(2)}
              onChangePhoneNumber={(phoneFake: string, phone: string, phoneCode: string) => {
                formikProps.setValues({ ...formikProps.values, phoneFake, phone, phoneCode });
              }}
              value={formikProps.values.phoneFake}
              onBlur={formikProps.handleBlur('phone')}
            />
            <ErrorMessage
              errorValue={formikProps.touched.phone
                && formikProps.errors.phone}
            />

            <CustomButton
              onPress={() => checkInternet.processFunction(formikProps.handleSubmit)}
              style={styles.buttonContainer}
              textStyle={styles.buttonTitle}
              text={translate('personal_info.signup_button')}
            />
          </View>
        )}
      </Formik >
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Container barStyle={'light-content'}>
        <ImageBackground source={BG_SIGNIN} style={styles.background} resizeMode='stretch'>
          <KeyboardAwareScrollView
            bounces={false}
            enableOnAndroid
            extraScrollHeight={isAndroid() ? 50 : 0}
            style={styles.container}
            contentContainerStyle={styles.contentContainerStyle}
            contentInsetAdjustmentBehavior="never"
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {renderHeader()}
              {renderInputField()}
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </Container>
      {renderKeyboardAccessory()}
    </View>
  );
};

export default PersonalInfo;
