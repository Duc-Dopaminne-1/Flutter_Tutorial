import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';

export const Pagination = ({style, dotsLength, activeDotIndex, dotStyle}) => {
  return (
    <View style={[styles.container, style]}>
      {new Array(dotsLength).fill(null).map((_, index) => (
        <View key={index} style={[styles.dotStyle(activeDotIndex === index), dotStyle]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  dotStyle: active => ({
    width: 12,
    height: 12,
    borderRadius: SIZES.BORDER_RADIUS_100,
    backgroundColor: active ? COLORS.PRIMARY_B100 : COLORS.NEUTRAL_DIVIDER,
    marginHorizontal: 6,
  }),
});
