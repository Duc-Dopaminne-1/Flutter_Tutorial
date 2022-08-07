import { FlatList, View, ImageBackground } from 'react-native';
import React from 'react';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { PLAY, LOGO } from '@src/constants/icons';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import VideoThumbnail from './VideoThumbnail'

interface Props {
  videos?: string[];
  onPressVideo?: (index: number) => any;
  onLongPress?(): void;
}

const VideoList = (props: Props) => {
  const { videos = [], onPressVideo, onLongPress } = props;

  const getData = () => {
    return videos.length > 3 ? videos.slice(0, 4) : videos.slice(0, 2);
  };

  const renderVideo = ({ item, index }: { item: string; index: number }) => {
    const otherVideoNumber = videos.length - getData().length;
    return (
      <CustomTouchable activeOpacity={0.8} onLongPress={onLongPress} onPress={() => onPressVideo && onPressVideo(index)} key={index}>
        {index === getData().length - 1 && otherVideoNumber > 0 && (
          <View style={styles.imageOther}>
            <CustomText style={styles.imageOtherText} text={otherVideoNumber + '+'} />
          </View>
        )}
        <ImageBackground source={LOGO} style={styles.image}>
          <FastImage resizeMode={'contain'} source={PLAY} style={{ width: 25, height: 25 }} />
        </ImageBackground>
      </CustomTouchable>
    );
  };

  const renderSingleVideo = () => (
    <CustomTouchable onPress={() => onPressVideo && onPressVideo(0)} onLongPress={onLongPress}>
      <VideoThumbnail videoUrl={videos[0]}/>
    </CustomTouchable>
  );

  const keyExtractor = (item: string, index: number) => {
    return `${item}-${index}`;
  };

  const renderFlatList = () => {
    const numberOfColumns = videos.length > 1 ? 2 : 1;
    return (
      <FlatList
        data={getData()}
        style={styles.flatList}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        renderItem={renderVideo}
        numColumns={numberOfColumns}
      />
    );
  };

  return <View style={styles.container}>{videos.length === 1 ? renderSingleVideo() : renderFlatList()}</View>;
};

export default VideoList;
