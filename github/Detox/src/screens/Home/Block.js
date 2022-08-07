import React from 'react';
import {View} from 'react-native';

export const Block = ({children, loading}) => {
  if (loading) {
    return null;
  }
  return <View>{children}</View>;
};
