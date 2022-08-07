import React, { ReactElement } from 'react';
import { View, ViewStyle } from 'react-native';
import { colors } from '@/vars';
const CONTAINER: ViewStyle = {
  height: 0.5,
  backgroundColor: colors.separator_line,
};

export function FilterLineBreak(): ReactElement {
  return <View style={CONTAINER}></View>;
}
