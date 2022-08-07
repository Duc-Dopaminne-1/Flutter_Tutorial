import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';

export type MenuListProps = {
  isGroup: Boolean,
  isAgent: Boolean,
  onPressInfo: () => {},
  onPressDelete: () => {},
  onPressGroup: () => {},
};

const MenuList = ({
  isGroup = false,
  isAgent = false,
  onPressInfo,
  onPressDelete,
  onPressGroup,
}: MenuListProps) => {
  return (
    <View style={styles.container}>
      {!isGroup && isAgent && (
        <Item icon={IMAGES.IC_INFO} title={translate('chat.menu.info')} onPress={onPressInfo} />
      )}
      {!isGroup && (
        <Item
          icon={IMAGES.IC_TRASH}
          title={translate('chat.menu.delete')}
          onPress={onPressDelete}
        />
      )}
      {isGroup && (
        <Item
          icon={IMAGES.IC_GROUP_MEMBER}
          title={translate('chat.menu.group')}
          onPress={onPressGroup}
        />
      )}
    </View>
  );
};

const Item = ({icon = IMAGES.IC_TRASH, title, onPress = () => {}}) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <Image style={styles.icon} source={icon} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default MenuList;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: normal,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.BLACK_31,
  },
  title: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.BLACK_31,
    marginLeft: normal,
  },
});
