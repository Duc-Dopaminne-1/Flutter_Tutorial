import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

import {IMAGES} from '../assets/images';
import {COLORS} from '../assets/theme/colors';
import {useLogin} from '../screens/Auth/useLogin';

const styles = StyleSheet.create({
  itemIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export const CustomHeartButton = ({
  style,
  isFollowed,
  onPress,
  backgroundIcon = COLORS.GREEN_80,
  disabled = false,
}) => {
  const iconFollow = isFollowed ? IMAGES.IC_MAIN_HEART : IMAGES.IC_WHITE_HEART;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.itemIcon, style, {backgroundColor: backgroundIcon}]}>
      <Image style={styles.icon} resizeMode="contain" source={iconFollow} />
    </TouchableOpacity>
  );
};

const IconHeartButton = ({
  isFollowed,
  onPress,
  isVisible = true,
  customStyle,
  disabled = false,
}) => {
  const {notLoggedIn} = useLogin();
  if (!isVisible) {
    return null;
  }

  return (
    <CustomHeartButton
      style={customStyle}
      isFollowed={!notLoggedIn && isFollowed}
      onPress={onPress}
      disabled={disabled}
    />
  );
};

export default IconHeartButton;
