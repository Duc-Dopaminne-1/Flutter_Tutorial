import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize/';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';

const styles = StyleSheet.create({
  viewContainer: {
    marginBottom: normal,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: 12,
  },
  viewFirstRow: {
    flexDirection: 'row',
  },
  iconLeft: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  titleText: {
    ...FONTS.regular,
    fontSize: 14,
    marginHorizontal: 10,
    marginTop: 0,
  },
});

const ListItemWelcome = ({title, customerStyle}) => {
  return (
    <View style={[styles.viewContainer, customerStyle]}>
      <View style={styles.viewFirstRow}>
        <Image source={IMAGES.IC_SUCCESS_FILL} style={styles.iconLeft} />
        <Text style={styles.titleText}>{translate(title)}</Text>
      </View>
    </View>
  );
};

export default ListItemWelcome;
