import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';

const styles = StyleSheet.create({
  defaultStyle: {
    alignSelf: 'flex-start',
  },
  defaultTextStyle: disable => ({
    ...FONTS.bold,
    fontSize: 14,
    color: disable ? COLORS.TEXT_DARK_60 : COLORS.PRIMARY_A100,
    alignSelf: 'flex-start',
  }),
});

const LinkTextButton = ({
  style,
  disable = false,
  textStyle,
  title = 'Title',
  onPress,
  rightIcon,
}) => {
  return (
    <TouchableOpacity disabled={disable} style={[styles.defaultStyle, style]} onPress={onPress}>
      <Text style={[styles.defaultTextStyle(disable), textStyle]}>{title}</Text>
      {rightIcon}
    </TouchableOpacity>
  );
};

export default LinkTextButton;
