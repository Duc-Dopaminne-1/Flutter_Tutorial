import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';
import Avatar from '../../../components/Avatar';
import {Group} from '../../../components/Badge';
import {IParticipant} from '../types';

type MenuItemProps = {
  onPress: () => {},
} & IParticipant;

const AVATAR_SIZE = 66;

const MemberItem = ({name, avatar, isAgent, isMember, isLastItem, onPress}: MenuItemProps) => {
  const isConsultant = !isAgent && !isMember;
  return (
    <TouchableOpacity style={styles.container(isLastItem)} disabled={!isAgent} onPress={onPress}>
      <Avatar url={avatar} size={AVATAR_SIZE} />
      <View style={styles.right}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {isConsultant ? (
          <Text style={styles.groupText}>
            {translate('common.group')}:
            <Text style={[styles.groupText, {color: COLORS.BLACK_31}]}> CVTV</Text>
          </Text>
        ) : (
          <Group style={styles.group} isAgent={isAgent} />
        )}
      </View>
      {isAgent && <Image style={styles.arrowIcon} source={IMAGES.IC_RIGHT_ARROW} />}
    </TouchableOpacity>
  );
};

export default MemberItem;

const styles = StyleSheet.create({
  container: isLastItem => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: normal,
    borderBottomWidth: isLastItem ? 0 : 1,
    borderBottomColor: COLORS.NEUTRAL_DIVIDER,
  }),
  right: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.BLACK_31,
    marginBottom: 4,
    marginRight: normal,
  },
  groupText: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.GRAY_A3,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.BLACK_31,
  },
});
