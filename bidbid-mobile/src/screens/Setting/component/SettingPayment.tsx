import { language } from '@/i18n';
import SettingTitle from '@/screens/Setting/component/SettingTitle';
import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import PaymentContainer from './payment/PaymentContainer';

export function SettingPayment(): ReactElement {
  return (
    <View style={styles.container}>
      <SettingTitle title={language('paymentSettings')} />
      <PaymentContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});
