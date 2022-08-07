import { View, Image } from 'react-native';
import styles from './styles';
import React from 'react';
import { CustomText } from '../CustomText';
import { RADIO_ACTIVE, RADIO_INACTIVE, CREDIT_CARD, PAYPAL } from '@src/constants/icons';
import { CustomTouchable } from '../CustomTouchable';
import { ProviderEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop';

interface Props {
  paymentMethod: ProviderEnum;
  isActive?: boolean;
  onPress?: () => void;
}

const PaymentMethodItem = (props: Props) => {
  const { paymentMethod, isActive = true, onPress } = props;

  const renderDetail = () => {
    if (paymentMethod == ProviderEnum.Stripe) {
      return (
        <View style={styles.detailContainer}>
          <CustomText style={styles.title} text={'Credit Card'} />
          <Image style={styles.logoCreditCard} source={CREDIT_CARD} />
        </View>
      );
    } else {
      return (
        <View style={styles.detailContainer}>
          <Image style={styles.logoPaypal} source={PAYPAL} />
        </View>
      );
    }
  };

  return (
    <CustomTouchable style={styles.container} onPress={onPress}>
      <Image style={styles.radioButton} source={isActive ? RADIO_ACTIVE : RADIO_INACTIVE} />
      {renderDetail()}
    </CustomTouchable>
  );
};

export { PaymentMethodItem };
