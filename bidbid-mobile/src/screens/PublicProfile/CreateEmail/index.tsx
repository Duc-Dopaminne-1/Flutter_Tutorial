import React, { ReactElement, useEffect, useRef } from 'react';
import { Keyboard, ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors } from '@/vars';
import { language } from '@/i18n';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import { useNavigation } from '@react-navigation/native';
import { CREATE_FIRST_NAME_SCREEN } from '@/navigation/screenKeys';
import { Formik, FormikValues } from 'formik';
import * as yup from 'yup';
import { useAlertMessage } from '@/constants/messageConstants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isIOS } from '@/shared/devices';
import { useDispatch } from 'react-redux';
import { saveProfile } from '@/redux/createProfile/actions';
import { GlobalProps } from '@/shared/Interface';
import CreateEmailForMik from '@/screens/PublicProfile/CreateEmail/component/CreateEmailFormik';

export function CreateEmailScreen(props: GlobalProps): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refInput = useRef(null);
  const alertMessage = useAlertMessage();

  const validationSchema = yup.object().shape({
    email: yup.string().required(alertMessage.EMPTY_FIELD).email(alertMessage.ERROR_EMAIL_VALIDATE),
  });

  const email = props.route.params ? props.route.params?.email : '';
  const initialValues = {
    email,
  };

  useEffect(() => {
    refInput.current.setNativeProps({
      text: email,
    });
  }, [email]);

  const onContinue = (value: FormikValues) => {
    const { email } = value;
    dispatch(
      saveProfile({
        email,
      }),
    );
    Keyboard.dismiss();

    navigation.navigate(CREATE_FIRST_NAME_SCREEN);
  };

  const emailInputIOS = () => {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        extraScrollHeight={100}
        scrollEnabled={false}
        extraHeight={250}
      >
        <Formik validateOnChange={false} initialValues={initialValues} onSubmit={onContinue} validationSchema={validationSchema}>
          {({ handleSubmit, errors, setFieldValue, setFieldError }) => {
            return (
              <CreateEmailForMik
                setFieldError={setFieldError}
                setFieldValue={setFieldValue}
                errors={errors.hasOwnProperty('email') ? errors.email : ''}
                onCreateEmail={handleSubmit}
                refInput={refInput}
              />
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    );
  };

  const emailInputAndroid = () => {
    return (
      <KeyboardAvoidingView keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })} style={styles.container}>
        <Formik validateOnChange={false} initialValues={initialValues} onSubmit={onContinue} validationSchema={validationSchema}>
          {({ handleSubmit, errors, setFieldValue, setFieldError }) => {
            return (
              <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
                <CreateEmailForMik
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                  errors={errors.hasOwnProperty('email') ? errors.email : ''}
                  onCreateEmail={handleSubmit}
                  refInput={refInput}
                />
              </ScrollView>
            );
          }}
        </Formik>
      </KeyboardAvoidingView>
    );
  };
  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomWrapHeader note={language('noteEmail')} title={language('whatIsEmail')} />
      {isIOS ? emailInputIOS() : emailInputAndroid()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
