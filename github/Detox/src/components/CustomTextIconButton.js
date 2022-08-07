import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';

const styles = StyleSheet.create({
  buttonBack: {
    ...HELPERS.row,
    paddingHorizontal: 8,
    borderColor: COLORS.GRAY_BUTTON_TITLE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: 5,
    justifyContent: 'center',
    alignContent: 'center',
  },
  title: {
    ...FONTS.regular,
    color: COLORS.GRAY_BUTTON_TITLE,
    alignSelf: 'center',
    fontSize: 14,
  },
  icon: {
    alignSelf: 'center',
    tintColor: COLORS.GRAY_BUTTON_TITLE,
  },
});
const CustomTextIconButton = ({style, onPress, title, image, hitSlop, sizeStyle, textStyle}) => {
  return (
    <TouchableOpacity style={[styles.buttonBack, style]} onPress={onPress} hitSlop={hitSlop}>
      <Text style={[styles.title, textStyle]}>{title}</Text>
      <Image source={image} style={[styles.icon, sizeStyle]} />
    </TouchableOpacity>
  );
};

CustomTextIconButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string.isRequired,
};

CustomTextIconButton.defaultProps = {
  onPress: () => {},
  sizeStyle: {},
  textStyle: {},
};

export default CustomTextIconButton;
