import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated, {Extrapolate, interpolate, useAnimatedStyle} from 'react-native-reanimated';

import {BACK_ICON_FONT_SIZE, CONSTANTS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {IMAGES} from '../assets/images';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS, small} from '../assets/theme/metric';
import {useHardwareBackPress} from '../hooks/useHardwareBackPress';
import {ids} from '../screens/ids';
import {testProps} from '../utils/testProps';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.row,
    ...METRICS.verticalPadding,
    justifyContent: 'space-between',
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  leftContainer: {
    ...HELPERS.rowCenter,
    ...HELPERS.zIndexView,
    flex: 1,
  },
  rightContainer: {
    ...HELPERS.center,
  },
  backButtonContainer: {
    ...HELPERS.zIndexView,
    paddingEnd: 12,
    paddingVertical: small,
  },
  backButtonText: {
    ...FONTS.semiBold,
    fontSize: SIZES.FONT_24,
    flex: 1,
    color: COLORS.TEXT_DARK_10,
  },
});

const Header = ({
  leftText,
  leftTextStyle,
  leftIconContainerStyle,
  leftComponent,
  rightComponent,
  isBackable,
  leftTextProps,
  onBackPress,
  animation = false,
  containerStyle,
  enabledAnimation,
  childAnimation = false,
}) => {
  const {onBackPressHandler} = useHardwareBackPress(onBackPress);

  const projectSubInfo = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animation.value,
        [1, CONSTANTS.HEADER_HEIGHT],
        [1, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  if (enabledAnimation) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const containerAnimatedStyle = useAnimatedStyle(() => ({
      height: interpolate(
        childAnimation?.value,
        [0, CONSTANTS.HEADER_CONTAINER_HEIGHT],
        [CONSTANTS.HEADER_CONTAINER_HEIGHT, CONSTANTS.HEADER_CONTAINER_HEIGHT * 0.95],
        Extrapolate.CLAMP,
      ),
      opacity: interpolate(
        childAnimation?.value,
        [0, CONSTANTS.HEADER_HEIGHT],
        [1, 0],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            childAnimation?.value,
            [0, CONSTANTS.HEADER_CONTAINER_HEIGHT],
            [1, -CONSTANTS.HEADER_CONTAINER_HEIGHT],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }));
    return (
      <Animated.View style={[styles.container, containerStyle, containerAnimatedStyle]}>
        <View style={styles.leftContainer}>
          {!!isBackable && (
            <TouchableOpacity
              {...testProps(ids.common.backButton)}
              hitSlop={CONSTANTS.HIT_SLOP}
              style={[styles.backButtonContainer, leftIconContainerStyle]}
              onPress={onBackPressHandler}>
              <Image source={IMAGES.ARROW_LEFT_LINEAR} />
            </TouchableOpacity>
          )}
          {leftComponent}
          {!!leftText && (
            <Animated.Text
              {...leftTextProps}
              style={[styles.backButtonText, animation ? projectSubInfo : {}, leftTextStyle]}>
              {leftText}
            </Animated.Text>
          )}
        </View>
        <View style={styles.rightContainer}>{rightComponent}</View>
      </Animated.View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftContainer}>
        {!!isBackable && (
          <TouchableOpacity
            {...testProps(ids.common.backButton)}
            hitSlop={CONSTANTS.HIT_SLOP}
            style={[styles.backButtonContainer, leftIconContainerStyle]}
            onPress={onBackPressHandler}>
            <Image source={IMAGES.ARROW_LEFT_LINEAR} />
          </TouchableOpacity>
        )}
        {leftComponent}
        <Animated.Text
          {...leftTextProps}
          style={[styles.backButtonText, animation ? projectSubInfo : {}, leftTextStyle]}>
          {leftText || ''}
        </Animated.Text>
      </View>
      <View style={styles.rightContainer}>{rightComponent}</View>
    </View>
  );
};

Header.propTypes = {
  leftText: PropTypes.string,
  rightComponent: PropTypes.element,
  leftComponent: PropTypes.element,
  isBackable: PropTypes.bool,
  leftTextProps: PropTypes.object,
  leftIcon: PropTypes.string,
  leftIconSize: PropTypes.number,
  leftTextStyle: PropTypes.object,
  leftIconStyle: PropTypes.object,
  leftIconContainerStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  enabledAnimation: PropTypes.bool,
};

Header.defaultProps = {
  leftText: translate(STRINGS.BACK),
  rightComponent: null,
  leftComponent: null,
  isBackable: true,
  leftIcon: 'long-arrow-left',
  leftIconSize: BACK_ICON_FONT_SIZE,
  leftTextStyle: null,
  leftIconStyle: null,
  leftIconContainerStyle: null,
  containerStyle: null,
  enabledAnimation: false,
};

export default Header;
