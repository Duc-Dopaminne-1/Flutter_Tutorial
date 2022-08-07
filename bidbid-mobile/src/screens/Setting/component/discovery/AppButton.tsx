import React, { ReactElement } from 'react';
import { StyleSheet, TextStyle, ViewStyle, Text, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';

interface Props {
  title: string;
  onPressed?: () => void;
}

export default function AppButton(props: Props): ReactElement {
  const { title, onPressed } = props;

  return (
    <Pressable style={styles.pauseMyAccountButtonView} onPress={onPressed}>
      <Text style={styles.pauseMyAccountText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pauseMyAccountButtonView: {
    height: 50,
    borderRadius: 36,
    backgroundColor: colors.red_700,
    justifyContent: 'center',
  } as ViewStyle,

  pauseMyAccountText: {
    textAlign: 'center',
    fontSize: fonts.size.s19,
    color: colors.white,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,
});
