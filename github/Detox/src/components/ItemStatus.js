import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {small, tiny} from '../assets/theme/metric';

const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: small,
    paddingVertical: tiny,
    marginTop: small,
  },
  title: {
    ...FONTS.regular,
    color: COLORS.NEUTRAL_WHITE,
    fontSize: 10,
  },
});
const ItemStatus = ({status, style, statusStyle}) => {
  return (
    <View style={[styles.container, statusStyle, style]}>
      <Text style={styles.title}>{status}</Text>
    </View>
  );
};

export default ItemStatus;
