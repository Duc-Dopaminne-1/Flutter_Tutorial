import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';

const ListItem = ({icon = IMAGES.IC_TRASH, title, onPress = () => {}}) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <Image style={styles.icon} source={icon} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ListItem;

const styles = StyleSheet.create({
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
