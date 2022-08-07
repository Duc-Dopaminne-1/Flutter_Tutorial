import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.TEXT_DARK_40,
    textAlign: 'center',
  },
});

const CenterText = ({containerStyle, loading = false, title}) => {
  let message = '';
  if (title) {
    message = title;
  } else {
    message = !loading ? translate(STRINGS.DO_NOT_HAVE_DATA) : translate(STRINGS.LOADING);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.centerText}>{message}</Text>
    </View>
  );
};
export default CenterText;
