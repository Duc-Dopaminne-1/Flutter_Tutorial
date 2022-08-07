import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActionSaveAllPaymentPayload } from '@/redux/payment';
import PaymentAccountsDefaultEditListItem from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsDefaultEdit/PaymentAccountsDefaultEditListItem';
import { PaymentAccountsModalContext } from '@/screens/Payment/PaymentAccounts/PaymentAccountsContext';
import { formatNamePayment } from '@/shared/processing';
import { PaymentReceivedAccountsContext } from '@/screens/Payment/PaymentAccounts/PaymentReceivedAccountsContext';
import { screenHeight } from '@/vars';

interface Prop {
  listPayment: ActionSaveAllPaymentPayload[];
  paymentDefaultId?: number;
  isFromDefaultReceived?: boolean;
}
export function PaymentAccountsDefaultEditList(props: Prop): ReactElement {
  const { listPayment, paymentDefaultId, isFromDefaultReceived } = props;
  const [itemSelected, setItemSelected] = useState(-1);
  const { onSelectedItem } = useContext(PaymentAccountsModalContext);
  const { onSelectedItemReceived } = useContext(PaymentReceivedAccountsContext);

  useEffect(() => {
    setItemSelected(paymentDefaultId);
    isFromDefaultReceived ? onSelectedItemReceived(paymentDefaultId) : onSelectedItem(paymentDefaultId);
  }, [paymentDefaultId]);

  const onPress = (itemId: number) => {
    if (itemSelected !== itemId) {
      setItemSelected(itemId);
      isFromDefaultReceived ? onSelectedItemReceived(itemId) : onSelectedItem(itemId);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <PaymentAccountsDefaultEditListItem
        onPress={() => onPress(item.id)}
        id={item.id}
        item={item}
        itemSelected={itemSelected}
        title={formatNamePayment(item)}
      />
    );
  };

  const keyExtractor = item => item.id.toString();

  if (listPayment.length === 0) {
    return <View style={styles.empty} />;
  }

  return (
    <View>
      <FlatList style={styles.empty} data={listPayment} renderItem={renderItem} keyExtractor={keyExtractor} />
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    maxHeight: (screenHeight * 3) / 5,
    minHeight: 200,
    paddingBottom: 30,
  },
});
