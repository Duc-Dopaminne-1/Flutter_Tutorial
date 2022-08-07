import React, { ReactElement } from 'react';
import { TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '@/vars';
import { language } from '@/i18n';
import { Dimension } from '@/vars/dimensions';
import DefaultText from '@/components/CustomText/DefaultText';

const CONTAINER: ViewStyle = {
  height: 65,
  backgroundColor: colors.white,
};

const APPLY_BUTTON: ViewStyle = {
  marginTop: 20,
  marginHorizontal: 30,
  justifyContent: 'center',
  height: Dimension.button.medium_height,
  backgroundColor: colors.red_700,
  borderRadius: Dimension.button.medium_radius,
  flexDirection: 'row',
  alignItems: 'center',
};

const CURRENT_BID_TEXT: TextStyle = {
  fontSize: 18,
  color: colors.white,
  alignItems: 'center',
};

export interface FilterBottomViewProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle;

  applyOnPressed?: () => void;

  title?: string;
}

export function FilterBottomView(props: FilterBottomViewProps): ReactElement {
  const { style, title = language('filterScreen.save'), applyOnPressed = () => {} } = props;
  return (
    <View style={[CONTAINER, style]}>
      <TouchableOpacity style={APPLY_BUTTON} onPress={applyOnPressed}>
        <DefaultText {...{ style: CURRENT_BID_TEXT }}>{title}</DefaultText>
      </TouchableOpacity>
    </View>
  );
}
