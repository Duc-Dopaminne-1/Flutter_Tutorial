import React, { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { images } from '@/vars';

function HomeDetailCarouselItem(props: any) {
  const photo = props.item;
  const [isImageError, setIsImageError] = useState(false);

  const onLoadImageError = () => {
    setIsImageError(true);
  };

  if (isImageError) {
    return <Image source={images.missing} style={styles.image} />;
  } else {
    return <Image source={{ uri: photo.url }} resizeMode={'cover'} style={styles.image} onError={onLoadImageError} />;
  }
}

export default React.memo(HomeDetailCarouselItem);

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
});
