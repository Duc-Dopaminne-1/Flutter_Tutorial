import React from 'react';
import { ViewStyle, Text, TextStyle, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/vars/index';
import { isIOS } from '@/shared/devices';

const CONTAINER: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 12,
  backgroundColor: colors.bg_gray,
};

const TITLE: TextStyle = {
  padding: 12,
  fontSize: fonts.size.s16,
  color: colors.white,
  fontWeight: isIOS ? '600' : 'bold',
  fontFamily: fonts.family.PoppinsRegular,
};

interface AppButtonProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  title: string;
  onPress?: () => void;
}

function AppButton(props: AppButtonProps) {
  const { style = CONTAINER, title = '', onPress, textStyle } = props;
  return (
    <TouchableOpacity style={[CONTAINER, style]} onPress={onPress}>
      <Text style={[TITLE, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(AppButton);
