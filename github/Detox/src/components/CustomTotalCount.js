import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../assets/localize';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';

const styles = StyleSheet.create({
  textMessage: {
    ...FONTS.regular,
    ...FONTS.fontSize16,
    color: COLORS.TEXT_DARK_10,
  },
  textCount: {
    ...FONTS.bold,
    color: COLORS.PRIMARY_A100,
  },
});

const CustomTotalCount = ({
  count,
  message = translate('yourPropertyPost.postedProduct'),
  containerStyle,
  textMessageStyle,
  textCountStyle,
}) => {
  return (
    <View style={[HELPERS.fullWidth, METRICS.horizontalPadding, METRICS.marginTop, containerStyle]}>
      <Text style={[styles.textMessage, textMessageStyle]}>
        {translate('common.thereAreIs')}
        <Text style={[styles.textMessage, styles.textCount, textCountStyle]}> {count} </Text>
        {message}
      </Text>
    </View>
  );
};

export default CustomTotalCount;
