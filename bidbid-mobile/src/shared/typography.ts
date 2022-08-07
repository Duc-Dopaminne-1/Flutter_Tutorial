/*
 * Created by IntelliJ IDEA.
 * User: kavin
 * Date: Thu Apr 08 2021
 * Time: 17:08
 */
import { StyleSheet } from 'react-native';

export const FontWeight = {
  thin: '100' as any,
  ultraLight: '200' as any,
  light: '300' as any,
  regular: '400' as any,
  medium: '500' as any,
  semiBold: '600' as any,
  bold: '700' as any,
  heavy: '800' as any,
  black: '900' as any,
};

export const Typography = StyleSheet.create({
  headerBold: {
    fontSize: 22,
    fontWeight: FontWeight.regular,
  },
  title1: {
    fontSize: 20,
    fontWeight: FontWeight.regular,
  },
  title2: {
    fontSize: 18,
    fontWeight: FontWeight.regular,
  },
  textButtonMedium: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
  },
  textButtonLong: {
    fontSize: 16,
    fontWeight: FontWeight.regular,
  },
});
