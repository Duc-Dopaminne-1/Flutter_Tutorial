import {StyleSheet} from 'react-native';

import {FONT_BOLD, FONT_REGULAR, FONT_SEMI_BOLD} from '../fonts';

export const FONTS = StyleSheet.create({
  bold: {
    fontFamily: FONT_BOLD,
    includeFontPadding: true, //to fix Android font height measuring
  },
  semiBold: {
    fontFamily: FONT_SEMI_BOLD,
    includeFontPadding: true, //to fix Android font height measuring
  },
  regular: {
    fontFamily: FONT_REGULAR,
    includeFontPadding: true, //to fix Android font height measuring
  },
  fontSize12: {
    fontSize: 12,
  },
  fontSize14: {
    fontSize: 14,
  },
  fontSize16: {
    fontSize: 16,
  },
  fontSize18: {
    fontSize: 18,
  },
  fontSize20: {
    fontSize: 20,
  },
  fontSize24: {
    fontSize: 24,
  },
  fontSize30: {
    fontSize: 30,
  },
  fontSize38: {
    fontSize: 38,
  },
  fontSize46: {
    fontSize: 46,
  },
  fontSize56: {
    fontSize: 56,
  },
  fontSize68: {
    fontSize: 68,
  },
  lineHeight18: {
    lineHeight: 18,
  },
  lineHeight20: {
    lineHeight: 20,
  },
  lineHeight21: {
    lineHeight: 21,
  },
  lineHeight22: {
    lineHeight: 22,
  },
  lineHeight24: {
    lineHeight: 24,
  },
  lineHeight28: {
    lineHeight: 28,
  },
  lineHeight32: {
    lineHeight: 32,
  },
  lineHeight46: {
    lineHeight: 46,
  },
  lineHeight54: {
    lineHeight: 54,
  },
  lineHeight64: {
    lineHeight: 64,
  },
  lineHeight76: {
    lineHeight: 76,
  },
});
