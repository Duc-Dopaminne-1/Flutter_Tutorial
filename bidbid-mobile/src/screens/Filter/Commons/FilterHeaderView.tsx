import React, { ReactElement } from 'react';
import { TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';
import IconBack from '@/components/SVG/BackSvg';
import CloseSvg from '@/components/SVG/CloseSVG';

const CONTAINER: ViewStyle = {
  height: 55,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.white,
  overflow: 'hidden',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
};

const WRAPPER_CLOSE_ICON: ViewStyle = {
  position: 'absolute',
  width: 50,
  height: 50,
  alignItems: 'center',
  justifyContent: 'center',
  left: 5,
};

const WRAPPER_RESET_BUTTON: ViewStyle = {
  position: 'absolute',
  height: 50,
  alignItems: 'center',
  justifyContent: 'center',
  right: 15,
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s17,
  color: colors.gray_900,
  fontFamily: fonts.family.PoppinsSemiBold,
};

const RESET: TextStyle = {
  fontSize: 14,
  color: colors.gray_500,
};

export interface FilterHeaderViewProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle;

  closeOnPressed?: () => void;

  resetOnPressed?: () => void;

  title: string;

  leftIcon: 'close' | 'back';
}

export function FilterHeaderView(props: FilterHeaderViewProps): ReactElement {
  const { leftIcon = 'back', title = '', closeOnPressed = () => {}, resetOnPressed = () => {} } = props;
  const leftIconSource = leftIcon === 'back' ? <IconBack /> : <CloseSvg />;

  return (
    <View style={CONTAINER}>
      <TouchableOpacity style={WRAPPER_CLOSE_ICON} onPress={closeOnPressed}>
        {leftIconSource}
      </TouchableOpacity>
      <DefaultText style={TITLE}>{title}</DefaultText>
      <TouchableOpacity style={WRAPPER_RESET_BUTTON} onPress={resetOnPressed}>
        <DefaultText style={RESET}>{language('filterScreen.reset')}</DefaultText>
      </TouchableOpacity>
    </View>
  );
}
