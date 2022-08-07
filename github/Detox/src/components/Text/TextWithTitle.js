import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {commonStyles} from '../../assets/theme/styles';

const TextWithTitle = ({label, value, style = {}, customStyleLabel, customStyleValue}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[commonStyles.blackText14, customStyleLabel]}>{label}</Text>
      <Text style={[styles.cellValue, customStyleValue]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...HELPERS.fill,
    ...HELPERS.mainCenter,
  },
  cellValue: {
    ...FONTS.semiBold,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
  },
});

export default TextWithTitle;
