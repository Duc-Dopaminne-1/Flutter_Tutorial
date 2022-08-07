import React from 'react';
import { View, ViewStyle, TextStyle, Image, ImageStyle } from 'react-native';
import styles from './styles';

import { ICON_ARROW_DOWN } from '@src/constants/icons';
import ModalDropdown from './CustomModalDropDown';
interface Props {
  data: string[];
  containerStyle?: ViewStyle;
  textStyle?: ViewStyle;
  dropdownTextStyle?: TextStyle;
  dropdownItemStyle?: ViewStyle;
  arrowStyle?: ImageStyle;
  defaultValue: string;
  onSelect: (idx: number, value: string) => void;
  disabled?: boolean;
}
const DropDown = (props: Props) => {
  return (
    <View style={styles.container}>
      <ModalDropdown
        options={props.data}
        style={[props.containerStyle, styles.comonComponentStyle]}
        textStyle={[styles.textStyle, props.textStyle]}
        dropdownTextStyle={[styles.dropdownTextStyle, props.dropdownTextStyle]}
        dropdownStyle={[styles.dropDownItemStyle, props.dropdownItemStyle]}
        onSelect={props.onSelect}
        defaultValue={props.defaultValue}
        showsVerticalScrollIndicator={false}
        disabled={props.disabled}
      />
      <Image source={ICON_ARROW_DOWN} style={[styles.arrowStyle, props.arrowStyle]} />
    </View>
  );
};
export default React.memo(DropDown);
