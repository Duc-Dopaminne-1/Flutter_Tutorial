import React from 'react';
import {Dimensions, Image, Keyboard, StyleSheet, TouchableWithoutFeedback} from 'react-native';

import {IMAGES} from '../../../assets/images';

const styles = StyleSheet.create({
  imageBackground: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    width: Dimensions.get('window').width,
  },
});

const ImageSignUpBackground = ({
  style,
  onPress = () => {
    Keyboard.dismiss();
  },
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Image style={[style, styles.imageBackground]} source={IMAGES.SIGNUP_BG} resizeMode="cover" />
    </TouchableWithoutFeedback>
  );
};

export default ImageSignUpBackground;
