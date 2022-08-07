import { View, Keyboard, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import React, { useRef, useState } from 'react';
import { resetPassword, confirmOTP } from '@modules/auth/actions';
import Container from '@components/Container';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import translate from '@src/localize';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';
import { Formik } from 'formik';
import * as yup from 'yup';
import { BACK } from '@src/constants/icons';
import { CustomHeader } from '@src/components/CustomHeader';
import NavigationActionsService from '@src/navigation/navigation';
import { useDispatch } from 'react-redux';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import { RESET_PASSWORD_SUCCESS } from '@src/constants/screenKeys';
import CustomAccessory from '@src/components/CustomAccessory';
//@ts-ignore
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle } from '@src/utils';


interface Props {
  email: string;
}
const ResetPassword = (props: Props) => {
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const inputComponents: any[] = [];
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const validationSchema = yup.object().shape({
    otp: yup
      .string()
      .trim()
      .required(translate('authentication.otp_required')),
    password1: yup
      .string()
      .trim()
      .min(6, translate('authentication.short_password'))
      .required(translate('authentication.add_new_password')),
    password2: yup.string().oneOf([yup.ref('password1'), null], translate('authentication.password_match')),
  });

  const putInputRef = (inp: any) => {
    inputComponents.push(inp);
  };

  const getInputRef = (index: number) => {
    setCurrentInputIndex(index);
    return inputComponents[index];
  };

  const nextInput = () => {
    return getInputRef(currentInputIndex + 1).focus();
  };
  const previousInput = () => {
    return getInputRef(currentInputIndex - 1).focus();
  };
  const doneTyping = () => {
    return Keyboard.dismiss();
  };

  const renderForm = () => {
    return (
      <Formik initialValues={{ otp: '', password1: '', password2: '' }} onSubmit={onForgotPassword} validationSchema={validationSchema}>
        {({ handleSubmit, values, errors, handleChange, touched, isValid, handleBlur }) => (
          <View style={styles.inputFormSubContainer}>
            <CustomInput
              onChangeText={handleChange('otp')}
              inputRef={(input: any) => putInputRef(input)}
              placeholder={translate('authentication.enter_otp')}
              keyboardType="number-pad"
              value={values.otp}
              onFocus={() => setCurrentInputIndex(0)}
              description={translate('authentication.otp')}
              onSubmitEditing={() => getInputRef(1).focus()}
              onBlur={handleBlur('otp')}
            />
            <ErrorMessage errorValue={touched.otp && errors.otp} />
            <CustomInput
              onChangeText={handleChange('password1')}
              autoCapitalize="none"
              placeholder={translate('authentication.password')}
              returnKeyType="next"
              secureTextEntry
              inputRef={(input: any) => putInputRef(input)}
              value={values.password1}
              onFocus={() => setCurrentInputIndex(1)}
              description={translate('authentication.password')}
              onSubmitEditing={() => getInputRef(2).focus()}
              onBlur={handleBlur('password1')}
            />
            <ErrorMessage errorValue={touched.password1 && errors.password1} />
            <CustomInput
              onChangeText={handleChange('password2')}
              autoCapitalize="none"
              placeholder={translate('authentication.retype_password')}
              returnKeyType="done"
              secureTextEntry
              inputRef={(input: any) => putInputRef(input)}
              value={values.password2}
              onFocus={() => setCurrentInputIndex(2)}
              description={translate('authentication.retype_password')}
              onSubmitEditing={handleSubmit}
              onBlur={handleBlur('password2')}
            />
            <ErrorMessage errorValue={touched.password2 && errors.password2} />
            <CustomButton
              style={styles.button}
              onPress={handleSubmit}
              text={translate('authentication.title_button_verify')}
            />
          </View>
        )}
      </Formik>
    );
  };

  const onForgotPassword = (values: any) => {
    const { email } = props;
    setLoading(true);
    dispatch(
      confirmOTP({
        email: email,
        newPassword: values.password1,
        otp: values.otp,
        onSuccess: () => {
          Keyboard.dismiss();
          setTimeout(() => {
            setLoading(false);
            NavigationActionsService.push(RESET_PASSWORD_SUCCESS);
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
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior={'padding'}>
        <Container>
          <CustomHeader
            styleHeader={{ backgroundColor: 'white' }}
            leftImage={BACK}
            leftAction={onBack}
            mainText={translate('authentication.title_forgot_password')}
          />
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            contentInsetAdjustmentBehavior={'never'} bounces={false}>
            <View style={styles.content}>
              <CustomText style={styles.description} numberOfLines={2} text={translate('authentication.description_otp')} />
              {renderForm()}
            </View>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
      <KeyboardAccessoryView style={{ padding: 0, height: 45 }} androidAdjustResize>
        <CustomAccessory
          currentInputIndex={currentInputIndex}
          numberOfInput={3}
          onPressDown={nextInput}
          onPressUp={previousInput}
          onPressDone={doneTyping}
        />
      </KeyboardAccessoryView>
    </View>
  );
};

export default ResetPassword;
