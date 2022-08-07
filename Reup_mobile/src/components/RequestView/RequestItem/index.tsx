import React from 'react';
import { View } from 'react-native';
import styles from './styles';

import TypeRequest from '@src/components/RequestView/enum';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { CustomText } from '@src/components/CustomText';
import CircleRequest from '../CircleRequest';

interface Props {
  widthPercent?: string;
  heightPercent?: string;
  backgroundColor?: string;
  typeRequest?: TypeRequest;
  numberRequest?: number;
  icon?: string;
  title?: string;
  borderColor?: string;
  onPressItem: (typeRequest: TypeRequest) => void;
}

const RequestItem = (props: Props) => {
  const { widthPercent, backgroundColor, typeRequest, icon, borderColor, title, numberRequest = 0, onPressItem } = props;
  let displayNumber = numberRequest.toString();
  if (numberRequest >= 100) {
    displayNumber = '99+';
  } else {
    displayNumber = numberRequest.toString();
  }
  return (
    <View
      style={[
        styles.container,
        {
          width: widthPercent,
          height: widthPercent,
          backgroundColor: backgroundColor,
        },
      ]}
    >
      <CustomTouchable
        onPress={() => {
          onPressItem(typeRequest);
        }}
      >
        <CircleRequest icon={icon} borderColor={borderColor} />
        <View style={styles.textContainer}>
          <CustomText style={[styles.number, { color: borderColor }]} text={displayNumber + ' '} />
          <CustomText style={[styles.title, { color: borderColor }]} text={title ? title : ''}></CustomText>
        </View>
      </CustomTouchable>
    </View>
  );
};

export default RequestItem;
