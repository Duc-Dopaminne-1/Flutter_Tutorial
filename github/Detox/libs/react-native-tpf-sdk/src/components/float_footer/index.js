import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const FloatFooter = ({ children, style, onLayout }) => {
  return (
    <View
      style={{ ...styles.container, ...style }}
      onLayout={e => {
        typeof onLayout === 'function' && onLayout(e);
      }}>
      {children}
    </View>
  );
};

export default FloatFooter;
