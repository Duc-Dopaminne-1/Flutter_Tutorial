import React, { memo } from 'react';
import { images } from '@/vars';
import LottieView from 'lottie-react-native';
import { ImageBackground, StyleSheet } from 'react-native';

const InitScreen: () => JSX.Element = () => {
  return (
    <ImageBackground source={images.backgroundApp} style={styles.container}>
      <LottieView source={require('../../../splash.json')} autoPlay loop={false} />
    </ImageBackground>
  );
};

export default memo(InitScreen);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
