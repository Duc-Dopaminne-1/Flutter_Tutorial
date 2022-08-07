import React from 'react';
import { View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import styles from './styles';
import { getInitialName } from '@src/utils';
import { CustomText } from '../CustomText';

type Props = {
  size?: number;
  name: string;
  isCircle?: number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const DefaultAvatar = (props: Props) => {
  const { size = 45, isCircle = true, containerStyle = {}, textStyle = {} } = props;
  const circleStyle = { width: size, height: size, borderRadius: isCircle ? size / 2 : 0 };

  const getName = () => {
    const { name } = props;
    return getInitialName(name);
  };

  return (
    <View style={[circleStyle, styles.container, containerStyle]}>
      <CustomText style={textStyle} text={getName()} />
    </View>
  );
};
export { DefaultAvatar };
