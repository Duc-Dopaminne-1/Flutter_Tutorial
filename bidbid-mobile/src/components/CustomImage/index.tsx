import React, { useState } from 'react';
import { Image, ImageStyle, StyleSheet } from 'react-native';
import { images } from '@/vars';

interface Prop {
  source: any;
  imageStyle?: ImageStyle;
}
function CustomImage(props: Prop) {
  const [isImageError, setIsImageError] = useState(false);
  const { source, imageStyle } = props;

  const onLoadImageError = () => {
    setIsImageError(true);
  };

  if (isImageError) {
    return <Image source={images.missing} style={[styles.image, imageStyle]} />;
  } else {
    return <Image source={source} resizeMode={'contain'} onError={onLoadImageError} style={[styles.image, imageStyle]} />;
  }
}

export default React.memo(CustomImage);

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
  },
});
