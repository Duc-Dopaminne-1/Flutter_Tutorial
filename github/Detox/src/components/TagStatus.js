import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import CustomIconButton from './CustomIconButton';

export const TagStatus = ({
  status,
  statusStyle = {},
  textStatusStyle = {},
  isForRent,
  isRented,
  isSold,
  showForRentBanner,
  containerStyle,
  isGuaranteed,
  height = SIZES.SEPARATOR_32,
  fontSize = SIZES.FONT_16,
  statusPosition,
}: TagStatusType) => {
  return (
    <View style={[styles.container, containerStyle, statusPosition]}>
      {!isRented && !isSold && isForRent && showForRentBanner && (
        <View style={styles.wrapperTxt(height)}>
          <Text style={styles.text(fontSize)}>{translate('common.forRent')}</Text>
        </View>
      )}
      {!!status && (
        <View style={[styles.wrapperTxt(height), statusStyle]}>
          <Text style={[styles.text(fontSize), textStatusStyle]}>{status}</Text>
        </View>
      )}
      {isGuaranteed && (
        <View style={[styles.guaranteedBannerContainer, HELPERS.row]}>
          <CustomIconButton
            disabled={true}
            iconColor={COLORS.GREEN_BASIC}
            iconName="shield-checkmark"
            customImageSize={15}
          />
          <Text style={[styles.guaranteedText]}>
            {translate('propertyPost.guaranteedProperty')}
          </Text>
        </View>
      )}
    </View>
  );
};

type TagStatusType = {
  status: string,
  statusStyle: ViewStyle,
  textStatusStyle: TextStyle,
  isForRent: Boolean,
  isForRent: Boolean,
  isRented: Boolean,
  isSold: Boolean,
  showForRentBanner: Boolean,
  isGuaranteed: Boolean,
  height: Number,
  fontSize: Number,
};

const styles = StyleSheet.create({
  container: {
    ...HELPERS.row,
    position: 'absolute',
    top: 8,
    left: 8,
  },
  wrapperTxt: height => ({
    ...HELPERS.row,
    backgroundColor: COLORS.PRIMARY_B100,
    paddingHorizontal: 10,
    borderRadius: SIZES.BORDER_RADIUS_100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    height,
  }),
  text: fontSize => ({
    ...FONTS.bold,
    fontSize,
    color: COLORS.NEUTRAL_WHITE,
  }),
  guaranteedBannerContainer: {
    backgroundColor: COLORS.GREEN_EB,
    borderRadius: SIZES.BORDER_RADIUS_100,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    height: SIZES.SEPARATOR_32,
  },
  guaranteedText: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_12,
    color: COLORS.GREEN_BASIC,
  },
});
