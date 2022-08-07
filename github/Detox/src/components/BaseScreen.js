import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
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
  shadowContainer: {position: 'absolute', right: 0, left: 0, height: 20},
});

const BaseScreen = ({
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
}) => {
  return isFullScreen ? (
    <View style={styles.container}>{children}</View>
  ) : (
    <SafeAreaScreenContainer testID={testID} style={[styles.safeArea, customStyle]}>
      <View style={[styles.container, containerStyle]}>
        {showHeader && (
          <>
            <View
              style={[
                METRICS.horizontalPadding,
                HELPERS.zIndexView,
                {backgroundColor: COLORS.NEUTRAL_WHITE},
              ]}>
              <Header
                animation={animation}
                onBackPress={onBackPress}
                leftTextProps={titleProps}
                leftText={title}
                isBackable={isBackable}
                leftComponent={leftComponent}
                rightComponent={rightComponent}
                {...headerOptions}
              />
            </View>
          </>
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

export default BaseScreen;
