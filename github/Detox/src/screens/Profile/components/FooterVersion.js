import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {getBuildNumber, getVersion} from 'react-native-device-info';

import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS} from '../../../assets/theme/metric';

const styles = StyleSheet.create({
  textVersion: {
    textAlign: 'center',
    ...METRICS.verticalMargin,
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.TEXT_BLACK_UNDERLINE,
  },
});

const FooterVersion = () => {
  return (
    <Text style={styles.textVersion}>{`${translate(
      'VERSION_APP',
    )} ${getVersion()} (${getBuildNumber()})`}</Text>
  );
};

export default FooterVersion;
