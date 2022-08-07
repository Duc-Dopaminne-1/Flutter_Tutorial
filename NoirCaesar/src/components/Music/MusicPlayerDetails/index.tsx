import { View, Image } from 'react-native';
import styles from './styles';
import React from 'react';
import { CustomText } from '@src/components/CustomText';
import SeekBar from '../SeekBar';
import { LOGO } from '@src/constants/icons';
import DefaultImage from '@src/components/DefaultImage';

interface Props {
  thumb: string;
  title?: string;
  artist?: string;
  containerStyle?: object;
  imageStyle?: object;
  titleStyle?: object;
  artistStyle?: object;
  seekBarStyle?: object;
  onSeek: (value: number) => void;
}

const MediaDetails = (props: Props) => {
  const { thumb, title, artist, containerStyle, imageStyle, titleStyle, artistStyle, seekBarStyle, onSeek } = props;

  const renderImageThumb = () => {
    return <DefaultImage resizeMode="cover" imageStyle={[styles.image, imageStyle]} imageUri={thumb} />;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderImageThumb()}
      <SeekBar style={seekBarStyle} onSlidingComplete={onSeek} />
      {title ? <CustomText style={[styles.title, titleStyle]} text={title} /> : null}
      {artist ? <CustomText style={[styles.artist, artistStyle]} text={artist} /> : null}
    </View>
  );
};

export { MediaDetails };
