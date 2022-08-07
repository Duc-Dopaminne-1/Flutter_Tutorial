import * as React from 'react';
import { Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import DefaultText from '@/components/CustomText/DefaultText';

export type Props = {
  textButton?: string;
  buttonTextStyle?: TextStyle;
  containerStyle?: ViewStyle;
  onPress?: () => void;
};

export function TextButton(Props: Props) {
  const { textButton, buttonTextStyle, containerStyle, onPress } = Props;

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <DefaultText {...{ onPress: onPress, style: Object.assign({}, styles.buttonText, buttonTextStyle) }}>{textButton}</DefaultText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: colors.gray_500,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s14,
  },
});
