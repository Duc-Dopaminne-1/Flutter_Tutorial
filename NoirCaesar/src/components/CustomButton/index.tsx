import { TextStyle, ViewStyle, StyleProp } from 'react-native';
import styles from './styles';
import React from 'react';
import { CustomTouchable } from '../CustomTouchable';
import { CustomText } from '../CustomText';
import { colors } from '@src/constants/vars';

interface Props {
  style?: StyleProp<ViewStyle>;
  text: string;
  disabled?: boolean;
  textStyle?: TextStyle;
  isGray?: boolean;
  onPress?: () => void;
  activeOpacity?: number;
  secondText?: string;
  secondTextStyle?: TextStyle;
}

const CustomButton = (props: Props) => {
  const { onPress, style, text, disabled = false, textStyle, activeOpacity, secondText, secondTextStyle, isGray = false } = props;

  return (
    <CustomTouchable
      style={[styles.container, { opacity: disabled ? 0.5 : 1, backgroundColor: isGray ? colors.GRAY_COLOR : colors.RED_COLOR }, style]}
      activeOpacity={activeOpacity}
      disabled={disabled}
      onPress={onPress}
    >
      <CustomText style={[styles.text, textStyle]} text={text} />
      {secondText && <CustomText style={[styles.text, secondTextStyle]} text={secondText} />}
    </CustomTouchable>
  );
};

export { CustomButton };
