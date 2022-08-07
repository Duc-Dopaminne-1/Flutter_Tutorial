import React from 'react';
import { View } from 'react-native';
import { scale } from '../utils/responsive';

const RowSpace = ({ height }) => {
  return <View style={{ height: height || scale(12) }} />;
};

export default RowSpace;
