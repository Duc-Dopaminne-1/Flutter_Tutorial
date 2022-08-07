import React from 'react';
import {View} from 'react-native';

import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import BaseScreen from '../../../components/BaseScreen';
import ImageHorizontalList from '../../../components/List/ImageHorizontalList';
import VideoWebView from '../../../components/VideoWebView';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';

const videoWidth = SCREEN_SIZE.WIDTH;
const videoHeight = SCREEN_SIZE.HEIGHT;
const paddingVideo = videoWidth / 2;
const ImageHorizontalListScreen = ({route}) => {
  const {images, videoviews} = route.params;
  return (
    <BaseScreen>
      <View style={HELPERS.fill}>
        {images ? (
          <ImageHorizontalList contentContainerStyle={HELPERS.crossCenter} images={images} />
        ) : (
          <View
            style={{
              width: videoWidth,
              height: videoHeight,
              paddingTop: paddingVideo,
              backgroundColor: COLORS.NEUTRAL_WHITE,
            }}>
            <VideoWebView url={videoviews} />
          </View>
        )}
      </View>
    </BaseScreen>
  );
};

export default ImageHorizontalListScreen;
