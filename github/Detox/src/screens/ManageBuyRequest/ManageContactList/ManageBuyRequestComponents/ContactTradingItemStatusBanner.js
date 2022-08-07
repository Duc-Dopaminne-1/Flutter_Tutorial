import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {small} from '../../../../assets/theme/metric';

const styles = StyleSheet.create({
  containerStatus: {
    ...HELPERS.row,
    position: 'absolute',
    zIndex: 1,
    backgroundColor: COLORS.BLUE_56,
    padding: small,
    borderRadius: SIZES.BORDER_RADIUS_20,
    top: 12,
    left: 12,
  },
  statusText: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.NEUTRAL_WHITE,
    marginHorizontal: small,
  },
});

const ContactTradingItemStatusBanner = ({status, customStyle = {}, textStyle = {}}) => {
  return (
    <View style={[styles.containerStatus, customStyle]}>
      <Text style={[styles.statusText, textStyle]}>{status}</Text>
    </View>
  );
};

export default ContactTradingItemStatusBanner;
