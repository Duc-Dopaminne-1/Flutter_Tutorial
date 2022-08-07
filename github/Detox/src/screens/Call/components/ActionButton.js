import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View, ViewProps} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';

type Type = 'call' | 'end' | 'volume' | 'mute' | 'video';

export type ButtonProps = {
  style: ViewProps,
  type: Type,
  icon: Object,
  isActive: Boolean,
  activeColor: String,
  inactiveColor: String,
  onPress: () => {},
};

export const ActionButton = ({
  //format
  style,
  icon = IMAGES.CALL_IC_CALL,
  inactiveColor = COLORS.BLACK_31,
  inactiveBackground = COLORS.NEUTRAL_WHITE,
  activeColor = COLORS.NEUTRAL_WHITE,
  activeBackground = COLORS.PRIMARY_B100,
  isActive = false,
  isDisable = false,
  title,
  onPress = () => {},
}) => {
  const backgroundColor = isActive ? activeBackground : inactiveBackground;
  const tintColorIcon = isActive ? activeColor : inactiveColor;

  return (
    <TouchableOpacity disabled={isDisable} onPress={onPress}>
      <View style={[styles.container, {backgroundColor}, style]}>
        <Image style={{tintColor: tintColorIcon}} source={icon} />
        {isDisable && <View style={styles.disableBackground} />}
      </View>
      {!!title && <Text style={[styles.title, isDisable ? styles.disableTitle : {}]}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  title: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BLACK_31,
    textAlign: 'center',
    marginTop: 4,
  },
  // eslint-disable-next-line react-native/no-color-literals
  disableBackground: {
    borderRadius: 32,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  disableTitle: {
    color: COLORS.GRAY_A3,
  },
});
