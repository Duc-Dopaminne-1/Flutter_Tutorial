import React, { useState } from 'react';
import styles from './styles';
import { View } from 'react-native';
import { CustomText } from '../CustomText';
import { CustomButton } from '../CustomButton';
import translate from '@src/localize';
import CustomTextTicker from '../CustomTextTicker';


interface TenantTotalPaymentProps {
  totalAmount?: string;
  onPressCheckout?: () => void;
}

const TenantTotalPayment = (props: TenantTotalPaymentProps) => {
  const { totalAmount, onPressCheckout } = props;
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <CustomText
          text={translate("monthly_bill.total")}
          style={styles.title}
          styleContainer={styles.titleContainer}
        />
        <CustomTextTicker
          text={totalAmount ?? '$0'}
          styleText={styles.amount}
          numberOfLines={1}
          styleContainer={styles.amountContainer}
        />
      </View>
      <CustomButton
        onPress={onPressCheckout}
        text={translate("monthly_bill.checkout")}
      />
    </View>
  )
}
export default React.memo(TenantTotalPayment);
