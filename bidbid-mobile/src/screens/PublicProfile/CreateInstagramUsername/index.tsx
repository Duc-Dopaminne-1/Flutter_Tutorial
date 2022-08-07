import React, { ReactElement, useCallback, useEffect, useMemo } from 'react';
import { BackHandler, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Formik, FormikValues } from 'formik';
import { object, string } from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { SafeArea } from '@/components/SafeArea';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import { CREATE_BIRTHDAY_SCREEN } from '@/navigation/screenKeys';
import { isIOS } from '@/shared/devices';
import { saveProfile } from '@/redux/createProfile/actions';
import CreateInstagramUsernameForMik from '@/screens/PublicProfile/CreateInstagramUsername/component/CreateInstagramUsernameFormik';
import DefaultText from '@/components/CustomText/DefaultText';

const initialValues = {
  instagramUsername: '',
};

const validationSchema = object().shape({
  instagramUsername: string().trim(),
});

export function CreateInstagramUsernameScreen(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => BackHandler.removeEventListener('hardwareBackPress', () => true);
  }, []);

  const onContinue = (value: FormikValues) => {
    const { instagramUsername } = value;
    dispatch(
      saveProfile({
        instagramUsername,
      }),
    );
    Keyboard.dismiss();
    setTimeout(() => {
      navigation.navigate(CREATE_BIRTHDAY_SCREEN);
    }, 200);
  };

  const onSkip = useCallback(() => {
    navigation.navigate(CREATE_BIRTHDAY_SCREEN);
  }, [navigation]);

  const instagramUsernameInputIOS = () => {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        extraScrollHeight={100}
        scrollEnabled={false}
        extraHeight={230}
      >
        <Formik initialValues={initialValues} validateOnChange={false} onSubmit={onContinue} validationSchema={validationSchema}>
          {({ handleSubmit, errors, setFieldValue, setFieldError }) => {
            return (
              <CreateInstagramUsernameForMik
                setFieldError={setFieldError}
                setFieldValue={setFieldValue}
                errors={errors}
                onCreateInstagramUsername={handleSubmit}
              />
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    );
  };

  const instagramUsernameInputAndroid = () => {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={-500}>
        <Formik validateOnChange={false} initialValues={initialValues} onSubmit={onContinue} validationSchema={validationSchema}>
          {({ handleSubmit, errors, setFieldValue, setFieldError }) => {
            return (
              <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
                <CreateInstagramUsernameForMik
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  onCreateInstagramUsername={handleSubmit}
                />
              </ScrollView>
            );
          }}
        </Formik>
      </KeyboardAvoidingView>
    );
  };

  const renderSkipText = useMemo(() => {
    return <DefaultText style={styles.skipText}>{language('skip')}</DefaultText>;
  }, []);

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomWrapHeader
        title={language('myInstagramUsername')}
        titleStyle={styles.txtTitle}
        subButtonText={renderSkipText}
        onPressSubIcon={onSkip}
      />
      {isIOS ? instagramUsernameInputIOS() : instagramUsernameInputAndroid()}
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
  skipText: {
    color: colors.blue_700,
    fontSize: fonts.size.s16,
    marginHorizontal: 15,
  },
});
