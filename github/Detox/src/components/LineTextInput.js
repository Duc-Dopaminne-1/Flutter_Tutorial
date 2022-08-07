import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native';

import {MAX_LENGTH} from '../assets/constants';
import {translate} from '../assets/localize/index';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {getColorStyleTextEditable} from '../utils/UiUtils';
import RequiredStar from './RequiredStar';

const styles = StyleSheet.create({
  textInputStyle: {
    ...FONTS.regular,
    fontSize: 18,
    paddingTop: 3,
    paddingLeft: 1,
    paddingRight: 0,
    paddingBottom: 0,
    textAlign: 'left',
  },
  placeHolderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
  },
  placeHolderStyle: {
    color: COLORS.TEXT_DARK_40,
  },
  underlineStyle: {
    marginTop: 5,
    height: 1,
    alignSelf: 'stretch',
  },
  errorText: {
    paddingTop: 2,
    color: COLORS.STATE_ERROR,
    fontSize: 15,
    ...FONTS.regular,
  },
});

const LineTextInput = ({
  placeholder = '',
  isRequired,
  style,
  keyboardType = 'default',
  error = '',
  onChangeText = () => {},
  secureTextEntry = false,
  initialText = '',
  maxLength = MAX_LENGTH.default,
  editable = true,
  testID,
  ...textInputProps
}) => {
  const [value, setValue] = useState(initialText);
  const [focused, setFocused] = useState(false);

  let refTextInput;

  const onPressContainer = () => {
    refTextInput.focus();
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleChangeText = text => {
    // Make support of uncontrolled component
    setValue(text);
    onChangeText(text);
  };

  const textColorStyle = getColorStyleTextEditable(editable);

  return (
    <TouchableWithoutFeedback onPress={onPressContainer}>
      <View style={style}>
        <TextInput
          autoCorrect={false}
          autoCapitalize="none"
          ref={ref => (refTextInput = ref)}
          style={[styles.textInputStyle, textColorStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          value={value}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          editable={editable}
          {...textInputProps}
          testID={testID}
        />
        {!value && (
          <View style={styles.placeHolderContainer}>
            <Text style={[styles.textInputStyle, styles.placeHolderStyle]}>
              {placeholder} {isRequired && <RequiredStar />}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.underlineStyle,
            {
              backgroundColor: focused ? COLORS.PRIMARY_A100 : COLORS.TEXT_BLACK_UNDERLINE,
            },
          ]}
        />
        {error ? (
          <Text testID={`${testID}_errorText`} style={styles.errorText}>
            {translate(error)}
          </Text>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LineTextInput;
