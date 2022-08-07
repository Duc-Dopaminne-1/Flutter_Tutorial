import React, { ReactElement } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';

interface Prop {
  title: string;
  container?: StyleProp<ViewStyle>;
  subTitle?: string;
  onPress?: () => void;
}

export function PaymentAccountsTitle(props: Prop): ReactElement {
  const { title, container, subTitle, onPress } = props;
  return (
    <View style={container}>
      <Text style={styles.textTitle}>{title}</Text>
      {subTitle ? (
        <Pressable onPress={onPress}>
          <Text style={styles.textSubTitle}>{subTitle}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  textTitle: {
    color: colors.gray_900,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsSemiBold,
  },
  textSubTitle: {
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.red_600,
    fontSize: fonts.size.s14,
  },
});
