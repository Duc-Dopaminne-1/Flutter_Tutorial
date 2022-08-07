import React, { useRef } from 'react';
import { StyleSheet, Pressable, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Formik, FormikValues } from 'formik';
import { object, string } from 'yup';

import { TextInputComponent } from '@/components/TextInput';
import { colors, fonts } from '@/vars';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import { isIOS } from '@/shared/devices';

interface FormValues extends FormikValues {
  firstName: string;
  lastName: string;
}

interface EditMyNamFormProps {
  initialValues: FormValues;
  onSubmit: (values) => void;
}

const EditMyNamForm: React.FC<EditMyNamFormProps> = ({ initialValues, onSubmit }) => {
  const formikRef = useRef(null);
  const schemaValidation = object().shape({
    firstName: string().trim().required(language('alertMessage.EMPTY_FIELD')),
    lastName: string().trim().required(language('alertMessage.EMPTY_FIELD')),
  });

  const handleOnSubmit = values => {
    const { firstName, lastName } = values;
    let isError = false;
    [...firstName.trim()].map(item => {
      if (!!item.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/)) {
        isError = true;
        formikRef.current?.setFieldError('firstName', language('errorMessage.invalidName'));
      }
    });
    [...lastName.trim()].map(item => {
      if (!!item.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/)) {
        isError = true;
        isError = true;
        formikRef.current?.setFieldError('lastName', language('errorMessage.invalidName'));
      }
    });
    if (!isError) {
      onSubmit && onSubmit(values);
    }
  };

  const onFocus = () => {
    formikRef.current?.setFieldError('firstName', '');
    formikRef.current?.setFieldError('lastName', '');
  };

  return (
    <Formik
      innerRef={formikRef}
      validateOnChange={false}
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      validationSchema={schemaValidation}
    >
      {({ values, handleSubmit, errors, setFieldValue }) => {
        return (
          <KeyboardAvoidingView behavior={isIOS ? 'padding' : null} style={styles.wrapper}>
            <Pressable onPress={Keyboard.dismiss} style={styles.container}>
              <TextInputComponent
                onFocus={onFocus}
                styleContainerConfig={styles.wrapInput}
                value={values.firstName}
                maxLength={15}
                onChangeText={value => setFieldValue('firstName', value)}
                placeholderTextColor={colors.bg_tab}
                styleConfig={styles.textInput}
                styleFormConfig={styles.wrapFormInput}
                placeholder={language('firstName')}
                autoFocus
              />
              <TextInputComponent
                onFocus={onFocus}
                styleContainerConfig={styles.wrapInput}
                value={values.lastName}
                onChangeText={value => setFieldValue('lastName', value)}
                placeholderTextColor={colors.bg_tab}
                maxLength={15}
                styleConfig={styles.textInput}
                styleFormConfig={styles.wrapFormInput}
                placeholder={language('lastName')}
                isError={!!errors.lastName || !!errors.firstName}
                errorText={errors.lastName || errors.firstName}
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
  textInput: {
    color: colors.black,
    fontSize: fonts.size.s17,
  },
  wrapInput: {},
  wrapFormInput: {
    height: 42,
    marginTop: 20,
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

export default EditMyNamForm;
