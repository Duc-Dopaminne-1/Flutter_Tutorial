import { View } from 'react-native';
import styles from './styles';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import { IStorySlider } from '@reup/reup-api-sdk/libs/api/tv/models';
import { formatDuration } from '@src/utils/date';
import { CustomTouchable } from '@src/components/CustomTouchable';

interface Props {
  item: IStorySlider;
  onPress: () => void;
}

const CustomSwiperItem = (props: Props) => {
  const { item, onPress } = props;

  const showGenres = () => {
    if (item.genres && item.genres.length > 0) {
      let genresList = [];
      for (let i = 0; i < item.genres.length; i++) {
        genresList.push(item.genres[i].name);
      }
      return genresList.join(' • ').toString();
    }
  };

  return (
    <CustomTouchable style={{ flex: 1 }} onPress={onPress}>
      <FastImage style={{ flex: 1 }} source={{ uri: item.image_thumb }} />
      <View style={styles.contentContainer}>
        <CustomText style={styles.contentTitle} text={item.name} />
        <View style={styles.genresContainer}>
          <View style={styles.durationContainer}>
            <CustomText style={styles.duration} text={formatDuration(item.duration ?? 0)} />
          </View>
          <CustomText numberOfLines={1} style={styles.genres} text={showGenres() ?? ''} />
        </View>
        <CustomText numberOfLines={3} style={styles.description} text={item.description ?? ''} />
      </View>
    </CustomTouchable>
  );
};

export { CustomSwiperItem };
