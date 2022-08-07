import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {IMAGES} from '../assets/images';
import {COLORS} from '../assets/theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  separator: {
    flex: 1,
  },
  logo: {
    height: 68,
  },
  wave: {
    width: '100%',
  },
});

const LaunchBackgroundComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <Image style={styles.logo} resizeMode="contain" source={IMAGES.LOGO_APP} />
      <Image style={styles.wave} resizeMode="stretch" source={IMAGES.WAVE_BG} />
    </View>
  );
};

export default LaunchBackgroundComponent;
