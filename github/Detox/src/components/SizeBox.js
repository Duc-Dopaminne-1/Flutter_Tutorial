import React from 'react';
import {View} from 'react-native';

export const SizeBox = ({height, width, backgroundColor, style}) => {
  return <View style={[{height, width, backgroundColor}, style]} />;
};
