import * as React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';

export type Props = {
  text?: string;
  containerStyle?: ViewStyle;
  textStyle?: ViewStyle;
  onPress?: () => void;
};

export function CategoryItem(Props: Props): React.ReactElement {
  const { text = '', containerStyle, textStyle, onPress = () => {} } = Props;
  const containerMergeStyle = [styles.container, containerStyle];
  const textMergeStyle = [styles.text, textStyle];
  return (
    <Pressable onPress={onPress} style={containerMergeStyle}>
      <Text style={textMergeStyle}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg_light,
    marginRight: 8,
    borderRadius: 4,
  } as ViewStyle,

  text: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 50,
    textAlign: 'center',
    color: colors.bg_gray_white,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.s16,
  } as TextStyle,
});
