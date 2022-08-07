import React from 'react';
import { StyleProp, ImageStyle } from 'react-native';
import { LOGO } from '@src/constants/icons';
import FastImage from 'react-native-fast-image';

export type DefaultImageResizeMode = 'cover' | 'contain' | 'stretch' | 'center';

interface Props {
  imageUri?: string;
  imageStyle?: StyleProp<ImageStyle>;
  resizeMode?: DefaultImageResizeMode;
}

const DefaultImage = (props: Props) => {
  const { imageUri, imageStyle, resizeMode } = props;

  const renderImage = () => {
    return <FastImage style={imageStyle} resizeMode={resizeMode} source={imageUri && imageUri !== '' ? { uri: imageUri } : LOGO} />;
  };

  return renderImage();
};

export default DefaultImage;
