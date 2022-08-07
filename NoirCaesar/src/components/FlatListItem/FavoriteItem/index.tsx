import styles from './styles';
import React from 'react';
import { View } from 'react-native';
import { CustomText } from '@src/components/CustomText';
import FastImage from 'react-native-fast-image';
import { CustomTouchable } from '@src/components/CustomTouchable';
import CHECKBOX from '@res/icons/checkbox.png';
import UNCHECKBOX from '@res/icons/uncheckbox.png';

export interface FavoriteItemModel {
  name: string;
  selected: boolean;
  id: string;
}

interface FavoriteItemProp {
  item: FavoriteItemModel;
  onPressItem: () => void;
}

const FavoriteItem = (props: FavoriteItemProp) => {
  const { item } = props;
  return (
    <CustomTouchable onPress={props.onPressItem}>
      <View style={styles.container}>
        <View style={styles.containerContent}>
          <CustomText style={styles.contentTitle} numberOfLines={1} text={item && item.name ? item.name : ''}></CustomText>
        </View>
        <FastImage resizeMode={'cover'} source={item && item.selected ? CHECKBOX : UNCHECKBOX} style={[styles.icon]} />
      </View>
    </CustomTouchable>
  );
};

export { FavoriteItem };
