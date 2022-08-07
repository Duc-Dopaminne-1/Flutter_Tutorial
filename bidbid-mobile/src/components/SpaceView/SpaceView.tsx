import React, { ReactElement } from 'react';
import { View, ViewStyle } from 'react-native';
import { colors } from '@/vars';

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: colors.red,
};

interface SpaceViewProps {
  style?: ViewStyle;
  width?: number;
  height?: number;
}

export function SpaceView(props: SpaceViewProps): ReactElement {
  const { style, width, height } = props;
  const styleOverride = { ...CONTAINER, ...style, width, height };
  return <View style={styleOverride} />;
}
