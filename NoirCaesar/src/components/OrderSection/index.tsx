import { View } from 'react-native';
import styles from './styles';
import React from 'react';
import { CustomText } from '../CustomText';
import translate from '@src/localize';
import { CustomTouchable } from '../CustomTouchable';

interface Props {
  title: string;
  status: string;
  onPressPayment: () => void;
}

const OrderSection = (props: Props) => {
  const { title, status, onPressPayment } = props;

  const renderPaymentButton = () => (
    <CustomTouchable style={styles.paymentButton} onPress={onPressPayment}>
      <CustomText style={{ fontSize: 12 }} text={translate('order.payment')} />
    </CustomTouchable>
  );

  const renderStatus = () => <CustomText style={styles.status} text={status} />;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <CustomText text={`Order #${title}`} />
        {renderStatus()}
      </View>
      {status === 'Fullfilled' && renderPaymentButton()}
    </View>
  );
};

export { OrderSection };
