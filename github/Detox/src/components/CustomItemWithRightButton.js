import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {CONSTANTS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS, small} from '../assets/theme/metric';
import CustomIconButton from './CustomIconButton';

const styles = StyleSheet.create({
  iconContainer: {
    width: CONSTANTS.ITEM_HEIGHT,
    height: CONSTANTS.ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBackground: {
    ...HELPERS.rowSpaceBetweenCenter,
    ...METRICS.resetPaddingHorizontal,
    paddingVertical: SIZES.MARGIN_2,
    width: '48%',
    backgroundColor: COLORS.NEUTRAL_DISABLE,
    borderRadius: 16,
    overflow: 'hidden',
    paddingEnd: 2,
    paddingStart: small,
  },
  defaultTitleStyle: {
    flex: 1,
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    paddingStart: Platform.OS === 'android' ? small : 0,
  },
});

const IconComponent = ({onPress, hitSlop}) => {
  return (
    <CustomIconButton
      style={styles.iconContainer}
      imageStyle={styles.icon}
      onPress={onPress}
      iconName={'md-close'}
      iconColor={COLORS.TEXT_DARK_10}
      hitSlop={hitSlop}
    />
  );
};

const CustomItemWithRightButton = ({
  title,
  style,
  imageSource,
  disabled = false,
  onPress,
  onRightIconClick,
  hitSlop = CONSTANTS.HIT_SLOP,
  titleStyle,
}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.itemBackground, style]}>
      <Text numberOfLines={1} style={[styles.defaultTitleStyle, titleStyle]}>
        {title}
      </Text>
      <IconComponent imageSource={imageSource} onPress={onRightIconClick} hitSlop={hitSlop} />
    </TouchableOpacity>
  );
};

CustomItemWithRightButton.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
  onPress: PropTypes.func,
  onRightIconClick: PropTypes.func,
  titleStyle: PropTypes.object,
  hitSlop: PropTypes.object,
};

CustomItemWithRightButton.defaultProps = {
  title: '',
  style: {},
  titleStyle: {},
  onPress: () => {},
  onRightIconClick: () => {},
  hitSlop: {},
};

export default CustomItemWithRightButton;
