import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal, small} from '../../assets/theme/metric';
import {useLogin} from '../../screens/Auth/useLogin';
import CustomIconButton from '../CustomIconButton';

export const CustomFollowButton = ({
  style,
  isFollowed,
  onPress,
  isHeartIcon,
  customIcon,
  totalFollower,
  imageStyle,
}) => {
  if (isHeartIcon) {
    const iconCColor = isFollowed ? COLORS.PRIMARY_B100 : COLORS.NEUTRAL_WHITE;
    return (
      <CustomIconButton
        customImageSize={30}
        style={style}
        onPress={onPress}
        iconName={'heart'}
        iconColor={iconCColor}
      />
    );
  }
  if (customIcon) {
    return (
      <View style={[style, styles.customFollow]}>
        <CustomIconButton onPress={onPress} image={customIcon} imageStyle={imageStyle} />
        {!!totalFollower && <Text style={styles.totalFollowerText}>{totalFollower}</Text>}
      </View>
    );
  }
  const iconFollow = isFollowed ? IMAGES.IC_BTN_FAVORITED : IMAGES.IC_BTN_FAVORITE;
  return <CustomIconButton style={style} onPress={onPress} image={iconFollow} />;
};

const EyeFollowButton = ({
  isFollowed,
  onPress,
  isVisible = true,
  customStyle,
  customIcon = null,
  isBanner = false,
  totalFollower,
  imageStyle,
}) => {
  const {notLoggedIn} = useLogin();
  const textColor = isFollowed ? COLORS.NEUTRAL_WHITE : COLORS.BLACK_33;
  const containerColor = isFollowed ? COLORS.PRIMARY_A100 : COLORS.NEUTRAL_WHITE;
  const text = isFollowed
    ? translate(STRINGS.FOLLOWING_STATUS)
    : translate(STRINGS.UNFOLLOWING_STATUS);

  if (!isVisible) {
    return null;
  }

  if (customIcon) {
    const stylesItem = isBanner && {position: 'absolute', top: 8, right: 16};
    return (
      <CustomFollowButton
        style={[stylesItem ?? {}, customStyle]}
        isFollowed={!notLoggedIn && isFollowed}
        onPress={onPress}
        customIcon={customIcon}
        totalFollower={totalFollower}
        imageStyle={imageStyle}
      />
    );
  }
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.contentContainer, {backgroundColor: containerColor}]}>
        <View style={styles.icon}>
          <MaterialIcons name="remove-red-eye" color={COLORS.NEUTRAL_WHITE} size={16} />
        </View>
        <Text style={[styles.text, {color: textColor}]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: small,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  text: {
    ...FONTS.semiBold,
    fontSize: 15,
    color: COLORS.BLACK_33,
    marginStart: 1,
    marginEnd: normal,
  },
  contentContainer: {
    ...HELPERS.rowStartCenter,
    borderRadius: 16,
  },
  container: {
    ...HELPERS.row,
    position: 'absolute',
    start: normal,
    bottom: normal,
    zIndex: 999,
  },
  customFollow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  totalFollowerText: {
    ...FONTS.regular,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_33,
    marginStart: small,
  },
});

export default EyeFollowButton;
