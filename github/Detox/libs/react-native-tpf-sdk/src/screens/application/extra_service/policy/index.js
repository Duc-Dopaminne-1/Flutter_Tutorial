import { useNavigation } from '@react-navigation/native';

import { AppLoading, PrimaryButton } from '../../../../components/';
import AppText from '../../../../components/app_text';
import { FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR } from '../../../../constants/colors';
import SCREENS_NAME from '../../../../constants/screens';
import { SPACING } from '../../../../constants/size';
import React, { useContext, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { EXTRA_SERVICE_ORDER_STATUS } from '../../../../global/order_status';
import { scale } from '../../../../utils/responsive';
import themeContext from '../../../../constants/theme/themeContext';
import { createExtraServicePaymentTransactionHandle } from '../../../../redux/actions/extraService';
import { store } from '../../../../redux/store/configureStore';

const Policy = props => {
  const navigation = useNavigation();
  const { route } = props;
  const { orderDetail } = route.params;
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const theme = useContext(themeContext);

  const onContinue = () => {
    setLoading(true);
    let price = Math.round(orderDetail?.ordersItem?.prepayment) || orderDetail?.ordersItem?.price;
    if (EXTRA_SERVICE_ORDER_STATUS.WaitingForRemainingPayment === orderDetail.status) {
      price = Math.round(orderDetail?.ordersItem?.remainingFee) || orderDetail?.ordersItem?.price;
    }

    const memberId = store.getState().auth.memberId;
    const callback = data => {
      setLoading(false);
      if (data) {
        const { urlPayment, isSandbox, tmnCode, invoiceId } = data;
        const paymentInfo = {
          amount: price,
          paymentUrl: urlPayment,
          isSandbox,
          tmnCode,
          invoiceId
        };
        navigation.navigate(SCREENS_NAME.VN_PAY_SCREEN, {
          orderInfo: orderDetail,
          flowCode: 'AdditionalServicePayment',
          headerSuccess: [
            EXTRA_SERVICE_ORDER_STATUS.WaitingForDepositPayment,
            EXTRA_SERVICE_ORDER_STATUS.CompleteDepositPayment
          ].includes(orderDetail.status)
            ? 'application_list.successful_first_payment'
            : 'application_list.remaining_payment_successful',
          paymentInfo
        });
      }
    };
    dispatch(
      createExtraServicePaymentTransactionHandle({
        memberId,
        orderId: orderDetail?.orderId || '',
        callback
      })
    );
  };

  const styleOrderNumber = useMemo(
    () => ({
      ...styles.sttText,
      color: theme?.app?.primaryColor1,
      fontFamily: theme?.fonts?.REGULAR
    }),
    [(styles, theme)]
  );

  return (
    <View forceInset={{ bottom: 'never' }} style={styles.container}>
      <AppLoading loading={isLoading} />
      <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <AppText translate numberOfLines={3} style={styles.textTitle}>
          {'policy_extra_service_application.title'}
        </AppText>
        <Text style={styles.decription}>
          <AppText translate>{'policy_extra_service_application.description'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>1. </Text>
          <AppText translate>{'policy_extra_service_application.content_01'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>a. </Text>
          <AppText translate>{'policy_extra_service_application.content_01_1'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>b. </Text>
          <AppText translate>{'policy_extra_service_application.content_01_2'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>2. </Text>
          <AppText translate>{'policy_extra_service_application.content_02'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>3. </Text>
          <AppText translate>{'policy_extra_service_application.content_03'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>4. </Text>
          <AppText translate>{'policy_extra_service_application.content_04'}</AppText>
        </Text>
      </ScrollView>
      <View style={styles.btnContainer}>
        <PrimaryButton translate title={'common.payment'} onPress={onContinue} />
      </View>
    </View>
  );
};

export default Policy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  textTitle: {
    textAlign: 'center',
    marginBottom: SPACING.Large,
    lineHeight: LINE_HEIGHT.BodyText,
    fontSize: FONT_SIZE.BodyText,
    fontWeight: '700'
  },
  wrapper: {
    paddingHorizontal: SPACING.Medium,
    paddingBottom: scale(60),
    marginTop: SPACING.XXLarge
  },
  sttText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    fontWeight: '700'
  },
  decription: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginBottom: SPACING.Large,
    fontWeight: '400',
    textAlign: 'justify'
  },

  checkBoxIC: {
    marginTop: scale(4)
  },
  textContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.Medium,
    paddingTop: SPACING.Fit
  },

  policyContainer: {
    marginBottom: scale(-3)
  },
  policy: {
    lineHeight: LINE_HEIGHT.SubHead,
    fontSize: FONT_SIZE.BodyText,
    textDecorationLine: 'underline'
  },
  checkBoxView: {
    paddingBottom: SPACING.Medium,
    alignItems: 'flex-start',
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  btnContainer: {
    marginHorizontal: SPACING.Medium,
    marginTop: scale(24)
  }
});
