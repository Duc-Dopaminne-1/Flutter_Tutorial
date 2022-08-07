import React, { ReactElement, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { PaymentAccountsTitle } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsTitle';
import { language } from '@/i18n';
import { PaymentAccountsItem } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsItem';
import { useNavigation } from '@react-navigation/native';
import { PAYMENT_INFO_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { useSelector } from 'react-redux';
import { PaymentInit } from '@/redux/payment/reducer';
import { ActionSaveAllPaymentPayload } from '@/redux/payment';
import { formatNamePayment } from '@/shared/processing';

export function PaymentAccountsCreditCards(): ReactElement {
  const navigation = useNavigation();
  const payments = useSelector((state: PaymentInit) => state.payment.data);
  const listPayment = payments.filter(item => item.type === 'credit_card');

  const onPressItem = useCallback((item: ActionSaveAllPaymentPayload) => {
    navigation.navigate(PAYMENT_INFO_DETAIL_SCREEN, {
      card: item,
    });
  }, []);

  const renderItem = ({ item }) => {
    return <PaymentAccountsItem item={item} onPress={onPressItem} title={formatNamePayment(item)} />;
  };

  const keyExtractor = item => item.id.toString();

  return (
    <View style={styles.container}>
      <PaymentAccountsTitle title={language('creditCard')} />
      <FlatList data={listPayment} scrollEnabled={false} key={'card'} renderItem={renderItem} keyExtractor={keyExtractor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 20,
  },
});
