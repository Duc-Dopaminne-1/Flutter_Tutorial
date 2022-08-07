import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import styles from './styles';
import ModalDropdown from '../Scripts/DropDown';
import FastImage from 'react-native-fast-image';
import Triangle from '@res/icons/Triangle.png';
interface Props {
  data: string[];
  containerStyle?: ViewStyle;
  dropdownTextStyle?: TextStyle;
  dropdownItemStyle?: ViewStyle;
  defaultValue: string;
  onSelect: (idx: number, value: string) => void;
  isStaticButton?: boolean;
  defaultIndex?: number;
}
const CustomDropDown = (props: Props) => {
  return (
    <View style={[{ width: '100%', flexDirection: 'row' }, props.containerStyle]}>
      <ModalDropdown
        options={props.data}
        style={[styles.comonComponentStyle]}
        textStyle={styles.textStyle}
        dropdownTextStyle={[styles.dropdownTextStyle, props.dropdownTextStyle]}
        dropdownStyle={[props.dropdownItemStyle, styles.dropDownItemStyle]}
        onSelect={(idx: number, value: string) => props.onSelect(idx, value)}
        defaultValue={props.defaultValue}
        defaultIndex={props.defaultIndex}
        showsVerticalScrollIndicator={false}
        isStaticButton={props.isStaticButton}
      />
      <View style={styles.dropdownIconStyle}>
        <FastImage source={Triangle} style={{ width: 10, height: 10 }} />
      </View>
    </View>
  );
};
export default CustomDropDown;
