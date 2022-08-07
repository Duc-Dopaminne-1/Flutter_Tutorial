import React from 'react';
import { StyleSheet, Text, Pressable, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Formik, FormikValues } from 'formik';
import { object, string } from 'yup';

import { TextInputComponent } from '@/components/TextInput';
import { colors, fonts } from '@/vars';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import { isIOS } from '@/shared/devices';

interface FormValues extends FormikValues {
  instagramUsername: string;
}

interface EditInstagramUsernameFormProps {
  initialValues: FormValues;
  onSubmit: (values) => void;
}

const schemaValidation = object().shape({
  instagramUsername: string().trim(),
});

const EditInstagramUsernameForm: React.FC<EditInstagramUsernameFormProps> = ({ initialValues, onSubmit }) => {
  return (
    <Formik validateOnChange={false} initialValues={initialValues} onSubmit={onSubmit} validationSchema={schemaValidation}>
      {({ values, handleSubmit, errors, setFieldValue }) => {
        return (
          <KeyboardAvoidingView behavior={isIOS ? 'padding' : null} style={styles.wrapper}>
            <Pressable onPress={Keyboard.dismiss} style={styles.container}>
              <Text style={styles.textTitle}>{language('profileGeneral.igUsername')}</Text>
              <TextInputComponent
                styleContainerConfig={styles.wrapInput}
                value={values.instagramUsername}
                onChangeText={value => setFieldValue('instagramUsername', value)}
                placeholderTextColor={colors.bg_tab}
                styleConfig={styles.textInput}
                styleFormConfig={styles.wrapFormInput}
                placeholder={language('profileGeneral.enterUsername')}
                isError={!!errors.instagramUsername}
                errorText={errors.instagramUsername}
              />
            </Pressable>
            <CustomButton
              onPress={handleSubmit}
              containerStyle={styles.buttonSave}
              text={language('save')}
              textStyle={styles.buttonTitle}
            />
          </KeyboardAvoidingView>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 15,
  },
  container: {
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
  wrapInput: {},
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
    marginBottom: 50,
  },
  buttonTitle: {
    fontWeight: '400',
  },
});

export default EditInstagramUsernameForm;
