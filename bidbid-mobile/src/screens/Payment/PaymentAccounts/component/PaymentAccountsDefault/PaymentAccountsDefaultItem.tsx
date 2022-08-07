import React, { ReactElement } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { PaymentAccountsItem } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsItem';
import { ActionSaveAllPaymentPayload } from '@/redux/payment';
import { formatNamePayment } from '@/shared/processing';

interface Prop {
  listPayment: ActionSaveAllPaymentPayload[];
}

export function PaymentAccountsDefaultItem(props: Prop): ReactElement {
  const { listPayment } = props;

  const renderItem = ({ item }) => {
    return <PaymentAccountsItem item={item} isFromDefault={true} title={formatNamePayment(item)} />;
  };

  const keyExtractor = item => item.id.toString();

  return (
    <View>
      <FlatList
        style={styles.wrapList}
        data={listPayment}
        scrollEnabled={false}
        key={'card'}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapList: {
    paddingHorizontal: 15,
  },
});
