import { View } from 'react-native';
import styles from './styles';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { formatDate, formatBlogDuration } from '@src/utils/date';
import { IBlog } from '@goldfishcode/noir-caesar-api-sdk/libs/api/blog/models';

interface Props {
  item: IBlog;
  onPressItem: () => void;
}

const BlogItem = (props: Props) => {
  const { item, onPressItem } = props;

  return (
    <CustomTouchable onPress={onPressItem}>
      <View style={styles.container}>
        <FastImage style={styles.image} resizeMode="contain" source={{ uri: item.image_thumb }} />
        <View style={styles.textContainer}>
          <CustomText numberOfLines={3} style={styles.title} text={item.name} />
          <CustomText
            numberOfLines={1}
            style={styles.date}
            text={`${formatDate(item.created ?? '')}  •  ${formatBlogDuration(Number(item.time_read))}`}
          />
        </View>
      </View>
    </CustomTouchable>
  );
};

export { BlogItem };
