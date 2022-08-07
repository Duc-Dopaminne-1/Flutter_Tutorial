import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import TooltipView, {TOOLTIP_SIDE} from '../TooltipView';

const styles = StyleSheet.create({
  tooltipContentContainer: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCopied: {
    color: COLORS.NEUTRAL_WHITE,
  },
  iconCopy: {
    width: 21,
    height: 21,
  },
});

const CopyIcon = ({
  content,
  tooltipSide = TOOLTIP_SIDE.left,
  icon = IMAGES.IC_COPY,
  iconStyles,
}) => {
  const onPressCopy = () => {
    Clipboard.setString(content);
  };
  return (
    <TooltipView
      side={tooltipSide}
      tooltipContent={
        <View style={styles.tooltipContentContainer}>
          <Text style={styles.textCopied}>{translate('common.copied')}</Text>
        </View>
      }
      onPress={onPressCopy}>
      <Image source={icon} style={[styles.iconCopy, iconStyles]} resizeMode="contain" />
    </TooltipView>
  );
};

export default CopyIcon;
