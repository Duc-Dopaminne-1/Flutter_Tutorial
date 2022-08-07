import { View } from 'react-native';
import styles from './styles';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import { formatDate } from '@src/utils/date';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { IBlog } from '@goldfishcode/noir-caesar-api-sdk/libs/api/blog/models';

interface Props {
  item: IBlog;
  onPressItem: () => void;
}

const LatestBlogItem = (props: Props) => {
  const { item, onPressItem } = props;

  return (
    <CustomTouchable style={styles.container} onPress={onPressItem}>
      <FastImage resizeMode="contain" style={styles.image} source={{ uri: item.image_thumb }} />
      <View style={styles.contentContainer}>
        <CustomText numberOfLines={3} style={styles.contentTitle} text={item.name} />
        <CustomText
          style={styles.detail}
          text={`${formatDate(item.created ?? '')}${
            item.time_read ? '  •  ' + item.time_read + (item.time_read > 1 ? ' mins' : ' min') : ''
          }`}
        />
      </View>
    </CustomTouchable>
  );
};

export { LatestBlogItem };
