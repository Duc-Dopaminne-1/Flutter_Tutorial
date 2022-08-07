import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View, ViewPropTypes} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    ...FONTS.regular,
    flex: 1,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 5,
    textAlign: 'center',
    fontSize: 24,
    color: COLORS.TEXT_DARK_10,
    marginRight: 5,
  },
});

const OTPTextView = ({
  defaultValue,
  cellTextLength,
  inputCount,
  handleTextChange,
  containerStyle,
  textInputStyle,
  offTintColor,
  tintColor,
  autoFocus = true,
  ...textInputProps
}) => {
  const [focusedInput, setFocusedInput] = useState(0);
  const [otpText] = useState(
    defaultValue.match(new RegExp('.{1,' + cellTextLength + '}', 'g')) ?? [],
  );
  const [inputs] = useState([]);

  const onTextChange = (text, i) => {
    otpText[i] = text;
    handleTextChange(otpText.join(''));
    if (text.length === cellTextLength && i !== inputCount - 1) {
      inputs[i + 1].focus();
    }
  };

  useEffect(() => {
    if (autoFocus) {
      const timeout = setTimeout(() => {
        inputs[0].focus();
      }, 200);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [inputs, autoFocus]);

  const onInputFocus = i => {
    setFocusedInput(i);
  };

  const onKeyPress = (e, i) => {
    if (e.nativeEvent.key === 'Backspace' && i !== 0 && !otpText[i]) {
      inputs[i - 1].focus();
    }
  };

  const TextInputs = [];

  for (let i = 0; i < inputCount; i += 1) {
    let defaultChars = [];
    if (defaultValue) {
      defaultChars = defaultValue.match(new RegExp('.{1,' + cellTextLength + '}', 'g'));
    }
    const inputStyle = [styles.textInput, textInputStyle, {borderColor: offTintColor}];
    if (focusedInput === i) {
      inputStyle.push({borderColor: tintColor});
    }

    TextInputs.push(
      <TextInput
        ref={e => {
          inputs[i] = e;
        }}
        caretHidden
        key={i}
        defaultValue={defaultValue ? defaultChars[i] : ''}
        style={inputStyle}
        maxLength={cellTextLength}
        onFocus={() => onInputFocus(i)}
        onChangeText={text => onTextChange(text, i)}
        multiline={false}
        onKeyPress={e => onKeyPress(e, i)}
        {...textInputProps}
      />,
    );
  }
  return <View style={[styles.container, containerStyle]}>{TextInputs}</View>;
};

OTPTextView.propTypes = {
  defaultValue: PropTypes.string,
  cellTextLength: PropTypes.number,
  inputCount: PropTypes.number,
  handleTextChange: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  textInputStyle: Text.propTypes.style,
  offTintColor: PropTypes.string,
  tintColor: PropTypes.string,
};

OTPTextView.defaultProps = {
  defaultValue: '',
  cellTextLength: 1,
  inputCount: 4,
  handleTextChange: () => {},
  offTintColor: COLORS.NEUTRAL_BORDER,
  tintColor: COLORS.PRIMARY_A100,
};

export default OTPTextView;
