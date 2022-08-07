import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import React from 'react';
import { CustomText } from '../../CustomText';
import { colors } from '@src/constants/vars';
import { CustomTouchable } from '@src/components/CustomTouchable';
import DefaultImage from '@src/components/DefaultImage';

interface Props {
  url: string;
  title: string;
  onPressItem: () => void;
}

const BookItem = (props: Props) => {
  const { url, title, onPressItem } = props;

  return (
    <View style={styles.container}>
      <CustomTouchable style={styles.touchable} onPress={onPressItem}>
        <>
          <DefaultImage imageUri={url} imageStyle={styles.image} resizeMode={'contain'} />
          <LinearGradient style={styles.gradient} colors={[colors.BOOK_IMAGE_LIGHT, colors.BOOK_IMAGE_DARK]} />
          <CustomText style={styles.title} text={title} />
        </>
      </CustomTouchable>
    </View>
  );
};

export { BookItem };
