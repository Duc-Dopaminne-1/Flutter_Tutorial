import React, { ReactElement, useCallback, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Pressable, Keyboard, Text, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik, FormikValues } from 'formik';
import { object, string } from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TextInputComponent } from '@/components/TextInput';
import { colors, fonts, screenWidth } from '@/vars';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import { isIOS } from '@/shared/devices';
import CustomHeader from '@/components/CustomHeader';
import { SafeArea } from '@/components/SafeArea';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import { requestCharity } from '@/shared/global';
import NavigationActionsService from '@/navigation/navigation';
import { requestAdditionalCharity } from '@/redux/auction/actions';
import { MapSearch } from '@/screens/Map/component/MapSearch';
import ErrorMessage from '@/components/ErrorMessage';
import IconBack from '@/components/SVG/BackSvg';

interface CharityFormValues extends FormikValues {
  charityName: string;
  headquartersAddress: string;
}

const initialValues: CharityFormValues = {
  charityName: '',
  headquartersAddress: '',
};

function RequestAdditionalCharityScreen(): ReactElement {
  const dispatch = useDispatch();
  const inputRef = useRef<ScrollView>(null);
  const { bottom } = useSafeAreaInsets();

  useEnableHardwareBackButton();

  const schemaValidation = object().shape({
    charityName: string().trim().required(language('alertMessage.EMPTY_FIELD')),
    headquartersAddress: string().trim().required(language('alertMessage.EMPTY_FIELD')),
  });

  const handleSubmitCharity = useCallback((values: CharityFormValues) => {
    Keyboard.dismiss();
    NavigationActionsService.showLoading();
    dispatch(
      requestAdditionalCharity({
        charityName: values.charityName,
        headquartersAddress: values.headquartersAddress,
        onSuccess: result => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.goBack();
          setTimeout(() => {
            requestCharity.next(result);
          }, 500);
        },
        onFail: () => {
          NavigationActionsService.hideLoading();
        },
      }),
    );
  }, []);

  const onPressSearch = (location: any, setFieldValue: any) => {
    setFieldValue('headquartersAddress', location.description);
  };

  const renderBody = () => {
    return (
      <Formik validateOnChange={false} initialValues={initialValues} onSubmit={handleSubmitCharity} validationSchema={schemaValidation}>
        {({ values, handleSubmit, errors, setFieldValue }) => {
          return (
            <View style={styles.formWrapper}>
              <ScrollView
                ref={inputRef}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <Pressable onPress={Keyboard.dismiss} style={styles.formContainer}>
                  <Text style={styles.textTitle}>{language('charityNameLabel')}</Text>
                  <TextInputComponent
                    styleContainerConfig={styles.wrapInput}
                    value={values.charityName}
                    onChangeText={value => setFieldValue('charityName', value)}
                    placeholderTextColor={colors.bg_tab}
                    styleConfig={styles.textInput}
                    styleFormConfig={styles.wrapFormInput}
                    placeholder={language('charityNamePlaceholder')}
                    isError={!!errors.charityName}
                    errorText={errors.charityName}
                  />
                  <Text style={styles.textTitle}>{language('address')}</Text>

                  <MapSearch
                    placeholder={language('headquartersAddress')}
                    onPressSearch={(location: any, _address: any) => onPressSearch(location, setFieldValue)}
                    containerStyle={styles.wrapInputSearchContainer}
                    wrapInputStyle={styles.wrapInputSearch}
                    inputStyle={styles.inputSearch}
                    placeholderTextColor={colors.bg_tab}
                    onChangeText={value => {
                      setFieldValue('headquartersAddress', value);
                      setTimeout(() => {
                        onShowKeyboard();
                      }, 700);
                    }}
                  />
                  <ErrorMessage errorValue={errors.headquartersAddress} />
                </Pressable>
              </ScrollView>
              <CustomButton
                onPress={handleSubmit}
                containerStyle={[styles.buttonSave, { marginBottom: 15 + bottom }]}
                text={language('submit')}
                textStyle={styles.buttonTitle}
              />
            </View>
          );
        }}
      </Formik>
    );
  };

  const onShowKeyboard = () => {
    inputRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <View style={styles.wrapperHeader}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={styles.title} title={language('requestAdditionalCharity')} />
      </View>

      <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={styles.container}>
        {renderBody()}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapperHeader: {
    marginBottom: 20,
  },
  title: {
    fontSize: fonts.size.s16,
  },

  formWrapper: {
    flex: 1,
    paddingHorizontal: 15,
  },
  formContainer: {
    flex: 1,
    flexGrow: 1,
  },
  textTitle: {
    fontSize: fonts.size.s16,
    fontWeight: '500',
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  },
  textInput: {
    color: colors.black,
    fontSize: fonts.size.s17,
  },
  wrapInput: {
    marginBottom: 20,
  },
  wrapFormInput: {
    height: 42,
    paddingBottom: 0,
    borderRadius: 10,
    marginTop: 14,
    borderWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    borderColor: colors.placeholder_gray,
    borderBottomColor: colors.placeholder_gray,
  },
  buttonSave: {
    width: null,
    marginTop: 20,
  },
  buttonTitle: {
    fontWeight: '400',
  },
  wrapInputSearchContainer: {
    position: null,
    paddingVertical: 0,
    top: 14,
    marginBottom: 15,
  },
  wrapInputSearch: {
    marginTop: 0,
    width: screenWidth - 30,
    borderColor: colors.placeholder_gray,
    borderWidth: 1,
  },
  inputSearch: {
    height: 42,
    color: colors.black,
    fontSize: fonts.size.s17,
    fontFamily: fonts.family.PoppinsRegular,
  },
});

export default RequestAdditionalCharityScreen;
