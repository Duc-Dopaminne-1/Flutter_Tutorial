import React, { ReactElement } from 'react';
import { View, ViewStyle } from 'react-native';
import { colors } from '@/vars';

const CONTAINER: ViewStyle = {
  flex: 1,
  height: 1,
  backgroundColor: colors.gray_line_beta,
};

interface SeparatorViewProps {
  style?: ViewStyle;
}

export function SeparatorView(props: SeparatorViewProps): ReactElement {
  const { style } = props;
  const styleOverride = { ...CONTAINER, ...style };
  return <View style={styleOverride} />;
}
