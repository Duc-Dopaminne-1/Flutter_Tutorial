import { View, StyleProp, TextStyle } from 'react-native';
import styles from './styles';
import { Text } from 'react-native';
import React from 'react';

interface Props {
  text: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

const CustomText = (props: Props) => {
  const { text, style, numberOfLines = 0 } = props;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, style]} allowFontScaling={false} numberOfLines={numberOfLines}>
        {text}
      </Text>
    </View>
  );
};

export { CustomText };
