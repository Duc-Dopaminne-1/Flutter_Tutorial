import React from 'react';
import { View, StatusBar, StyleSheet, Platform } from 'react-native';
import DeviceInfos from 'react-native-device-info';
import { isIOS } from '@/shared/devices';
import { colors } from '@/vars';

const SafeArea = ({ backgroundColor = colors.black, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor: isIOS ? colors.white : colors.black }]}>
    <StatusBar backgroundColor={backgroundColor} translucent {...props} barStyle={isIOS ? 'dark-content' : 'light-content'} />
  </View>
);

export { SafeArea };

export const STATUSBAR_HEIGHT = Platform.select({
  ios: DeviceInfos.hasNotch() ? 45 : 25,
  android: StatusBar.currentHeight,
});

const styles = StyleSheet.create({
  statusBar: {
    width: '100%',
    height: STATUSBAR_HEIGHT,
    zIndex: 999,
  },
});
