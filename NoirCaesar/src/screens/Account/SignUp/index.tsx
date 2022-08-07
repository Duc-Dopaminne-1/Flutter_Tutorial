import { Text, View, Image, Keyboard, Platform } from 'react-native';
import { TERMS_OF_SERVICE, PRIVACY } from '@constants/screenKeys';
import React, { useEffect, useRef, useState } from 'react';
import { object, string, ref } from 'yup';
import Container from '@components/Container';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signUp } from '@modules/auth/actions';
import styles from './styles';
import translate from '@src/localize';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '../../../components/ErrorMessage';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import NavigationActionsService from '@src/navigation/navigation';
import { LOGO } from '@src/constants/icons';
import { CustomText } from '@src/components/CustomText';
import { toMain } from '@src/navigation';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { CustomButton } from '@src/components/CustomButton';

const validateSchema = object().shape({
  userName: string()
    .trim()
    .required(`${translate('error_validate_field.user_name')} ${translate('error_validate_field.input_is_require')}!`)
    .min(2, `${translate('error_validate_field.user_name')} ${translate('error_validate_field.input_too_short')}!`)
    .max(36, `${translate('profile.last_name')} ${translate('error_validate_field.input_too_long')}!`)
    .matches(/^[a-zA-Z0-9_]*$/, `${translate('error_validate_field.user_name')} ${translate('error_validate_field.is_not_valid')}!`),
  email: string()
    .trim()
    .required(`${translate('error_validate_field.email')} ${translate('error_validate_field.input_is_require')}!`)
    .email(translate('error_validate_field.email_not_valid')),
  password: string()
    .trim()
    .required(`${translate('error_validate_field.password')} ${translate('error_validate_field.input_is_require')}!`)
    .min(8, `${translate('authentication.short_password')}!`)
    .matches(
      /^(?=.*\d).+$/,
      `${translate('error_validate_field.password')} ${translate('error_validate_field.password_special_character')}!`,
    )
    .matches(
      /.*[!@#$%^&*(),.?":{}|<>].*$/,
      `${translate('error_validate_field.password')} ${translate('error_validate_field.password_special_character')}!`,
    ),
  confirmPassword: string()
    .trim()
    .required(`${translate('error_validate_field.confirm_pwd')} ${translate('error_validate_field.input_is_require')}!`)
    .min(8, `${translate('authentication.short_confirm_password')}!`)
    .oneOf([ref('password'), null], `${translate('error_validate_field.confirm_pwd')} ${translate('error_validate_field.not_match')}!`),
});

const SignUp = () => {
  const dispatch = useDispatch();

  const userNameRef: any = useRef(null);
  const emailRef: any = useRef(null);
  const passwordRef: any = useRef(null);
  const confirmPasswordRef: any = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardHide);
  }, []);

  const onKeyboardShow = (e: KeyboardEvent) => {
    Platform.OS === 'android' && setKeyboardHeight(e.endCoordinates.height + 34);
  };

  const onKeyboardHide = () => {
    setKeyboardHeight(0);
  };

  const onSignup = (values: any) => {
    dispatch(
      signUp({
        body: {
          username: values.userName,
          email: values.email,
          password1: values.password,
          password2: values.confirmPassword,
        },
        onSuccess: () => {
          Keyboard.dismiss();
          setTimeout(() => {
            toMain(true);
          }, 500);
        },
        onFail: error => {
          Keyboard.dismiss();
          setTimeout(() => {
            error &&
              NavigationActionsService.showCustomPopup({
                text: error.message ?? translate('alert.message_error_default'),
                buttonRedTitle: translate('alert.ok'),
                onPressRedButton: () => {
                  NavigationActionsService.hideCustomPopup();
                  onFocusUserName();
                },
              });
          }, 500);
        },
      }),
    );
  };

  const onFocusUserName = () => {
    passwordRef.current && userNameRef.current.focus();
  };

  const onFocusEmail = () => {
    emailRef.current && emailRef.current.focus();
  };

  const onFocusPassword = () => {
    passwordRef.current && passwordRef.current.focus();
  };

  const onFocusConfirmPassword = () => {
    confirmPasswordRef.current && confirmPasswordRef.current.focus();
  };

  const onLogin = () => {
    NavigationActionsService.pop();
  };

  const onPressTermsOfService = () => {
    NavigationActionsService.push(TERMS_OF_SERVICE, { fromSignUp: true });
  };

  const onPressPrivacyPolicy = () => {
    NavigationActionsService.push(PRIVACY);
  };

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={{ userName: '', email: '', password: '', confirmPassword: '' }}
        onSubmit={onSignup}
        validationSchema={validateSchema}
      >
        {({ handleSubmit, values, errors, setValues, touched, isValid, handleBlur }) => (
          <View style={styles.inputFormSubContainer}>
            <CustomInput
              inputRef={userNameRef}
              placeholder={translate('authentication.username')}
              autoCorrect={false}
              onChangeText={(field: string) => setValues({ ...values, userName: field })}
              onSubmitEditing={onFocusEmail}
              autoCapitalize="none"
              returnKeyType="next"
              moreStyle={{ marginBottom: touched.userName && errors.userName ? 0 : 16 }}
              value={values.userName}
              onBlur={handleBlur('userName')}
            />
            <ErrorMessage errorValue={touched.userName && errors.userName} />
            <CustomInput
              inputRef={emailRef}
              placeholder={translate('authentication.email')}
              autoCorrect={false}
              onChangeText={(field: string) => setValues({ ...values, email: field.trim() })}
              onSubmitEditing={onFocusPassword}
              autoCapitalize="none"
              returnKeyType="next"
              moreStyle={{ marginBottom: touched.email && errors.email ? 0 : 16 }}
              keyboardType="email-address"
              value={values.email}
              onBlur={handleBlur('email')}
            />
            <ErrorMessage errorValue={touched.email && errors.email} />
            <CustomInput
              inputRef={passwordRef}
              placeholder={translate('authentication.password')}
              autoCorrect={false}
              onChangeText={(field: string) => setValues({ ...values, password: field })}
              onSubmitEditing={onFocusConfirmPassword}
              autoCapitalize="none"
              returnKeyType="next"
              secureTextEntry
              moreStyle={{ marginBottom: touched.password && errors.password ? 0 : 16 }}
              value={values.password}
              onBlur={handleBlur('password')}
            />
            <ErrorMessage errorValue={touched.password && errors.password} />
            <CustomInput
              inputRef={confirmPasswordRef}
              placeholder={translate('authentication.confirm_password')}
              autoCorrect={false}
              onChangeText={(field: string) => setValues({ ...values, confirmPassword: field })}
              onSubmitEditing={handleSubmit}
              autoCapitalize="none"
              returnKeyType="done"
              secureTextEntry
              value={values.confirmPassword}
              onBlur={handleBlur('confirmPassword')}
            />
            <ErrorMessage errorValue={touched.confirmPassword && errors.confirmPassword} />
            <CustomButton
              onPress={handleSubmit}
              disabled={!isValid}
              style={[styles.buttonContainer, { marginTop: touched.confirmPassword && errors.confirmPassword ? 10 : 28 }]}
              textStyle={styles.buttonTitle}
              text={translate('authentication.signup')}
            />
          </View>
        )}
      </Formik>
    );
  };

  const renderPolicyText = () => {
    return (
      <View style={styles.policyContainer}>
        <Text numberOfLines={2} style={{ textAlign: 'center' }}>
          <Text style={styles.titleTiny} allowFontScaling={false}>
            {translate('authentication.agree_policy')}
          </Text>
          <Text onPress={onPressTermsOfService} style={styles.titleTinyRed} allowFontScaling={false}>
            {translate('authentication.terms_of_service')}
          </Text>
          <Text style={styles.titleTiny} allowFontScaling={false}>
            {translate('authentication.and')}
          </Text>
          <Text onPress={onPressPrivacyPolicy} style={styles.titleTinyRed} allowFontScaling={false}>
            {translate('authentication.privacy_policy')}
          </Text>
        </Text>
      </View>
    );
  };

  const renderLoginText = () => {
    return (
      <View style={styles.loginContainer}>
        <CustomText style={styles.titleSmall} text={translate('authentication.signup_back_to_login')} />
        <CustomTouchable onPress={onLogin}>
          <CustomText style={styles.titleSmallRed} text={translate('authentication.login')} />
        </CustomTouchable>
      </View>
    );
  };

  return (
    <Container>
      <KeyboardAwareScrollView
        bounces={false}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      >
        <Image resizeMode="stretch" source={LOGO} style={[styles.logo]} />
        <View style={[styles.container, { marginBottom: keyboardHeight }]}>
          <CustomText style={styles.headerTitle} text={translate('authentication.create_account')} />
          {renderInputFields()}
          {renderPolicyText()}
          {renderLoginText()}
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default SignUp;
