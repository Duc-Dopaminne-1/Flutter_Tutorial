import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, small} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.colCenter,
    ...HELPERS.fill,
    ...METRICS.smallVerticalPadding,
    borderRadius: 4,
    marginRight: small,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.NEUTRAL_BORDER,
  },
  labelText: {
    ...FONTS.regular,
    fontSize: 13,
    color: COLORS.BLACK_33,
  },
  valueText: {
    ...FONTS.semiBold,
    fontSize: 15,
    color: COLORS.BLACK_33,
  },
});

const InfoCell = ({label, value, style, valueStyle}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.labelText}>{label}</Text>
      <Text style={[styles.valueText, valueStyle]}>{value}</Text>
    </View>
  );
};

export default InfoCell;
