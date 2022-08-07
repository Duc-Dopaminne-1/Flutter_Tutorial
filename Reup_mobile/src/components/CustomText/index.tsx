import { View, StyleProp, TextStyle, ViewStyle, Image, ImageStyle } from 'react-native';
import styles from './styles';
import { Text } from 'react-native';
import React from 'react';

interface Props {
  text: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  styleContainer?: StyleProp<ViewStyle>;
  leftIcon?: any;
  styleLeftIcon?: StyleProp<ImageStyle>;
}

const CustomText = (props: Props) => {
  const { text, style, numberOfLines = 0, styleContainer, leftIcon, styleLeftIcon } = props;

  return (
    <View style={[styles.container, leftIcon ? { flexDirection: 'row' } : undefined, styleContainer]}>
      {leftIcon ?
        <Image source={leftIcon} style={[styles.leftIcon, styleLeftIcon]} />
        : null}
      <Text style={[styles.title, style]}
        allowFontScaling={false}
        numberOfLines={numberOfLines}>
        {text}
      </Text>
    </View>
  );
};

export { CustomText };
