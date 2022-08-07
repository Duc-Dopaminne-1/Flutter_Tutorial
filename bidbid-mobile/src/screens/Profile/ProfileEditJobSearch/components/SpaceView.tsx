import React, { memo } from 'react';
import { View, ViewStyle } from 'react-native';

interface SpaceViewProps {
  style?: ViewStyle;
}

const CONTAINER: ViewStyle = {
  height: 10,
  width: 20,
};

function SpaceView(props: SpaceViewProps) {
  const { style = CONTAINER } = props;
  return <View style={style} />;
}

export default memo(SpaceView);
