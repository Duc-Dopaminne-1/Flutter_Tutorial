import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CUSTOM_COLOR } from '../../constants/colors';
import { scale } from '../../utils/responsive';

const Divider = ({ color, height, width, style }) => {
  const styleLine = [
    styles.line,
    style,
    color ? { backgroundColor: color } : {},
    height ? { height } : {},
    width ? { width } : {}
  ];
  return <View style={styleLine} />;
};

export default Divider;

const styles = StyleSheet.create({
  line: {
    height: scale(1),
    backgroundColor: CUSTOM_COLOR.GalleryDark
  }
});
