import React from 'react';
import FastImage, { Source } from 'react-native-fast-image';
import { BlurView } from '@react-native-community/blur';
import styles from './styles';
import { View } from 'react-native';
import DefaultImage from '@src/components/DefaultImage';

interface Props {
  imageSource: Source;
}

const BlurImage = (props: Props) => {
  const { imageSource } = props;

  const renderImage = (isAbsolute: boolean) => {
    const resizeMode = isAbsolute ? 'stretch' : 'cover';
    const imageStyle = isAbsolute ? styles.absoluteImage : styles.image;

    return <DefaultImage resizeMode={resizeMode} imageStyle={imageStyle} imageUri={imageSource.uri} />
  };

  const renderBlurView = () => {
    return <BlurView style={styles.blurView} blurType="dark" />;
  };

  return (
    <View style={styles.container}>
      {renderImage(false)}
      {renderBlurView()}
      {renderImage(true)}
    </View>
  );
};

export default BlurImage;
