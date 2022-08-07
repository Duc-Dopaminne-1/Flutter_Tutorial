import React, {useContext} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CONSTANTS} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {StringeeContext} from '../Call/StringeeContext';
import styles from './styles';

const HeaderHome = ({onPressHotline}) => {
  return (
    <View style={styles.rowLogoHeader}>
      <MessageButton onPress={onPressHotline} />
    </View>
  );
};

export const MessageButton = ({onPress, style}) => {
  const {
    chat: {unreadCount},
  } = useContext(StringeeContext);
  return (
    <TouchableOpacity
      style={[HELPERS.center, style]}
      hitSlop={CONSTANTS.HIT_SLOP}
      onPress={onPress}>
      <Image style={messageStyles.icon} source={IMAGES.IC_MESSAGE_LINEAR} />
      {unreadCount > 0 && (
        <View style={messageStyles.badge}>
          <Text style={messageStyles.text} numberOfLines={1}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const messageStyles = StyleSheet.create({
  icon: {
    tintColor: COLORS.PRIMARY_A100,
  },
  badge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 15,
    left: 12,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_WHITE,
    backgroundColor: COLORS.PRIMARY_B100,
    borderRadius: SIZES.BORDER_RADIUS_10,
    height: 18,
    minWidth: 18,
    paddingHorizontal: 5,
  },
  text: {
    ...FONTS.regular,
    fontSize: 10,
    color: COLORS.NEUTRAL_WHITE,
    textAlign: 'center',
    width: '100%',
  },
});

HeaderHome.propTypes = {};

export default HeaderHome;
