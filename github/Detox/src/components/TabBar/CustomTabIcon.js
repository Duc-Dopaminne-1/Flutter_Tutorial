import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {DotMessage} from '../Badge';

const CustomTabIcon = ({label, iconName, focused}) => {
  const focusedStyle = focused ? styles.activateTab : styles.deactivateTab;

  switch (label) {
    case STRINGS.PLUS:
      return (
        <View style={styles.moreContainer}>
          <Image source={iconName} />
        </View>
      );
    case STRINGS.MESSAGE:
      return (
        <View style={styles.container}>
          <Image source={iconName} style={focusedStyle} />
          <DotMessage />
        </View>
      );
    default:
      return (
        <View style={styles.container}>
          <Image source={iconName} style={focusedStyle} />
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  moreContainer: {
    top: -8,
  },
  activateTab: {
    tintColor: COLORS.PRIMARY_A100,
  },
  deactivateTab: {
    tintColor: COLORS.TEXT_DARK_40,
  },
});

export default CustomTabIcon;
