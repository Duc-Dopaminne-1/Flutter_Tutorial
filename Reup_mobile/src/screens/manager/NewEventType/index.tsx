import React from 'react';
import {
  View, KeyboardAvoidingView, Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import Container from '@src/components/Container';
import translate from '@src/localize';
import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle } from '@src/utils';
import CustomSectionHeader from '@src/components/CustomSection';
import { upperCase } from 'lodash';
import { ADD_PLUS } from '@src/constants/icons';
import styles from './styles';
import { Formik } from 'formik';
import { object, string } from 'yup';
import { CustomButton } from '@src/components/CustomButton';
import CustomInput from '@src/components/CustomInput';
import ErrorMessage from '@src/components/ErrorMessage';

const NewEventType = () => {

  const onAddNewEventType = () => {
    // TODO: Handle API add new event type
  };

  const validationSchema = object().shape({
    title: string()
      .required(`${translate('new_event_type.event_type')} ${translate('error.required')}`)
  });

  const renderTaskTitle = (formikProps: any) => {
    return (
      <View style={{ flex: 1 }}>
        <CustomInput
          description={`${translate('new_event_type.event_type')}`}
          onChangeText={
            formikProps.handleChange('title')
          }
          returnKeyType="done"
          value={formikProps.values.title}
          onBlur={formikProps.handleBlur('title')}
        />
        <ErrorMessage errorValue={formikProps.touched.title && formikProps.errors.title} />
      </View>
    );
  };

  const renderInputFields = () => {
    return (
      <Formik
        initialValues={{
          title: '',
        }}
        onSubmit={onAddNewEventType}
        validationSchema={validationSchema}>
        {formikProps => (
          <View style={[styles.listContainer]}>
            <View style={styles.inputFormSubContainer}>
              {renderTaskTitle(formikProps)}
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton onPress={formikProps.handleSubmit} text={translate('new_event_type.submit_button')} style={styles.button} />
            </View>
          </View>
        )}
      </Formik>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <Container spaceBottom={true} title={translate('new_event_type.navigation_title')} isShowHeader={true}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <CustomSectionHeader
                style={styles.sectionHeader}
                title={upperCase(translate('new_event_type.section_title'))}
                icon={ADD_PLUS}
                styleIcon={styles.sectionIconStyle}
              />
              {renderInputFields()}
            </View>
          </TouchableWithoutFeedback>
        </Container>
      </KeyboardAvoidingView>
    </View>
  );
};
export default NewEventType;
