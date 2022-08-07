import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const MaskView = ({
  customStyle,
  children,
  colors = ['rgba(255,255,255,0)', 'rgba(0,0,0,0.04)', 'rgba(0,0,0,0.5)'],
}) => {
  return (
    <LinearGradient colors={colors} style={customStyle}>
      {children}
    </LinearGradient>
  );
};

export {MaskView};
