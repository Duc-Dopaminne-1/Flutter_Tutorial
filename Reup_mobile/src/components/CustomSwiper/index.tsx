import { View } from 'react-native';
import styles from './styles';
import React from 'react';
import Swiper from 'react-native-swiper';
import { CustomSwiperItem } from './CustomSwiperItem';
import { IStorySlider, IStory } from '@reup/reup-api-sdk/libs/api/tv/models';

interface Props {
  items: IStorySlider[];
  onPress: (item: IStory) => void;
}

const CustomSwiper = (props: Props) => {
  const { items, onPress } = props;

  return (
    <Swiper
      key={items.length}
      style={styles.swiper}
      dot={<View style={styles.unactiveDot} />}
      activeDot={<View style={styles.activeDot} />}
      autoplay
      autoplayTimeout={5}
      paginationStyle={styles.pagination}
    >
      {items.slice(0, 3).map((item: IStorySlider) => {
        return (
          <View style={{ flex: 1 }}>
            <CustomSwiperItem
              item={item}
              onPress={() => {
                onPress(item);
              }}
            />
          </View>
        );
      })}
    </Swiper>
  );
};

export { CustomSwiper };
