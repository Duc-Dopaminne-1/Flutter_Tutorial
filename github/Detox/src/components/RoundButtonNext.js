import React from 'react';
import {Image, StyleSheet, TouchableHighlight} from 'react-native';

import {IMAGES} from '../assets/images';

const styles = StyleSheet.create({
  buttonContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    margin: 10,
  },
});

const RoundButtonNext = ({style, onPress = () => {}, testID}) => {
  return (
    <TouchableHighlight testID={testID} style={[styles.buttonContainer, style]} onPress={onPress}>
      <Image source={IMAGES.IC_NEXT_BUTTON} />
    </TouchableHighlight>
  );
};

export default RoundButtonNext;
