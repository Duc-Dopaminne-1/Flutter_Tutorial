import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, tiny} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  buttonContainer: {
    ...HELPERS.rowCenter,
    ...METRICS.smallHorizontalPadding,
    paddingVertical: tiny,
    borderRadius: 5,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_BERMUDA,
    overflow: 'hidden',
  },
  filterText: {
    ...FONTS.regular,
    color: COLORS.GREY_BERMUDA,
    fontSize: 12,
    paddingHorizontal: tiny,
    fontWeight: '600',
  },
});

const FilterButton = ({title, defaultStyles, textStyle, onPress, disabled = false}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.buttonContainer, defaultStyles]}
      onPress={onPress}>
      <Text style={[styles.filterText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default FilterButton;
