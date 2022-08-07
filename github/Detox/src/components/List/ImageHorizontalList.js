import React, {useEffect, useRef} from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

import {getImageSize, IMAGE_RATIO, SCREEN_SIZE} from '../../utils/ImageUtil';
import ImageProgress from '../ImageProgress';

const FUll_IMAGE_SIZE = getImageSize(SCREEN_SIZE.WIDTH, IMAGE_RATIO.R16x9);
const styles = StyleSheet.create({
  image: {
    height: FUll_IMAGE_SIZE.HEIGHT,
    width: FUll_IMAGE_SIZE.WIDTH,
  },
  containerImage: {
    flexWrap: 'wrap',
  },
});

const ImageHorizontalList = ({
  style,
  contentContainerStyle,
  onPress,
  images = [],
  viewableImageIndex = () => {},
  viewingImageIndex = -1,
  imageContainerStyle,
  imageStyle,
}: {
  onPress: (index: Number) => {},
  onViewIndex: Number,
}) => {
  const list = useRef();
  const imageWidth = {width: FUll_IMAGE_SIZE.WIDTH};

  // use ref for fixing error on flatlist, reference: https://github.com/facebook/react-native/issues/17408
  const onViewableItemsChanged = useRef(({viewableItems}) => {
    viewableImageIndex(viewableItems[0]?.index);
  });
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      disabled={!onPress}
      activeOpacity={0.9}
      style={[styles.containerImage, imageWidth, imageContainerStyle]}
      onPress={() => onPress(index)}>
      <ImageProgress
        url={item.uri ?? item.url}
        imageStyle={{...styles.image, ...imageStyle}}
        containerStyle={{...styles.image, ...imageStyle}}
        imageContainerStyle={{...styles.image, ...imageStyle}}
        resizeMode={FastImage.resizeMode.cover}
      />
    </TouchableOpacity>
  );

  const updateViewingIndex = () => {
    if (viewingImageIndex >= 0 && images?.length > 0) {
      list.current.scrollToIndex({index: viewingImageIndex, animated: true});
    }
  };
  useEffect(updateViewingIndex, [viewingImageIndex]);

  return (
    <FlatList
      ref={list}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewabilityConfig.current}
      style={style}
      pagingEnabled
      contentContainerStyle={contentContainerStyle}
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      data={images}
      bounces={images?.length > 1}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      snapToAlignment="center"
    />
  );
};

export default ImageHorizontalList;
