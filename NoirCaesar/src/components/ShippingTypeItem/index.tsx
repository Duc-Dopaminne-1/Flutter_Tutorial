import { View, Image, Alert } from 'react-native';
import styles from './styles';
import React from 'react';
import { CustomText } from '../CustomText';
import { RADIO_ACTIVE, RADIO_INACTIVE } from '@src/constants/icons';
import { CustomTouchable } from '../CustomTouchable';
import { IShippingMethod } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { formatPrice } from '@src/utils';

interface Props {
  item: IShippingMethod;
  isActive?: boolean;
  onPressItem?: () => void;
}

const ShippingTypeItem = (props: Props) => {
  const { item, isActive = true, onPressItem } = props;

  return (
    <CustomTouchable style={styles.container} onPress={onPressItem}>
      <View style={styles.titleContainer}>
        <Image style={styles.radioButton} source={isActive ? RADIO_ACTIVE : RADIO_INACTIVE} />
        <CustomText style={styles.title} text={item.name} />
      </View>
      <View style={styles.detailContainer}>
        <CustomText style={styles.description} text={item.description} />
        <CustomText style={styles.price} text={`${formatPrice(item.price.excl_tax)}`} />
      </View>
    </CustomTouchable>
  );
};

export { ShippingTypeItem };
