import React, { ReactElement } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View, ScrollView } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import CreateBirthdayInput from '@/screens/PublicProfile/CreateBirthday/component/CreateBirthdayInput';
import { useNavigation } from '@react-navigation/native';
import { CREATE_SEX_SCREEN } from '@/navigation/screenKeys';
import { Formik, FormikValues } from 'formik';
import { useAlertMessage } from '@/constants/messageConstants';
import { object, string } from 'yup';
import ErrorMessage from '@/components/ErrorMessage';
import { isIOS } from '@/shared/devices';
import { saveProfile } from '@/redux/createProfile/actions';
import { useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';

const initialValues = {
  birthday: '',
  hideAge: false,
};

export function CreateBirthdayScreen(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const alertMessage = useAlertMessage();

  const validationSchema = object().shape({
    birthday: string()
      .trim()
      .required(alertMessage.EMPTY_FIELD)
      .test('checkLengthOne', alertMessage.EMPTY_FIELD, value => {
        return !(value === undefined || value === '' || value.length < 1);
      })
      .test('checkLengthTwo', language('birthday_not_valid'), value => {
        return !(value === undefined || value === '' || value.length < 8);
      })
      .test('timeBirthday', language('birthday_not_valid'), value => {
        if (value) {
          const dateObj = new Date();
          const month = dateObj.getMonth() + 1;
          const formatMonth = month < 10 ? `0${month}` : month;
          const day = String(dateObj.getDate()).padStart(2, '0');
          const year = dateObj.getFullYear();
          let currentDate = year + '-' + formatMonth + '-' + day;

          if (isIOS) {
            return moment(value, 'L').isBefore(moment());
          } else {
            const timeInput = new Date(moment(value, 'L').format('YYYY-MM-DD'));
            const currentTime = new Date(currentDate);
            return timeInput < currentTime;
          }
        } else {
          return false;
        }
      })
      .test('ageRestriction', language('ageRestrictionErrorMessage'), value => {
        const age = moment().diff(moment(value, 'L'), 'years', true);
        return age >= 18;
      })
      .test('ageRestriction2', language('birthday_not_valid'), value => {
        const age = moment().diff(moment(value, 'L'), 'years', true);
        return age <= 100;
      }),
  });

  const onContinue = (value: FormikValues) => {
    const { birthday, hideAge } = value;

    const date = new Date(moment(birthday, 'L').format('YYYY-MM-DD')).toISOString();
    dispatch(
      saveProfile({
        dateOfBirth: date,
        hideAge,
      }),
    );
    navigation.navigate(CREATE_SEX_SCREEN);
  };

  const onHideKeyboard = () => {
    Keyboard.dismiss();
  };

  const birthdayInputIOS = () => {
    return (
      <Formik validateOnChange={false} initialValues={initialValues} onSubmit={onContinue} validationSchema={validationSchema}>
        {({ handleSubmit, errors, setFieldValue, setFieldError }) => {
          return (
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              extraScrollHeight={100}
              scrollEnabled={false}
              extraHeight={200}
            >
              <View style={styles.wrapBody}>
                <Pressable onPressOut={onHideKeyboard} style={styles.wrapTextInput}>
                  <CreateBirthdayInput setFieldError={setFieldError} setFieldValue={setFieldValue} />
                  <ErrorMessage errorValue={errors.birthday} />
                </Pressable>

                <CustomButton onPress={handleSubmit} containerStyle={styles.btnContinue} text={language('continue')} />
              </View>
            </KeyboardAwareScrollView>
          );
        }}
      </Formik>
    );
  };

  const birthdayInputAndroid = () => {
    return (
      <KeyboardAvoidingView keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })} style={styles.container}>
        <Formik validateOnChange={false} initialValues={initialValues} onSubmit={onContinue} validationSchema={validationSchema}>
          {({ handleSubmit, errors, setFieldValue, setFieldError }) => {
            return (
              <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
                <View style={styles.wrapBody}>
                  <Pressable onPressOut={onHideKeyboard} style={styles.wrapTextInput}>
                    <CreateBirthdayInput handleSubmit={handleSubmit} setFieldError={setFieldError} setFieldValue={setFieldValue} />
                    <ErrorMessage errorValue={errors.birthday} />
                  </Pressable>

                  <CustomButton onPress={handleSubmit} containerStyle={styles.btnContinue} text={language('continue')} />
                </View>
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
      <CustomWrapHeader title={language('myBirthday')} titleStyle={styles.txtTitle} />
      {isIOS ? birthdayInputIOS() : birthdayInputAndroid()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  wrapTextInput: {
    paddingHorizontal: 15,
    marginTop: 30,
  },
  btnContinue: {
    alignSelf: 'center',
    backgroundColor: colors.red_700,
    paddingVertical: 13,
    marginTop: 48,
    width: 250,
    borderRadius: 36,
  },
  wrapBody: {
    flex: 1,
  },
  txtTitle: {
    fontSize: fonts.size.s22,
  },
});
