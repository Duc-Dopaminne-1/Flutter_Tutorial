import CustomItemSetting from '@/components/CustomItemSetting';
import { RulePayment } from '@/constants/app';
import { language } from '@/i18n';
import { PAYMENT_ACCOUNTS_SCREEN } from '@/navigation/screenKeys';
import { PaymentInit } from '@/redux/payment/reducer';
import { useNavigation } from '@react-navigation/native';
import React, { memo, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import IconGrayPaymentSVG from '@/components/SVG/IconGrayPaymentSVG';

const PaymentContainer = (): ReactElement => {
  const navigation = useNavigation();

  const payments = useSelector((state: PaymentInit) => state.payment.data);
  const listCreditCard = payments.filter(item => item.type === 'credit_card');
  const listPayment = payments.filter(item => item.type === RulePayment.PayPal);

  let paymentDescription = '';

  if (listCreditCard.length === 0 && listPayment.length === 0) {
    paymentDescription = language('filterScreen.none');
  } else if (listCreditCard.length > 0 && listPayment.length > 0) {
    paymentDescription = `${listCreditCard.length} ${language('creditCard')}, ${listPayment.length} ${language('payPal')}`;
  } else {
    if (listCreditCard.length > 0) paymentDescription = `${listCreditCard.length} ${language('creditCard')}`;
    else paymentDescription = `${listPayment.length}  ${language('payPal')}`;
  }
  return (
    <CustomItemSetting
      onPress={() => navigation.navigate(PAYMENT_ACCOUNTS_SCREEN)}
      title={language('paymentMethod')}
      content={paymentDescription}
      image={<IconGrayPaymentSVG />}
    />
  );
};

export default memo(PaymentContainer);
