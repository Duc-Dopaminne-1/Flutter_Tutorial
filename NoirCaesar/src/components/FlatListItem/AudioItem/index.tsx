import { View } from 'react-native';
import styles from './styles';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { LOGO } from '@src/constants/icons';
import DefaultImage from '@src/components/DefaultImage';

interface Props {
  url: string;
  title: string;
  content: string;
  onPressItem: () => void;
}

const AudioItem = (props: Props) => {
  const { url, title, content, onPressItem } = props;

  return (
    <CustomTouchable onPress={onPressItem}>
      <View style={styles.container}>
        <DefaultImage imageUri={url} imageStyle={styles.image} resizeMode={'cover'} />
        <View style={styles.textContainer}>
          <CustomText numberOfLines={1} style={styles.title} text={title} />
          <CustomText numberOfLines={1} style={styles.content} text={content} />
        </View>
      </View>
    </CustomTouchable>
  );
};

export { AudioItem };
