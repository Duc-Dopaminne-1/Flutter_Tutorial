import React from 'react';
import { CustomTouchable } from "../CustomTouchable";
import { View, ViewStyle } from 'react-native';
import { CustomText } from '../CustomText';
import styles from './styles';
import { WIDTH } from '@src/constants/vars';

import translate from '@src/localize';
export interface ExpireDate {
  id: string;
  title: string;
  isRightComponent: boolean;
}

export const expireDateData: ExpireDate[] = [
  { id: '1', title: translate('new_instruction.expire_in'), isRightComponent: true },
  { id: '2', title: translate('new_instruction.expire_on_date'), isRightComponent: true },
  { id: '3', title: translate('new_instruction.expire_immediately'), isRightComponent: false },
  { id: '4', title: translate('new_instruction.no_expire'), isRightComponent: false },
];

interface Props {
  item: ExpireDate;
  rightComponent?: any;
  selectedId: string;
  onPressExpireItem: (item: any) => void;
  styleContainerRadioBtn?: ViewStyle | ViewStyle[];
  styleCustomRadioBtn?: ViewStyle | ViewStyle[];
  styleActiveRadioBtn?: ViewStyle | ViewStyle[];
  styleLabelRadioBtn?: ViewStyle | ViewStyle[];
  styleRightComponentContainer?: ViewStyle | ViewStyle[];
}
const CustomRadioButton = (props: Props) => {
  const { item, rightComponent, styleContainerRadioBtn, styleCustomRadioBtn, styleActiveRadioBtn, styleLabelRadioBtn, selectedId, onPressExpireItem, styleRightComponentContainer } = props;
  const isSelected = selectedId == item.id;
  return (
    <View style={[styles.containerRadiusBtn, styleContainerRadioBtn]}>
      <CustomTouchable style={styles.radioButtonView} onPress={() => onPressExpireItem(item)}>
        <View style={[styles.customRadioBtn, isSelected ? styles.activeCustomRadioBtn : null, styleCustomRadioBtn]}>
          {isSelected ?
            <View style={[styles.activeRadioBtn, styleActiveRadioBtn]} />
            : null}
        </View>
        <CustomText
          text={item.title}
          styleContainer={styles.textContainer}
          style={[styles.labelRadioButton, styleLabelRadioBtn]}
        />
      </CustomTouchable>
      {rightComponent ? <View style={[{ width: WIDTH / 2 }, styleRightComponentContainer]}>{rightComponent}</View> : null}
    </View>
  );
};

export default React.memo(CustomRadioButton);
