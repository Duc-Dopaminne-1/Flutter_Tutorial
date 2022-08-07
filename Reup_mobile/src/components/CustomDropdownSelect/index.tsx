import React from 'react';
import DropdownNative, { Props } from '../Dropdown/DropdownNative';
import { styles } from './styles';
import { View } from 'react-native-animatable';
import { CustomText } from '../CustomText';
import { CustomTextRequired } from '../CustomTextWithRequired';

export const CustomDropdownSelect = (
  props: Props & {
    containerMainStyle?: any;
    inputRef?: any;
    onFocus?: () => void;
    isShowRequired?: boolean;
  },
) => {
  return (
    <View style={[styles.container, props.containerMainStyle]}>
      {props.textTitle ?
        props.isShowRequired ?
          <CustomTextRequired style={styles.description} text={props.textTitle ?? ''} />
          : <CustomText style={styles.description} text={props.textTitle ?? ''} />
        : null}
      <DropdownNative
        ref={props.inputRef}
        onFocus={props.onFocus}
        onRef={props.onRef}
        isHideTitle={true}
        onUpArrow={props.onUpArrow}
        onDownArrow={props.onDownArrow}
        contentDropdownStyle={styles.contentDropdownStyle}
        containerStyle={styles.dropdownContainer}
        textStyle={styles.textStyle}
        {...props}
        iconRightStyle={styles.arrowImage}
      />
    </View>
  );
};
