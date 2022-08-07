import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { PLAY } from '@src/constants/icons';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import styles from './styles';

interface Props {
  videoUrl: string
}

const VideoThumbnail = (props: Props) => {
  const { videoUrl } = props;

  const renderVideoView = () => {
    return (
      <Video
        style={styles.videoView}
        resizeMode="cover"
        paused={true}
        source={{ uri: videoUrl }}
      />
    );
  }

  const renderDarkLayout = () => {
    return (
      <View style={styles.darkLayout} />
    )
  }

  const renderPlayPauseIcon = () => {
    return (
      <View style={{ position: 'absolute', alignSelf: 'center' }}>
        <FastImage
          resizeMode={'contain'}
          source={PLAY}
          style={{ width: 30, height: 30 }}
        />
      </View>
    );
  }

  const renderItem = useMemo(() => {
    return (
      <View style={styles.container}>
        {renderVideoView()}
        {renderDarkLayout()}
        {renderPlayPauseIcon()}
      </View>
    );
  }, [videoUrl]);

  return renderItem;
}

export default VideoThumbnail;
