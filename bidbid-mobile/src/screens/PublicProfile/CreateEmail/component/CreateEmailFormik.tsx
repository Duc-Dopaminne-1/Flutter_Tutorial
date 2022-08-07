import React from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/vars';
import { language } from '@/i18n';
import { TextInputComponent } from '@/components/TextInput';
import CustomButton from '@/components/CustomButton';
import ErrorMessage from '@/components/ErrorMessage';

function CreateEmailForMik({ onCreateEmail, refInput, setFieldValue, errors, setFieldError }: any) {
  const onHideKeyboard = () => {
    Keyboard.dismiss();
  };

  const onFocus = () => {
    setFieldError('email', '');
  };

  const onChangeText = (text: string) => {
    setFieldValue('email', text);
  };

  return (
    <View style={styles.container}>
      <Pressable onPressOut={onHideKeyboard} style={styles.wrapTextInput}>
        <TextInputComponent
          refs={refInput}
          styleFormConfig={styles.textInput}
          onChangeText={onChangeText}
          onFocus={onFocus}
          keyboardType={'email-address'}
          onSubmitEditing={onCreateEmail}
          placeholder={language('email')}
          returnKeyType="done"
          autoFocus
        />
        <ErrorMessage errorValue={errors ? errors : ''} />
      </Pressable>

      <CustomButton onPress={onCreateEmail} containerStyle={styles.btnContinue} text={language('continue')} />
    </View>
  );
}

export default React.memo(CreateEmailForMik);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  wrapTextInput: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 30,
  },
  textInput: {
    height: 40,
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
