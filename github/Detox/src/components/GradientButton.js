import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    ...FONTS.bold,
    color: COLORS.NEUTRAL_WHITE,
  },
  linearGradient: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
    borderRadius: 3,
  },
});

const GradientButton = ({
  colors = [COLORS.TOP_GRADIENT_BUTTON, COLORS.BOTTOM_GRADIENT_BUTTON],
  style,
  titleStyle,
  title,
  linearGradientStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <LinearGradient colors={colors} style={[styles.linearGradient, linearGradientStyle]}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
