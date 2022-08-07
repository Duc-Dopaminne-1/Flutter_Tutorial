import React from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/vars';
import { language } from '@/i18n';
import { TextInputComponent } from '@/components/TextInput';
import CustomButton from '@/components/CustomButton';
import ErrorMessage from '@/components/ErrorMessage';

function CreateFirstNameForMik({ onCreateFirstName, setFieldValue, errors, setFieldError }: any) {
  const onHideKeyboard = () => {
    Keyboard.dismiss();
  };

  const onFocus = () => {
    setFieldError('firstName', '');
    setFieldError('lastName', '');
  };

  const onChangeTextFirstName = (text: string) => {
    setFieldValue('firstName', text);
  };

  const onChangeTextLastName = (text: string) => {
    setFieldValue('lastName', text);
  };

  return (
    <View style={styles.container}>
      <Pressable onPressOut={onHideKeyboard} style={styles.wrapTextInput}>
        <TextInputComponent
          styleFormConfig={styles.textInput}
          onChangeText={onChangeTextFirstName}
          onFocus={onFocus}
          maxLength={15}
          onSubmitEditing={onCreateFirstName}
          placeholder={language('firstName')}
          returnKeyType="done"
          autoFocus
        />

        <TextInputComponent
          styleFormConfig={styles.textInputLastName}
          onChangeText={onChangeTextLastName}
          onFocus={onFocus}
          maxLength={15}
          onSubmitEditing={onCreateFirstName}
          placeholder={language('lastName')}
          returnKeyType="done"
        />
        <ErrorMessage errorValue={errors ? errors.firstName || errors.lastName : ''} />
      </Pressable>
      <CustomButton onPress={onCreateFirstName} containerStyle={styles.btnContinue} text={language('continue')} />
    </View>
  );
}

export default React.memo(CreateFirstNameForMik);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  textInput: {
    height: 40,
  },
  textInputLastName: {
    height: 40,
    marginTop: 20,
  },
  wrapTextInput: {
    justifyContent: 'center',
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
});
