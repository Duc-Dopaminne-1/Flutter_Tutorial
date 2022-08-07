import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ICONS} from '../assets/icons';
import CustomIcon from '../assets/icons/CustomIcon';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {normal, small} from '../assets/theme/metric';
import PropertyType from '../screens/ManagePost/PropertyType';
import MeasureUtils from '../utils/MeasureUtils';

const styles = StyleSheet.create({
  containerTextWithIcon: {
    flexDirection: 'row',
    marginEnd: normal,
    alignItems: 'flex-end',
  },

  propertyLabel: {
    ...FONTS.regular,
    fontSize: 12,
    marginStart: small,
  },
});

const IconWithText = ({text, image}) => {
  return (
    <View style={styles.containerTextWithIcon}>
      <CustomIcon size={16} name={image} />
      <Text style={styles.propertyLabel}>{text}</Text>
    </View>
  );
};

const BedBathAcreage = ({
  style,
  numberOfBedrooms,
  numberOfBathrooms,
  buildingArea,
  propertyTypeName,
}) => {
  const acreage = buildingArea ?? 0;
  const acreageText = MeasureUtils.getSquareMeterText(acreage);

  return (
    <View style={[HELPERS.row, style]}>
      {propertyTypeName !== PropertyType.land && (
        <IconWithText image={ICONS.BED_SINGLE} text={numberOfBedrooms ?? 0} />
      )}
      {propertyTypeName !== PropertyType.land && (
        <IconWithText image={ICONS.BATHTUB} text={numberOfBathrooms ?? 0} />
      )}
      <IconWithText image={ICONS.ACREAGE} text={acreageText} />
    </View>
  );
};

export default BedBathAcreage;
