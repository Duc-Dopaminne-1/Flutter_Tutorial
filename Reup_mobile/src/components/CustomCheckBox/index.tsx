import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import styles from './styles';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { CustomText } from '../CustomText';
import UN_CHECKBOX from '@res/img/un_checkbox.png';
import CHECKBOX from '@res/img/checkbox.png';
import { CustomTouchable } from '../CustomTouchable';

interface Props {
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  styleLogo?: ViewStyle | ViewStyle[];
  stylesContainer?: any;
  numberOfLines?: number;
  onPress: () => void;
  isCheck: boolean;
}

const CustomCheckBox = (props: Props) => {
  const { text, textStyle, stylesContainer = {}, styleLogo, onPress, isCheck = false } = props;

  return (
    <CustomTouchable onPress={onPress} style={[styles.container, stylesContainer]}>
      <FastImage style={[styles.logo, styleLogo]} resizeMode={'contain'} source={isCheck ? CHECKBOX : UN_CHECKBOX} />
      {text ? <CustomText numberOfLines={2} style={textStyle} text={text} /> : null}
    </CustomTouchable>
  );
};

export { CustomCheckBox };
