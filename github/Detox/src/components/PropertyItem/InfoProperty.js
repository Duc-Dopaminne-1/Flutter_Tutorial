import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {IMAGES} from '../../assets/images';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal, small, tiny} from '../../assets/theme/metric';
import MeasureUtils from '../../utils/MeasureUtils';

const styles = StyleSheet.create({
  containerTextWithIcon: {
    alignItems: 'center',
    flexDirection: 'row',
    marginEnd: normal,
  },

  propertyLabel: {
    ...FONTS.regular,
    fontSize: 12,
    marginEnd: small,
    color: COLORS.TEXT_DARK_10,
  },
});

const TextWithIcon = ({text, image}) => {
  return (
    <View style={styles.containerTextWithIcon}>
      <Image size={16} source={image} style={{marginRight: tiny}} />
      <Text style={styles.propertyLabel}>{text}</Text>
    </View>
  );
};

const DEFAULT_VALUE = '--';

const InfoProperty = ({
  numberOfBedrooms,
  numberOfBathrooms,
  buildingArea,
  direction,
  containerStyle,
}) => {
  const formatAcreage = () => {
    if (buildingArea > 0) {
      return MeasureUtils.getSquareMeterText(buildingArea);
    }
    return null;
  };

  return (
    <View style={[HELPERS.row, {...HELPERS.scrollSpaceBetween}, containerStyle]}>
      <TextWithIcon image={IMAGES.IC_INFO_BEDROOM} text={numberOfBedrooms || DEFAULT_VALUE} />
      <TextWithIcon image={IMAGES.IC_INFO_BATHTUB} text={numberOfBathrooms || DEFAULT_VALUE} />
      <TextWithIcon image={IMAGES.IC_INFO_ACREAGE} text={formatAcreage() || DEFAULT_VALUE} />
      <TextWithIcon image={IMAGES.IC_INFO_DIRECTION} text={direction || DEFAULT_VALUE} />
    </View>
  );
};

export default InfoProperty;
