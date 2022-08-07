import React, { useEffect, useState } from 'react';
import styles from './styles';
import { View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import { CustomFlatList } from '../FlatList';
import AddImageItem from '../FlatListItem/AddImageItem';
import { CustomTouchable } from '../CustomTouchable';


interface ShowingImagesProps {
  imageList: string[];
  style?: ViewStyle;
  selectedIndex?: number;
  onSelectImage?: (index: number) => void;
}

const ShowingImages = (props: ShowingImagesProps) => {
  const { onSelectImage, selectedIndex = 0 } = props;
  const onLoadImage = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };

  const renderItem = (item: any, index: number) => {
    return (
      <CustomTouchable
        style={[styles.touchImage]}
        onPress={onSelectImage && onSelectImage.bind(undefined, index)}
      >
        <FastImage
          style={[styles.image, index === selectedIndex ? styles.selectedImage : styles.normalImage]}
          source={{ uri: item }}
        />
      </CustomTouchable>
    );
  };

  const renderItemSeparator = () => {
    return (
      <View style={styles.itemSeparator} />
    );
  };

  return (
    <View style={[styles.container, props.style ? props.style : {}]}>
      <FastImage source={{ uri: props.imageList[selectedIndex] }} style={styles.mainImage} />
      <View style={styles.imageList}>
        <CustomFlatList
          horizontal={true}
          onLoad={onLoadImage}
          data={props.imageList}
          renderItem={(item: any, index: number) => renderItem(item, index)}
          ItemSeparatorComponent={renderItemSeparator}
          style={styles.flatlist}
        />
      </View>
    </View>
  );
};
export default ShowingImages;
