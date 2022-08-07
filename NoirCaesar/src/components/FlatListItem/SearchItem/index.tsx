import { View } from 'react-native';
import styles from './styles';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import DefaultImage from '@src/components/DefaultImage';

interface Props {
  url: string;
  title: string;
  onPressItem: () => void;
}

const SearchItem = (props: Props) => {
  const { url, title, onPressItem } = props;

  return (
    <CustomTouchable onPress={onPressItem}>
      <View style={styles.container}>
        <DefaultImage imageUri={url} imageStyle={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <CustomText numberOfLines={1} style={styles.title} text={title} />
        </View>
      </View>
    </CustomTouchable>
  );
};

export { SearchItem };
