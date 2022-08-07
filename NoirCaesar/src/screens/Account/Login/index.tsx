import { Image, View, Keyboard, Platform } from 'react-native';
import { SIGN_UP, FORGOT_PASSWORD } from '@constants/screenKeys';
import React, { useRef, useEffect, useState } from 'react';
import { LOGO } from '@src/constants/icons';
import Container from '@components/Container';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { toMain } from '@navigation';
import styles from './styles';
import translate from '@src/localize';
import CustomInput from '@src/components/CustomInput';
import { Formik } from 'formik';
import { object, string } from 'yup';
import ErrorMessage from '../../../components/ErrorMessage';
import { login } from '@src/modules/auth/actions';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { CustomButton } from '@src/components/CustomButton';
import { resetAllState } from '@src/modules/base/actions';
import { PlatForm } from '@goldfishcode/noir-caesar-api-sdk/libs/type';

const Login = (props: any) => {
  const dispatch = useDispatch();
  const emailRef: any = useRef(null);
  const passwordRef: any = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardHide);
  }, []);

  const onKeyboardShow = (e: KeyboardEvent) => {
    Platform.OS === 'android' && setKeyboardHeight(e.endCoordinates.height + 50);
  };

  const onKeyboardHide = () => {
    setKeyboardHeight(0);
  };

  const validationSchema = object().shape({
    email: string()
      .label(translate('authentication.email'))
      .email(translate('authentication.valid_email'))
      .required(translate('authentication.registered_email')),
    password: string()
      .label(translate('authentication.password'))
      .required(translate('authentication.password_required')),
  });

  useEffect(() => {
    NavigationActionsService.initInstance(props.componentId);
    dispatch(resetAllState());
  }, []);

  const usernameFocus = () => {
    passwordRef && passwordRef.current.focus();
  };

  const onCreateAccount = () => {
    NavigationActionsService.push(SIGN_UP);
  };

  const onForgotPassword = () => {
    NavigationActionsService.push(FORGOT_PASSWORD);
  };

  const onLogin = (values: any) => {
    if (values.password.trim() != '') {
      dispatch(
        login({
          email: values.email,
          password: values.password,
          onSuccess: () => {
            Keyboard.dismiss();
            setTimeout(() => {
              toMain();
            }, 500);
          },
          onFail: error => {
            Keyboard.dismiss();
            setTimeout(() => {
              NavigationActionsService.hideLoading();
              NavigationActionsService.showErrorPopup(error);
            }, 500);
          },
        }),
      );
    } else {
      NavigationActionsService.showCustomPopup({
        text: translate('alert.message_login_error'),
      });
    }
  };

  const renderDontHaveAccount = () => {
    return (
      <View style={styles.dontHaveAccountContainer}>
        <CustomText style={styles.titleSmall} text={translate('authentication.dont_have_account') + ' '} />
        <CustomTouchable onPress={onCreateAccount}>
          <CustomText style={styles.titleSmallRed} text={translate('authentication.create_now')} />
        </CustomTouchable>
      </View>
    );
  };

  const renderForgotPassword = () => {
    return (
      <View style={[styles.forgotPasswordContainer]}>
        <CustomTouchable onPress={onForgotPassword}>
          <CustomText style={styles.titleSmallRed} text={translate('authentication.forgot_password')} />
        </CustomTouchable>
      </View>
    );
  };

  const renderInputFields = () => {
    return (
      <Formik initialValues={{ email: '', password: '' }} onSubmit={onLogin} validationSchema={validationSchema}>
        {({ handleSubmit, values, errors, setValues, touched, isValid, handleBlur }) => (
          <View style={styles.inputFormSubContainer}>
            <CustomInput
              inputRef={emailRef}
              onChangeText={(field: string) => setValues({ ...values, email: field.trim() })}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={usernameFocus}
              placeholder={translate('authentication.email_address')}
              returnKeyType="next"
              value={values.email}
              moreStyle={{ marginBottom: touched.email && errors.email ? 0 : 16 }}
              keyboardType="email-address"
              onBlur={handleBlur('email')}
            />
            <ErrorMessage errorValue={touched.email && errors.email} />
            <CustomInput
              inputRef={passwordRef}
              onChangeText={(field: string) => setValues({ ...values, password: field })}
              onSubmitEditing={handleSubmit}
              placeholder={translate('authentication.password')}
              returnKeyType="done"
              secureTextEntry
              value={values.password}
              moreStyle={{ marginBottom: touched.password && errors.password ? 0 : 16 }}
              onBlur={handleBlur('password')}
            />
            <ErrorMessage errorValue={touched.password && errors.password} />
            <CustomButton disabled={!isValid} onPress={handleSubmit} text={translate('authentication.login')} style={{ marginTop: 30 }} />
          </View>
        )}
      </Formik>
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
        <View style={[styles.content, { marginBottom: keyboardHeight }]}>
          <CustomText style={styles.headerTitle} text={translate('authentication.login_label')} />
          {renderInputFields()}
          {renderDontHaveAccount()}
          {renderForgotPassword()}
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default Login;
