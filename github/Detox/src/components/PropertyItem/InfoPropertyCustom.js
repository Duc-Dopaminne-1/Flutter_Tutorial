import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {IMAGES} from '../../assets/images';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';

const styles = StyleSheet.create({
  textSize12: {
    ...FONTS.fontSize12,
    ...FONTS.regular,
    color: COLORS.BLACK_31,
  },
  icon: {
    height: 24,
    width: 24,
    marginRight: 6,
  },
});

const ItemInfoWithIcon = ({icon, text}) => {
  return (
    <View style={[HELPERS.rowCenter]}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.textSize12}>{text}</Text>
    </View>
  );
};

const DEFAULT_VALUE = '--';

const InfoPropertyCustom = ({
  numberOfBedrooms,
  numberOfBathrooms,
  acreage,
  direction,
  isCrawler = false,
  containerStyle,
}) => {
  return (
    <View style={[HELPERS.fullWidth, HELPERS.rowSpaceBetween, containerStyle]}>
      <ItemInfoWithIcon icon={IMAGES.IC_BED_NEW} text={numberOfBedrooms || DEFAULT_VALUE} />
      <ItemInfoWithIcon icon={IMAGES.IC_BATHTUB} text={numberOfBathrooms || DEFAULT_VALUE} />
      {!isCrawler && <ItemInfoWithIcon icon={IMAGES.IC_AREA} text={acreage || DEFAULT_VALUE} />}
      <ItemInfoWithIcon icon={IMAGES.IC_COMPASS} text={direction ?? DEFAULT_VALUE} />
    </View>
  );
};

export default InfoPropertyCustom;
