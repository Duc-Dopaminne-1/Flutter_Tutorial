import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {getCourseHeightDimension, getHeightImageDimension} from '../utils/ImageUtil';
import ImageProgress from './ImageProgress';

const smallSize = getHeightImageDimension();
const sizeCourse = getCourseHeightDimension();
const styles = StyleSheet.create({
  imageOffer: {
    backgroundColor: COLORS.TEXT_DARK_40,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  imageBorder: {
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
});

export const HomeHorizonalImage = ({item, itemStyle, isFullHeight = false}) => {
  const styleItem = [styles.imageOffer, isFullHeight ? sizeCourse : smallSize];
  return (
    <View style={[styleItem, itemStyle]}>
      <ImageProgress
        url={item.image}
        containerStyle={styleItem}
        imageContainerStyle={styleItem}
        imageStyle={styles.imageBorder}
      />
    </View>
  );
};
