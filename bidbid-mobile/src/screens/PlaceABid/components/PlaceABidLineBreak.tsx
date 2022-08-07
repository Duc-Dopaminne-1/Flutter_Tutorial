import React, { ReactElement } from 'react';
import { View, ViewStyle } from 'react-native';
import { colors } from '@/vars';
const CONTAINER: ViewStyle = {
  height: 1,
  backgroundColor: colors.separator_line,
};

export function PlaceABidLineBreak(): ReactElement {
  return <View style={CONTAINER}></View>;
}
