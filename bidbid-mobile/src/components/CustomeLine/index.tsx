import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '@/vars';

type Props = {
  lineStyle?: ViewStyle;
};

export const CustomLine = memo((props: Props) => {
  const { lineStyle } = props;
  return <View style={[styles.separatorLine, lineStyle]} />;
});

const styles = StyleSheet.create({
  separatorLine: {
    backgroundColor: colors.divider,
    height: 1,
    width: '100%',
  },
});
