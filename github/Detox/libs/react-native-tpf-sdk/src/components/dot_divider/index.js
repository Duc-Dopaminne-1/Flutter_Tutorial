import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CUSTOM_COLOR } from '../../constants/colors';
import { SPACING } from '../../constants/size';
import { scale } from '../../utils/responsive';

const DotDivider = ({ color, height, width, style }) => {
  const styleLine = [
    styles.line,
    style,
    color ? { backgroundColor: color } : {},
    height ? { height } : {},
    width ? { width } : {}
  ];
  return <View style={styleLine} />;
};

export default DotDivider;

const styles = StyleSheet.create({
  line: {
    height: scale(1),
    borderRadius: 1,
    borderWidth: scale(1),
    borderColor: CUSTOM_COLOR.Gallery,
    borderStyle: 'dashed',
    marginHorizontal: SPACING.Medium
  }
});
