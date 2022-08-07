import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {Extrapolate, interpolate, useAnimatedStyle} from 'react-native-reanimated';

import {CONSTANTS} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import {useHardwareBackPress} from '../hooks/useHardwareBackPress';
import Header from './Header';
import SafeAreaScreenContainer from './SafeAreaScreenContainer';

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  container: {
    ...HELPERS.fill,
    backgroundColor: COLORS.BACKGROUND,
  },
  shadowContainer: {position: 'absolute', right: 0, left: 0, bottom: -10, zIndex: 10},
});

const BaseAnimationScreen = ({
  title = translate(STRINGS.BACK),
  isBackable = true,
  showHeader = true,
  isFullScreen = false,
  rightComponent,
  leftComponent,
  children,
  titleProps,
  headerOptions = null,
  onBackPress,
  containerStyle = {},
  testID = '',
  modals,
  animation,
  customStyle,
  showHeaderShadow,
  customHeaderComponent,
  childAnimation,
  allowedHeaderAnimation,
  headerContainerHeight = CONSTANTS.HEADER_CONTAINER_HEIGHT,
}) => {
  const headerContainerAnimation = useAnimatedStyle(() => ({
    height: interpolate(
      childAnimation?.value,
      [0, headerContainerHeight],
      [headerContainerHeight, headerContainerHeight * 0.6],
      Extrapolate.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          childAnimation?.value,
          [0, headerContainerHeight],
          [1, -CONSTANTS.HEADER_HEIGHT],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));
  const headerContainer = allowedHeaderAnimation ? headerContainerAnimation : null;
  const headerCustomStyle = allowedHeaderAnimation ? {height: headerContainerHeight} : null;
  useHardwareBackPress(onBackPress);
  return isFullScreen ? (
    <View style={styles.container}>{children}</View>
  ) : (
    <SafeAreaScreenContainer testID={testID} style={[styles.safeArea, customStyle]}>
      <View style={[styles.container, containerStyle]}>
        {showHeader && (
          <Animated.View style={[headerContainer]}>
            <Animated.View
              style={[
                METRICS.horizontalPadding,
                HELPERS.zIndexView,
                {backgroundColor: COLORS.NEUTRAL_WHITE},
                headerCustomStyle,
              ]}>
              <Header
                animation={animation}
                childAnimation={childAnimation}
                enabledAnimation={allowedHeaderAnimation}
                onBackPress={onBackPress}
                leftTextProps={titleProps}
                leftText={title}
                isBackable={isBackable}
                leftComponent={leftComponent}
                rightComponent={rightComponent}
                {...headerOptions}
              />
              <View style={HELPERS.fill}>{customHeaderComponent}</View>
            </Animated.View>
          </Animated.View>
        )}
        {showHeaderShadow && (
          <View style={HELPERS.zIndexView}>
            <View style={styles.shadowContainer}>
              <LinearGradient
                colors={[COLORS.BLACK_OPACITY_01, COLORS.TRANSPARENT_OPACITY]}
                style={[commonStyles.separatorRow12, {backgroundColor: COLORS.TRANSPARENT}]}
              />
            </View>
          </View>
        )}
        {children}
      </View>
      {modals}
    </SafeAreaScreenContainer>
  );
};

export default BaseAnimationScreen;
