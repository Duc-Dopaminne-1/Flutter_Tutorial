import React, { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/vars';
import { language } from '@/i18n';
import { TextInputComponent } from '@/components/TextInput';
import CustomButton from '@/components/CustomButton';
import ErrorMessage from '@/components/ErrorMessage';

function CreateInstagramUsernameForMik({ onCreateInstagramUsername, setFieldValue, errors, setFieldError }: any) {
  const [instagramUsername, setInstagramUsername] = useState('');

  const onHideKeyboard = () => {
    Keyboard.dismiss();
  };

  const onFocus = () => {
    setFieldError('instagramUsername', '');
  };

  const onChangeText = (text: string) => {
    setInstagramUsername(text);
    setFieldValue('instagramUsername', text);
  };

  return (
    <View style={styles.container}>
      <Pressable onPressOut={onHideKeyboard} style={styles.wrapTextInput}>
        <TextInputComponent
          styleFormConfig={styles.textInput}
          onChangeText={onChangeText}
          value={instagramUsername}
          onFocus={onFocus}
          onSubmitEditing={onCreateInstagramUsername}
          placeholder={language('instagramUsername')}
          returnKeyType="done"
          autoFocus
        />
        <ErrorMessage errorValue={errors ? errors.instagramUsername : ''} />
      </Pressable>
      <CustomButton onPress={onCreateInstagramUsername} containerStyle={styles.btnContinue} text={language('continue')} />
    </View>
  );
}

export default React.memo(CreateInstagramUsernameForMik);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  textInput: {
    height: 40,
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
