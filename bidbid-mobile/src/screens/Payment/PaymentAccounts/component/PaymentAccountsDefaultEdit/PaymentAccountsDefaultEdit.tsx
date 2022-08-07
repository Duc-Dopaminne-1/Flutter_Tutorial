import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import CustomHeader from '@/components/CustomHeader';
import { CustomLine } from '@/components/CustomeLine';
import { PaymentAccountsDefaultEditList } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsDefaultEdit/PaymentAccountsDefaultEditList';
import { isIOS } from '@/shared/devices';
import CloseSVG from '@/components/SVG/CloseSVG';

interface Prop {
  onPressOut?: () => void;
  payments: any;
  paymentDefaultId?: number;
  isFromDefaultReceived?: boolean;
}

export function PaymentAccountsDefaultEdit(props: Prop): ReactElement {
  const { onPressOut, payments, paymentDefaultId, isFromDefaultReceived } = props;
  return (
    <View style={styles.container}>
      <CustomHeader
        goBack={onPressOut}
        titleStyle={styles.title}
        leftIcon={<CloseSVG />}
        containerStyle={styles.containerStyle}
        title={isFromDefaultReceived ? language('changeReceivedAccount') : language('changeDefaultPayment')}
      />
      <CustomLine />
      <PaymentAccountsDefaultEditList
        isFromDefaultReceived={isFromDefaultReceived}
        paymentDefaultId={paymentDefaultId}
        listPayment={payments}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  containerStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
    backgroundColor: colors.transparent,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.gray_900,
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: fonts.size.s18,
  },
});
