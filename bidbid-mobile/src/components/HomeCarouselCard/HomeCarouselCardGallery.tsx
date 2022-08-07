import React, { FC, useState } from 'react';
import { Image, StyleProp, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import { DiscoveryPhoto } from '@/redux/discovery';
import { images } from '@/vars';
import styles from './styles';

interface HomeCarouselCardGalleryProps {
  style?: StyleProp<ViewStyle>;
  photos?: DiscoveryPhoto[];
}

const CustomImage = ({ uri }: { uri: string }) => {
  const [isImageError, setIsImageError] = useState<boolean>(false);

  if (isImageError) {
    return <Image source={images.missing} style={styles.galleryPhoto} />;
  } else {
    return (
      <FastImage
        source={{ uri, priority: FastImage.priority.high }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.galleryPhoto}
        onError={() => setIsImageError(true)}
      />
    );
  }
};

const HomeCarouselCardGallery: FC<HomeCarouselCardGalleryProps> = ({ style, photos = [] }) => {
  if (!photos.length) return null;
  return (
    <View style={[styles.galleryWrapper, style]}>
      {photos.map(photo => (
        <CustomImage uri={photo.url} key={photo.id} />
      ))}
    </View>
  );
};

export default HomeCarouselCardGallery;
