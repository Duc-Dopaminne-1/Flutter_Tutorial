import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import CustomHeader from '@/components/CustomHeader';
import { CustomLine } from '@/components/CustomeLine';
import PaymentAccountsSelectMethodItem from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsAddPayment/PaymentAccountsSelectMethodItem';
import { RulePayment } from '@/constants/app';
import { isIOS } from '@/shared/devices';
import NavigationActionsService from '@/navigation/navigation';
import { PAYMENT_ADD_CARD_SCREEN, PAYMENT_CREATE_PAYPAL_SCREEN } from '@/navigation/screenKeys';
import CloseSvg from '@/components/SVG/CloseSVG';

interface Prop {
  onPressOut?: () => void;
}

export function PaymentAccountsAddPayment(props: Prop): ReactElement {
  const { onPressOut } = props;

  const onPressPaypal = () => {
    onPressOut && onPressOut();
    NavigationActionsService.push(PAYMENT_CREATE_PAYPAL_SCREEN);
  };

  const onPressCard = () => {
    onPressOut && onPressOut();
    NavigationActionsService.push(PAYMENT_ADD_CARD_SCREEN);
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        leftIcon={<CloseSvg />}
        goBack={onPressOut}
        wrapIconStyle={styles.wrapIconClose}
        titleStyle={styles.title}
        containerStyle={styles.containerStyle}
        title={language('selectPaymentMethod')}
      />
      <CustomLine />

      <PaymentAccountsSelectMethodItem onPress={onPressPaypal} type={RulePayment.PayPal} title={language('payPal')} />
      <PaymentAccountsSelectMethodItem onPress={onPressCard} type={RulePayment.Card} title={language('creditDebit')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 40,
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
  wrapIconClose: {
    paddingVertical: 0,
  },
});
