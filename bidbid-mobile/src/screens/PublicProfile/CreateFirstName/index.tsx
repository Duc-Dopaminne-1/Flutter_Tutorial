import React, { ReactElement, useEffect, useRef } from 'react';
import { BackHandler, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import { useNavigation } from '@react-navigation/native';
import { CREATE_INSTAGRAM_USERNAME_SCREEN } from '@/navigation/screenKeys';
import { Formik, FormikValues } from 'formik';
import { object, string } from 'yup';
import { useAlertMessage } from '@/constants/messageConstants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isIOS } from '@/shared/devices';
import { saveProfile } from '@/redux/createProfile/actions';
import { useDispatch } from 'react-redux';
import CreateFirstNameForMik from '@/screens/PublicProfile/CreateFirstName/component/CreateFirstNameFormik';

const initialValues = {
  firstName: '',
  lastName: '',
};

export function CreateFirstNameScreen(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const alertMessage = useAlertMessage();
  const formikRef = useRef(null);

  const validationSchema = object().shape({
    firstName: string().trim().required(alertMessage.EMPTY_FIELD),
    lastName: string().trim().required(alertMessage.EMPTY_FIELD),
  });

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => BackHandler.removeEventListener('hardwareBackPress', () => true);
  }, []);

  const onContinue = (value: FormikValues) => {
    const { firstName, lastName } = value;
    let isError = false;
    [...firstName].map(item => {
      if (!!item.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/)) {
        isError = true;
        formikRef.current?.setFieldError('firstName', language('errorMessage.invalidName'));
      }
    });
    [...lastName].map(item => {
      if (!!item.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/)) {
        isError = true;
        formikRef.current?.setFieldError('lastName', language('errorMessage.invalidName'));
      }
    });

    if (!isError) {
      dispatch(
        saveProfile({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      );
      Keyboard.dismiss();
      setTimeout(() => {
        navigation.navigate(CREATE_INSTAGRAM_USERNAME_SCREEN);
      }, 200);
    }
  };

  const firstNameInputIOS = () => {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        extraScrollHeight={100}
        scrollEnabled={false}
        extraHeight={230}
      >
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validateOnChange={false}
          onSubmit={onContinue}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, errors, setFieldValue, setFieldError }) => {
            return (
              <CreateFirstNameForMik
                setFieldError={setFieldError}
                setFieldValue={setFieldValue}
                errors={errors}
                onCreateFirstName={handleSubmit}
              />
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    );
  };

  const firstNameInputAndroid = () => {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={-500}>
        <Formik validateOnChange={false} initialValues={initialValues} onSubmit={onContinue} validationSchema={validationSchema}>
          {({ handleSubmit, errors, setFieldValue, setFieldError }) => {
            return (
              <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
                <CreateFirstNameForMik
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  onCreateFirstName={handleSubmit}
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
      <CustomWrapHeader isBack={false} title={language('myFirstName')} titleStyle={styles.txtTitle} />
      {isIOS ? firstNameInputIOS() : firstNameInputAndroid()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  txtTitle: {
    fontSize: fonts.size.s22,
  },
});
