import styles from './styles';
import React from 'react';
import { View } from 'react-native';
import { CustomTouchable } from '@src/components/CustomTouchable';
import DefaultImage from '@src/components/DefaultImage';
import LinearGradient from 'react-native-linear-gradient';
import { CustomText } from '@src/components/CustomText';
import { colors } from '@src/constants/vars';

interface Props {
  title: string;
  url?: string;
  onPressItem: () => void;
}

const ExploreItem = (props: Props) => {
  const { title, url, onPressItem } = props

  return (
    <View style={styles.container}>
      <CustomTouchable style={styles.touchable} onPress={onPressItem}>
        <DefaultImage imageUri={url} imageStyle={styles.image} resizeMode={'contain'} />
        <LinearGradient style={styles.gradient} colors={[colors.BOOK_IMAGE_LIGHT, colors.BOOK_IMAGE_DARK]} />
        <CustomText style={styles.title} text={title} />
      </CustomTouchable>
    </View>
  );
};

export { ExploreItem };
