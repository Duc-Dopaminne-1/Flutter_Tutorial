import React, { useContext, useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import themeContext from '../../constants/theme/themeContext';
import { SubHead } from '..';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../constants/colors';
import { SPACING } from '../../constants/size';
import { translate } from '../../i18n';
import { scale } from '../../utils/responsive';

const selectText = createSelector(
  state => state.setting.lang,
  (_, children) => children,
  (_, children) => {
    return translate(children);
  }
);

const CustomTextInput = props => {
  const {
    title,
    noteTitle,
    value,
    styleCustomTextInput,
    styleTitle,
    styleTitleNote,
    styleTextInput,
    onChangeText,
    multiline,
    numberOfLines,
    editable = true,
    placeholder = '',
    errorText = '',
    disable = false,
    type = 'text',
    keyboardType,
    isMask = false,
    optionMask,
    maxLength = 150,
    translateTitle = false,
    translatePlaceholder = false,
    isRequired = false
  } = props;

  const ref = useRef();
  const placeholderTxt = useSelector(state => selectText(state, placeholder));
  const theme = useContext(themeContext);

  const stylePrimaryTextInput = {
    color: theme?.text?.primary,
    fontFamily: theme?.fonts?.REGULAR
  };
  return (
    <TouchableNativeFeedback
      onPress={() => {
        ref.current?.focus?.();
      }}>
      <View
        style={{
          ...styles.viewCustomTextInput,
          ...stylePrimaryTextInput,
          ...styleCustomTextInput
        }}>
        <View style={!disable ? null : { backgroundColor: CUSTOM_COLOR.ShuttleGray }}>
          <View style={styles.row}>
            <SubHead translate={translateTitle} style={[{ ...styles.textTitle, ...styleTitle }]}>
              {title}
            </SubHead>
            {isRequired ? <SubHead style={[{ ...styles.textTitle }]}>*</SubHead> : null}
            {noteTitle ? (
              <SubHead bold={false} style={[{ ...styles.textTitle, ...styleTitleNote }]}>
                {`${noteTitle}`}
              </SubHead>
            ) : null}
          </View>
          {!isMask ? (
            <TextInput
              ref={ref}
              multiline={multiline}
              numberOfLines={numberOfLines}
              editable={editable}
              style={{ ...styles.textInput, ...styleTextInput }}
              placeholderTextColor={theme?.text?.secondary}
              type={type}
              value={value}
              onChangeText={onChangeText}
              keyboardType={keyboardType ? keyboardType : 'default'}
              placeholder={translatePlaceholder ? placeholderTxt : placeholder}
              maxLength={maxLength}
            />
          ) : (
            <TextInputMask
              type="custom"
              options={{
                mask: optionMask ? optionMask : '9999999999-999'
              }}
              value={value}
              editable={editable}
              multiline={multiline}
              onChangeText={onChangeText}
              numberOfLines={numberOfLines}
              placeholderTextColor={theme?.text?.secondary}
              style={{ ...styles.textInput, ...styleTextInput }}
              placeholder={translatePlaceholder ? placeholderTxt : placeholder}
              keyboardType={keyboardType ? keyboardType : 'default'}
            />
          )}
        </View>
        {!disable ? (
          <View
            style={[
              styles.lineTextInput,
              errorText ? { backgroundColor: CUSTOM_COLOR.Flamingo } : null
            ]}
          />
        ) : null}
        {errorText ? <Text style={styles.errText}>{errorText}</Text> : null}
      </View>
    </TouchableNativeFeedback>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  textTitle: {
    marginTop: SPACING.Medium
  },
  textInput: {
    paddingVertical: 0,
    marginTop: SPACING.Normal,
    fontSize: FONT_SIZE.BodyText
  },
  lineTextInput: {
    height: scale(1),
    marginTop: SPACING.Normal,
    backgroundColor: CUSTOM_COLOR.Envy
  },
  viewCustomTextInput: {},
  errText: {
    marginTop: scale(4),
    textAlign: 'left',
    fontSize: FONT_SIZE.Small,
    color: TEXT_COLOR.Flamingo,
    lineHeight: LINE_HEIGHT.Small
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
