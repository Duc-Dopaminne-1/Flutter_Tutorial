import { useNavigation } from '@react-navigation/native';

import {
  clearLeadContactForCredit,
  createDepositPaymentTransactionHandle,
  getFinanceDealOrderFormClear
} from '../../../redux/actions/credit';

import { CASHOUT } from '../../../redux/actionsType';
import {
  BecomeTopener,
  ExpandView,
  PrimaryButton,
  SecondaryButton,
  SubHead,
  TextView,
  WithLoading
} from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import { formatNumber } from '../../../helpers/formatNumber';
import React, { useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ATTRIBUTE_TYPE } from '../../../global/entity_type';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';
import { getBecomeTopenerHandle } from '../../../redux/actions/masterData';
import { store } from '../../../redux/store/configureStore';

const ConfirmOrder = props => {
  const { route } = props;
  const { form } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { depositMoney } = useSelector(state => state.deposit);

  const theme = useContext(themeContext);
  useEffect(() => {
    dispatch(clearLeadContactForCredit());
    navigation.setOptions({
      hideLeftHeader: true
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    dispatch(getBecomeTopenerHandle());
  }, [dispatch]);
  const gotoDepositPolicy = () => {
    navigation.navigate(SCREENS_NAME.POLICY_CREDIT_DEPOSIT_ORDER_SCREEN);
  };

  const goBack = React.useCallback(() => {
    dispatch(getFinanceDealOrderFormClear());
    navigation.navigate(SCREENS_NAME.CREDIT_ORDER_DETAIL_SCREEN, {
      orderId: form.id,
      item: form,
      goBack: SCREENS_NAME.MIDDLEWARE
    });
  }, [form, dispatch, navigation]);

  const payment = async () => {
    if (depositMoney === 0) {
      // no payment required
      navigation.navigate(SCREENS_NAME.DEPOSIT_LOAN, {
        form,
        depositMoney
      });
      return;
    }
    // payment required
    const memberId = store.getState().auth.memberId;
    const callback = data => {
      if (data) {
        const { urlPayment, isSandbox, tmnCode, invoiceId } = data;
        const paymentInfo = {
          amount: depositMoney,
          paymentUrl: urlPayment,
          isSandbox,
          tmnCode,
          invoiceId
        };
        navigation.navigate(SCREENS_NAME.VN_PAY_SCREEN, {
          orderInfo: form || {},
          flowCode: 'AdditionalServicePayment',
          headerSuccess: 'screen_name.deposit_loan_application',
          deposit: true,
          paymentInfo
        });
      }
    };
    dispatch(
      createDepositPaymentTransactionHandle({ orderId: form?.id || '', memberId, callback })
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <ExpandView
          translateTitle
          style={styles.expandView}
          title={form?.ordersItem?.name || ''}
          canExpand={false}>
          <>
            <TextView
              translate
              title={'product_screen.product_groups'}
              type={ATTRIBUTE_TYPE.text}
              value={form?.ordersItem?.categoryName || ''}
              style={styles.inputContainer}
            />
            <TextView
              translate
              title={'product_screen.supplier'}
              type={ATTRIBUTE_TYPE.text}
              value={form?.partnerName || ''}
              style={styles.inputContainer}
            />
            <TextView
              translate
              title={'loan_package.loan_title'}
              type={ATTRIBUTE_TYPE.text}
              value={
                <AppText translate>
                  {formatNumber(form?.ordersItem?.loanAmount || '0') + ''} {'common.currency'}
                </AppText>
              }
              style={styles.inputContainer}
            />
            <TextView
              translate
              title={'loan_package.borrowed_time_title'}
              type={ATTRIBUTE_TYPE.text}
              value={form?.ordersItem?.loanPeriod || ''}
              suffix={'time.months'}
              style={styles.inputContainer}
            />
            <TextView
              translate
              type={ATTRIBUTE_TYPE.text}
              title={'loan_package.deposit_amount'}
              value={
                <AppText translate>
                  {formatNumber(depositMoney) + ''} {'common.currency'}
                </AppText>
              }
              suffix={'VND'}
              style={styles.inputContainer}
            />
          </>
        </ExpandView>
        <Text style={styles.tutorialText}>
          <SubHead italic={true} translate style={styles.tutorial}>
            deposit_loan_application.policy_guide
          </SubHead>
          <Text onPress={gotoDepositPolicy}>
            <SubHead
              translate
              italic={true}
              style={[styles.tutorial, { color: theme?.app?.primaryColor2 }]}>
              deposit_loan_application.deposit_policy
            </SubHead>
          </Text>
        </Text>
        <BecomeTopener />
      </ScrollView>
      <View style={styles.footer}>
        <View style={[styles.flex, { marginRight: scale(15) }]}>
          <SecondaryButton translate title={'common.pay_later'} onPress={goBack} />
        </View>
        <View style={styles.flex}>
          <PrimaryButton
            translate
            onPress={payment}
            title={'common.payment'}
            disabledText={styles.disabledText}
            backgroundColorDisabled={BACKGROUND_COLOR.Silver}
          />
        </View>
      </View>
    </View>
  );
};

export default WithLoading(ConfirmOrder, [CASHOUT.CREATE_OR_EDIT_TRANSACTION.HANDLER]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  wrapper: {
    paddingVertical: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  flex: {
    flex: 1
  },
  header: {
    marginTop: SPACING.Medium * 2,
    marginBottom: SPACING.Medium,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    color: CUSTOM_COLOR.BlueStone,
    textAlign: 'center',
    marginBottom: scale(25)
  },
  expandView: {
    marginHorizontal: SPACING.Medium,
    marginVertical: SPACING.Normal
  },
  moreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.Medium
  },
  more: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: TEXT_COLOR.GreenLight,
    marginRight: SPACING.Normal
  },
  tutorial: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.BodyText,
    textAlign: 'justify'
  },

  tutorialText: {
    marginTop: SPACING.Medium,
    marginHorizontal: SPACING.Medium,
    marginBottom: SPACING.Large
  },
  footer: {
    padding: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.White,
    flexDirection: 'row'
  },
  backTitle: {
    color: CUSTOM_COLOR.Orange
  },
  disabledText: {
    color: CUSTOM_COLOR.White
  }
});
