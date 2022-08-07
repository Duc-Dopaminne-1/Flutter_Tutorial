import React, { useState } from 'react';
import { View } from 'react-native';

import styles from './styles';
import FastImage from 'react-native-fast-image';

const Banner = ({ dataInfoService }) => {
  const [bannerInfo, setBannerInfo] = useState(null);

  const getSizeBanner = e => {
    setBannerInfo(e.nativeEvent.layout);
  };
  return (
    <View
      style={styles.banner}
      onLayout={e => {
        getSizeBanner(e);
      }}>
      {!!dataInfoService?.image && !!bannerInfo?.width && (
        <FastImage
          source={{
            uri: dataInfoService?.image
          }}
          resizeMode="stretch"
          style={[styles.banner, { width: bannerInfo?.width }]}
        />
      )}
    </View>
  );
};

export default React.memo(Banner);
