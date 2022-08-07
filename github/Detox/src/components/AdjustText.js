import React, {useState} from 'react';
import {Platform, Text} from 'react-native';

const AdjustText = ({minimumFontSize, fontSize, style, numberOfLines, children}) => {
  const [currentFont, setCurrentFont] = useState(fontSize);

  const onTextLayout = event => {
    const {lines} = event.nativeEvent;
    if (lines.length > numberOfLines && currentFont > minimumFontSize) {
      setCurrentFont(currentFont - 1);
    }
  };

  return (
    <Text
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit
      style={[style, {fontSize: currentFont}]}
      onTextLayout={Platform.OS === 'ios' ? null : onTextLayout}>
      {children}
    </Text>
  );
};

export default AdjustText;
