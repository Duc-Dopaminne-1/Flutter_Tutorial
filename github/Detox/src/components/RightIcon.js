import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import CustomIcon from '../assets/icons/CustomIcon';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {commonStyles} from '../assets/theme/styles';
import {FeatureConfig} from '../configs/FeatureConfig';

const ICON_SIZE = 24;

export const RightIcon = ({
  onPress,
  label = '',
  hideLabel = false,
  customIconName = null,
  iconColor = COLORS.BLACK_31,
  IconComponent = null,
}) => {
  if (FeatureConfig.disableShareSocial) {
    return null;
  }
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {!!customIconName && (
        <CustomIcon name={customIconName} style={styles.icon} size={20} color={iconColor} />
      )}
      {!!IconComponent && <IconComponent />}
      {!hideLabel && (
        <>
          <View style={commonStyles.separatorColumn4} />
          <Text style={{...FONTS.bold, ...FONTS.fontSize14}}>{label}</Text>
        </>
      )}
      <View style={commonStyles.separatorColumn12} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center'},
  icon: {width: ICON_SIZE},
});
