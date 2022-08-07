import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';

const styles = StyleSheet.create({
  errorText: {
    ...FONTS.regular,
    color: COLORS.STATE_ERROR,
    fontSize: SIZES.FONT_14,
  },
});
const ErrorText = ({errorText = '', textStyle}: {errorText: String, textStyle: Object}) => {
  return !!errorText && <Text style={[styles.errorText, textStyle]}>{errorText}</Text>;
};

export default ErrorText;
