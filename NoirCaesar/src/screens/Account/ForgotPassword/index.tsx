import { View, Image, Keyboard, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { resetPassword } from '@modules/auth/actions';
import Container from '@components/Container';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import translate from '@src/localize';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { Formik } from 'formik';
import { object, string } from 'yup';
import { LOGO, BACK } from '@src/constants/icons';
import { CustomHeader } from '@src/components/CustomHeader';
import NavigationActionsService from '@src/navigation/navigation';
import { useDispatch } from 'react-redux';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardHide);
  }, []);

  const onKeyboardShow = (e: KeyboardEvent) => {
    Platform.OS === 'android' && setKeyboardHeight(e.endCoordinates.height + 30);
  };

  const onKeyboardHide = () => {
    setKeyboardHeight(0);
  };

  const validationSchema = object().shape({
    email: string()
      .label(translate('authentication.email'))
      .email(translate('authentication.valid_email'))
      .required(translate('authentication.registered_email')),
  });

  const renderEmailForm = () => {
    return (
      <Formik initialValues={{ email: '' }} onSubmit={onForgotPassword} validationSchema={validationSchema}>
        {({ handleSubmit, values, errors, setValues, touched, isValid, handleBlur }) => (
          <View style={styles.inputFormSubContainer}>
            <CustomInput
              onChangeText={(field: string) => setValues({ ...values, email: field.trim() })}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={translate('authentication.email_address')}
              returnKeyType="done"
              keyboardType="email-address"
              value={values.email}
              onSubmitEditing={handleSubmit}
              onBlur={handleBlur('email')}
            />
            <ErrorMessage errorValue={touched.email && errors.email} />
            <CustomButton
              style={{ marginTop: 40 }}
              disabled={!isValid}
              onPress={handleSubmit}
              text={translate('authentication.title_button_reset_password')}
            />
          </View>
        )}
      </Formik>
    );
  };

  const onForgotPassword = (values: any) => {
    dispatch(
      resetPassword({
        email: values.email,
        onSuccess: () => {
          Keyboard.dismiss();
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            NavigationActionsService.pop();
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
  };

  const onBack = () => {
    NavigationActionsService.pop();
  };

  return (
    <Container>
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} contentInsetAdjustmentBehavior={'never'} bounces={false}>
        <Image resizeMode="stretch" source={LOGO} style={[styles.logo]} />
        <View style={[styles.content, { marginBottom: keyboardHeight }]}>
          <CustomText style={styles.headerTitle} text={translate('authentication.forgot_password')} />
          <CustomText style={styles.description} text={translate('authentication.description_forgot_password')} />
          {renderEmailForm()}
        </View>
      </KeyboardAwareScrollView>
      <CustomHeader containerStyle={{ backgroundColor: 'transparent', position: 'absolute' }} leftImage={BACK} leftAction={onBack} />
    </Container>
  );
};

export default ForgotPassword;
