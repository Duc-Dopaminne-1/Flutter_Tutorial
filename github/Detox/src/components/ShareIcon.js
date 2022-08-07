import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {ICONS} from '../assets/icons';
import CustomIcon from '../assets/icons/CustomIcon';
import {translate} from '../assets/localize';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {commonStyles} from '../assets/theme/styles';
import {FeatureConfig} from '../configs/FeatureConfig';

const ICON_SIZE = 24;
const styles = StyleSheet.create({
  containerShare: {flexDirection: 'row', alignItems: 'center'},
  icon: {width: ICON_SIZE},
});

export const ShareIcon = ({onPress, hideLabel = false, hideMarginRight}) => {
  if (FeatureConfig.disableShareSocial) {
    return null;
  }
  return (
    <TouchableOpacity onPress={onPress} style={styles.containerShare}>
      <CustomIcon name={ICONS.SHARE} style={styles.icon} size={20} color={COLORS.BLACK_31} />
      {!hideLabel && (
        <>
          <View style={commonStyles.separatorColumn12} />
          <Text style={{...FONTS.regular, ...FONTS.fontSize14}}>{translate('common.share')}</Text>
        </>
      )}
      {!hideMarginRight && <View style={commonStyles.separatorColumn12} />}
    </TouchableOpacity>
  );
};
