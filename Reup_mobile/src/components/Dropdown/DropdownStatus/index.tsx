import React, { Component, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ViewStyle } from 'react-native';
import styles from './styles';
import DropdownIcon from '@src/res/icons/dropdown-icon/dropdown-icon.png';
import DropdownNative, { ObjDropdown, Props } from '../DropdownNative';
import { CustomText } from '@src/components/CustomText';
import NewIcon from '@src/res/icons/new-request-icon/new-request-icon.png';
import PendingIcon from '@src/res/icons/pending-request-icon/pending-request-icon.png';
import InProgressIcon from '@src/res/icons/inprogress-request-icon/inprogress-request-icon.png';
import DoneIcon from '@src/res/icons/done-request-icon/done-request-icon.png';
import { getIconStatusRequest, StatusEnum } from '@src/components/MaintenanceRequests/ListContent';

export const listStatus: ObjDropdown[] =
  [
    { _key: StatusEnum.new, _value: StatusEnum.new },
    { _key: StatusEnum.pending, _value: StatusEnum.pending },
    { _key: StatusEnum.process, _value: StatusEnum.process },
    { _key: StatusEnum.done, _value: StatusEnum.done },
  ];

const DropdownStatus = (props: Props & {
  title?: string,
  titleStyle?: ViewStyle;
  moreStyle?: ViewStyle;
  value?: ObjDropdown;
  onChangeDropDown: (obj: ObjDropdown) => void;
  inputRef?: any;
  onFocus?: () => void;
}) => {
  const { title, titleStyle, moreStyle, value, onChangeDropDown, onFocus, } = props;
  const [icon, setIcon] = useState<any>(value ? getIconStatusRequest(value._key) : getIconStatusRequest(StatusEnum.new));
  const [idxStatus, setIdxStatus] = useState<number>(value ? listStatus.findIndex(obj => obj._key === value?._key) : 0);

  const onChangeDropDownStatus = (obj: any) => {
    setIdxStatus(obj && obj._index ? obj._index : 0)
    if (obj._key == StatusEnum.new) {
      setIcon(NewIcon)
    } else if (obj._key == StatusEnum.pending) {
      setIcon(PendingIcon)
    } else if (obj._key == StatusEnum.process) {
      setIcon(InProgressIcon)
    } else {
      setIcon(DoneIcon)
    }
  }

  return (
    <View style={styles.container}>
      {title ? <CustomText styleContainer={titleStyle} style={styles.title} text={title} /> : null}
      <View style={[styles.formBar, moreStyle]}>
        <Image source={icon} resizeMode={'contain'} style={styles.icon} />
        <DropdownNative
          ref={props.inputRef}
          arrData={listStatus}
          containerStyle={styles.dropdownContainer}
          selected={idxStatus}
          lineBottom={false}
          onFocus={onFocus}
          onRef={props.onRef}
          onUpArrow={props.onUpArrow}
          onDownArrow={props.onDownArrow}
          onPressDown={props.onPressDown}
          onPressUp={props.onPressUp}
          onChangeDropDown={(obj) => {
            onChangeDropDownStatus(obj)
            onChangeDropDown(obj)
          }}
          linearGradientColors={["transparent", "transparent"]}
          textStyle={styles.titleStatus}
          iconRightStyle={styles.arrowImage}
          textTitle={title}
          isHideTitle={true}
        />
      </View>
    </View>
  );
};

export default DropdownStatus;
