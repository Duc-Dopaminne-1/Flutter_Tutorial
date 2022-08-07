import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { throttle } from 'lodash';

interface Props {
  onPress?: () => void;
  onLongPress?: () => void;
  children?: any;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  activeOpacity?: number;
}

const CustomTouchable = (props: Props) => {
  const { children, onPress, onLongPress, style, activeOpacity, disabled = false } = props;

  const onCustomPressThrottle = onPress ? throttle(onPress, 2000, { leading: true, trailing: false }) : undefined;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onCustomPressThrottle}
      onLongPress={onLongPress}
      style={style}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
};

export { CustomTouchable };
