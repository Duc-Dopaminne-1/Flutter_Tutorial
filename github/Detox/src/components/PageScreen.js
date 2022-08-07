import React from 'react';
import {StyleSheet} from 'react-native';

import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {normal} from '../assets/theme/metric';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    alignSelf: 'center',
  },
  leftIconContainerStyle: {
    paddingEnd: normal,
    paddingVertical: 0,
  },
  leftIconStyle: {
    marginTop: 0,
  },
  containerStyle: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
});

const PageScreen = ({
  title = translate(STRINGS.BACK),
  showHeaderShadow = false,
  rightComponent,
  children,
}) => {
  return (
    <BaseScreen
      title={title}
      rightComponent={rightComponent}
      containerStyle={styles.containerStyle}
      showHeaderShadow={showHeaderShadow}
      headerOptions={{
        leftTextStyle: styles.headerTitle,
        leftIconStyle: styles.leftIconStyle,
        leftIconContainerStyle: styles.leftIconContainerStyle,
        leftIcon: 'chevron-left',
        leftIconSize: 18,
      }}>
      {children}
    </BaseScreen>
  );
};

export default PageScreen;
