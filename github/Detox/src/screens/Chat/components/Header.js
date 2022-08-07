import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CONSTANTS} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {small} from '../../../assets/theme/metric';
import Avatar from './Avatar';

const AVATAR_SIZE = 42;

type HeaderProps = {
  avatar?: String,
  name?: String,
};

const Header = ({avatar, name, isGroup, groupName}: HeaderProps) => {
  return (
    <View style={styles.container}>
      <Avatar size={AVATAR_SIZE} url={avatar} isGroup={isGroup} />
      <View style={styles.fullNameView}>
        <Text style={styles.fullName} numberOfLines={1}>
          {isGroup ? groupName : name}
        </Text>
        {!isGroup && <Text style={styles.status}>{translate('chat.status.online')}</Text>}
      </View>
    </View>
  );
};

export const MoreIcon = ({onPress}) => {
  return (
    <TouchableOpacity hitSlop={CONSTANTS.HIT_SLOP} onPress={onPress}>
      <Image source={IMAGES.IC_MORE} />
    </TouchableOpacity>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullNameView: {
    flex: 1,
    marginHorizontal: small,
  },
  fullName: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.BLACK_31,
  },
  status: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.BLACK_31,
  },
});
