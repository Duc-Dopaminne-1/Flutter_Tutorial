import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, ViewPropTypes} from 'react-native';

import {IMAGES} from '../../assets/images';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import CustomButton from '../Button/CustomButton';

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: 5,
    marginTop: 8,
    paddingTop: 10,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.NEUTRAL_WHITE,
  },
  arrowRight: {
    tintColor: COLORS.NEUTRAL_WHITE,
    width: 20,
    height: 20,
    position: 'absolute',
    right: 10,
  },
});

const CustomButtonWithArrowRight = ({style, titleStyle, title = 'Title', onPress}) => {
  return (
    <CustomButton
      style={[styles.button, style]}
      titleStyle={[styles.title, titleStyle]}
      iconLeftStyle={styles.arrowRight}
      iconLeftSource={IMAGES.IC_CHEVRON_RIGHT}
      title={title}
      onPress={onPress}
    />
  );
};

CustomButtonWithArrowRight.propTypes = {
  style: ViewPropTypes.style,
  titleStyle: Text.propTypes.style,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

CustomButtonWithArrowRight.defaultProps = {
  title: '',
  onPress: () => {},
};

export default CustomButtonWithArrowRight;
