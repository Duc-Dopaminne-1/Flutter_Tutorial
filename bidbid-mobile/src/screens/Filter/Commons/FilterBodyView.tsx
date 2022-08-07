import React, { ReactElement } from 'react';
import { View, ViewStyle } from 'react-native';

const CONTAINER: ViewStyle = {
  height: 470,
  marginTop: 15,
  paddingHorizontal: 15,
};

export interface FilterBodyViewProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function FilterBodyView(props: FilterBodyViewProps): ReactElement {
  const { style, children } = props;
  return <View style={[CONTAINER, style]}>{children}</View>;
}
