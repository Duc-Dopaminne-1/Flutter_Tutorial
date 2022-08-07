import React from 'react';
import {Platform, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';

import {COLORS} from '../assets/theme/colors';

const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});

const Container = ({disableSafeArea, ...otherProps}) => {
  return disableSafeArea ? <View {...otherProps} /> : <SafeAreaView {...otherProps} />;
};

const SafeAreaScreenContainer = ({style, children, disableSafeArea = false, testID}) => {
  let containerPadding = {};
  if (Platform.OS === 'android' && !disableSafeArea) {
    containerPadding = {paddingTop: STATUS_BAR_HEIGHT};
  }
  return (
    <Container
      testID={testID}
      disableSafeArea={disableSafeArea}
      style={[styles.safeAreaStyle, style, containerPadding]}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor={COLORS.TRANSPARENT}
        animated
      />
      {children}
    </Container>
  );
};

export default SafeAreaScreenContainer;
