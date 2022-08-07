import styles from './styles';
import React from 'react';
import { View, Image } from 'react-native';
import { CustomText } from '@src/components/CustomText';
import TICK from '@res/icons/icon-tick.png';
import { CustomTouchable } from '@src/components/CustomTouchable';

export interface GenreItem {
  name: string;
  selected: boolean;
  id: string;
}

interface MutilSelectPopupItemProp {
  item: GenreItem;
  onPressItem: () => void;
}

const MutilSelectPopupItem = (props: MutilSelectPopupItemProp) => {
  return (
    <CustomTouchable onPress={props.onPressItem}>
      <View style={styles.container}>
        <View style={styles.containerContent}>
          <CustomText style={styles.contentTitle} numberOfLines={1} text={props.item && props.item.name ? props.item.name : ''} />
        </View>
        <Image
          resizeMode={'stretch'}
          source={TICK}
          style={[styles.icon, props.item && props.item.selected ? { opacity: 1 } : { opacity: 0 }]}
        />
      </View>
    </CustomTouchable>
  );
};

export { MutilSelectPopupItem };
