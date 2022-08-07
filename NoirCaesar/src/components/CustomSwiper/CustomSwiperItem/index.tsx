import { View } from 'react-native';
import styles from './styles';
import React from 'react';
import { CustomText } from '@src/components/CustomText';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { IStorySlider } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { formatDuration } from '@src/utils/date';
import { CustomTouchable } from '@src/components/CustomTouchable';
import DefaultImage from '@src/components/DefaultImage';

interface Props {
  item: IBook | IStorySlider;
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

  const showDuration = () => {
    const story = item as IStorySlider;
    return story.duration && (
      <View style={styles.durationContainer}>
        <CustomText style={styles.duration} text={formatDuration(story.duration ?? 0)} />
      </View>
    )
  }

  return (
    <CustomTouchable style={{ flex: 1 }} onPress={onPress}>
      <DefaultImage resizeMode="contain" imageUri={item.image} imageStyle={{ flex: 1 }} />
      <View style={styles.contentContainer}>
        <CustomText style={styles.contentTitle} text={item.name} />
        <View style={styles.genresContainer}>
          {showDuration()}
          <CustomText numberOfLines={1} style={styles.genres} text={showGenres() ?? ''} />
        </View>
        <CustomText numberOfLines={3} style={styles.description} text={item.description ?? ''} />
      </View>
    </CustomTouchable>
  );
};

export { CustomSwiperItem };
