import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View, ViewPropTypes} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';

import {CONSTANTS, MAX_LENGTH} from '../assets/constants';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {getColorStyleTextEditable} from '../utils/UiUtils';
import ErrorText from './ErrorText';

const styles = StyleSheet.create({
  textInput: {
    ...FONTS.regular,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    fontSize: 14,
    paddingVertical: CONSTANTS.INPUT_PADDING_VERTICAL,
    paddingLeft: CONSTANTS.INPUT_PADDING_HORIZONTAL,
  },
});

const InputFormatType = ({
  style,
  textInputStyle,
  error,
  alignTop,
  type,
  options,
  keyboardType,
  editable = true,
  maxLength = MAX_LENGTH.inputMoneyLenght,
  placeholder = '',
  ...textInputProps
}) => {
  const inputStyle = {...styles.textInput};
  const textColorStyle = getColorStyleTextEditable(editable);
  if (alignTop) {
    inputStyle.textAlignVertical = 'top';
  }
  return (
    <View style={style}>
      <TextInputMask
        style={[inputStyle, textColorStyle, textInputStyle]}
        autoCorrect={false}
        autoCapitalize="none"
        editable={editable}
        type={type}
        placeholder={placeholder}
        keyboardType={keyboardType}
        includeRawValueInChangeText={true}
        options={options}
        maxLength={maxLength}
        {...textInputProps}
      />
      <ErrorText errorText={error} />
    </View>
  );
};

InputFormatType.propTypes = {
  type: PropTypes.string,
  options: PropTypes.object,
  style: ViewPropTypes.style,
  textInputStyle: ViewPropTypes.style,
  error: PropTypes.string,
  alignTop: PropTypes.bool,
};

InputFormatType.defaultProps = {
  type: 'money',
  keyboardType: 'number-pad',
  options: {
    precision: 0,
    delimiter: ',',
    unit: '',
  },
};

export default InputFormatType;
