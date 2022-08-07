import { Alert, View, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { resetPassword } from '@modules/auth/actions';
import Container from '@components/Container';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import translate from '@src/localize';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { Formik } from 'formik';
import { object, string } from 'yup';
import { BACK } from '@src/constants/icons';
import { CustomHeader } from '@src/components/CustomHeader';
import NavigationActionsService from '@src/navigation/navigation';
import { useDispatch } from 'react-redux';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import Spinner from '@src/components/Spinner';
import { RESET_PASSWORD_TENANT } from '@src/constants/screenKeys';
import { emailRegex } from '@src/constants/regex';

interface Props { }
const ForgotPasswordTenant = (props: Props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const validationSchema = object().shape({
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
  });

  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const renderEmailForm = () => {
    return (
      <Formik initialValues={{ email: '' }} onSubmit={onForgotPassword} validationSchema={validationSchema}>
        {({ handleSubmit, values, errors, handleChange, touched, isValid, handleBlur }) => (
          <View style={styles.inputFormSubContainer}>
            <CustomInput
              onChangeText={handleChange('email')}
              autoCapitalize="none"
              description={translate('authentication.email_address')}
              placeholder={translate('authentication.email_address')}
              returnKeyType="done"
              keyboardType="email-address"
              value={values.email}
              onSubmitEditing={handleSubmit}
              onBlur={handleBlur('email')}
            />
            <ErrorMessage errorValue={touched.email && errors.email} />
            <CustomButton
              style={styles.button}
              onPress={handleSubmit}
              text={translate('authentication.title_button_reset_password')}
            />
          </View>
        )}
      </Formik>
    );
  };

  const onForgotPassword = (values: any) => {
    setLoading(true);
    dispatch(
      resetPassword({
        email: values.email,
        onSuccess: () => {
          Keyboard.dismiss();
          setLoading(false);
          setTimeout(() => {
            NavigationActionsService.push(RESET_PASSWORD_TENANT);
          }, 700);
        },
        onFail: error => {
          Keyboard.dismiss();
          setLoading(false);
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
      }),
    );
  };

  const onBack = () => {
    NavigationActionsService.pop();
  };

  return (
    <Container>
      <Spinner loading={loading} />
      <CustomHeader
        styleHeader={{ backgroundColor: 'white' }}
        leftImage={BACK}
        leftAction={onBack}
        mainText={translate('authentication.title_forgot_password')}
      />
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} contentInsetAdjustmentBehavior={'never'} bounces={false}>
        <View style={styles.content}>
          <CustomText style={styles.description} numberOfLines={2} text={translate('authentication.description_forgot_password')} />
          {renderEmailForm()}
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default ForgotPasswordTenant;
