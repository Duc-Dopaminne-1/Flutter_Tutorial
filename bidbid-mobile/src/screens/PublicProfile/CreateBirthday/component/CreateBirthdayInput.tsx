import React, { useRef, useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { colors, fonts } from '@/vars';
import { isIOS } from '@/shared/devices';
import { FormikValues } from 'formik';
import { TextInputComponent } from '@/components/TextInput';
import { dateFormatByLocale, language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';

function CreateBirthdayInput({ setFieldValue, setFieldError, handleSubmit }: FormikValues) {
  const inputRef = useRef(null);
  const [isSelected, setSelection] = useState(false);
  const locale = useSelector((state: RootState) => state.app.locale);
  const onChangeText = (text: string) => {
    if (
      dateFormatByLocale.MDY.includes(locale) &&
      text &&
      parseInt(text.charAt(0)) > 1 &&
      parseInt(text.charAt(0)) < 10 &&
      text.length < 4
    ) {
      text = [text.slice(0, 0), '0', text.slice(0)].join('') + '/';
      inputRef.current?.setNativeProps({ text });
    }
    if (
      dateFormatByLocale.DMY.includes(locale) &&
      text &&
      parseInt(text.charAt(3)) > 1 &&
      parseInt(text.charAt(3)) < 10 &&
      text.length < 5
    ) {
      text = [text.slice(0, 3), '0', text.slice(3)].join('') + '/';
      inputRef.current?.setNativeProps({ text });
    }
    setFieldValue('birthday', text);
  };

  const onPressCheckBox = () => {
    setSelection(!isSelected);
    setFieldValue('hideAge', !isSelected);
  };

  const onFocus = () => {
    setFieldError && setFieldError('birthday', '');
  };

  return (
    <>
      <TextInputComponent
        inputRef={ref => {
          inputRef.current = ref;
        }}
        styleContainerConfig={styles.wrapInput}
        mask={'[00]{/}[00]{/}[0000]'}
        placeholder={dateFormatByLocale.MDY.includes(locale) ? 'MM / DD / YYYY' : 'DD / MM / YYYY'}
        styleFormConfig={styles.textInput}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmit}
        onFocus={onFocus}
        keyboardType={isIOS ? 'number-pad' : 'numeric'}
        returnKeyType={'done'}
        autoFocus
      />
      <Pressable onPress={onPressCheckBox} style={styles.checkboxWrapper}>
        <CheckBox boxType={'square'} value={isSelected} style={styles.checkbox} />
        <DefaultText numberOfLines={3} {...{ style: styles.checkboxText }}>
          {language('hideBirthday')}
        </DefaultText>
      </Pressable>
    </>
  );
}

export default React.memo(CreateBirthdayInput);

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: colors.gray_line_beta,
    paddingBottom: 10,
    paddingVertical: 0,
  },
  wrapInput: {
    borderColor: colors.red_700,
  },
  checkboxText: {
    fontSize: fonts.size.s16,
    color: colors.gray_500,
    fontFamily: fonts.family.RobotoRegular,
    flexGrow: 1,
    flex: 1,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    flexGrow: 1,
  },
  checkbox: {
    height: 16,
    width: 16,
    marginRight: 15,
    marginLeft: -5,
  },
});
