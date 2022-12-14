import { getPaymentResultClear, getPaymentResultHandle } from '../../../redux/actions/payment';
import { getShowAlertError } from '../../../redux/actions/system';
import { PAYMENT } from '../../../redux/actionsType';
import { WithLoading } from '../../../components/';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { PAYMENT_ERROR } from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import React, { useCallback, useContext, useEffect } from 'react';
import { ActivityIndicator, NativeEventEmitter, StyleSheet, View } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import VnpayMerchant, { VnpayMerchantModule } from 'react-native-vnpay-merchant';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import { useState } from 'react';
import settingContext from '../../../constants/setting/settingContext';
const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);

const MAX_TRY = 10;

const VNPayScreen = props => {
  const {
    navigation,
    route: { params: screenState }
  } = props;

  const { deposit, invoiceInfo, paymentInfo } = screenState;
  const { isSandbox, paymentUrl, tmnCode, amount, invoiceId } = paymentInfo;
  const [tryCount, setTryCount] = useState(0);
  const dispatch = useDispatch();
  const paymentResult = useSelector(state => state.payment.paymentResult);
  const settings = useContext(settingContext);
  const paymentSuccess = useCallback(() => {
    if (deposit) {
      navigation.navigate(SCREENS_NAME.DEPOSIT_LOAN, {
        invoiceInfo: {},
        form: screenState?.orderInfo,
        depositMoney: amount || '0'
      });
    } else {
      navigation.navigate(SCREENS_NAME.PAYMENT_RESULT_SCREEN, {
        flowCode: screenState?.flowCode,
        headerSuccess: screenState?.headerSuccess,
        // invoiceInfo: screenState?.invoiceInfo,
        orderInfo: screenState?.orderInfo,
        depositMoney: amount || '0'
      });
    }
    dispatch(getPaymentResultClear());
  }, [dispatch, navigation, deposit, invoiceInfo, screenState]);

  const paymentError = useCallback(() => {
    dispatch(
      getShowAlertError({
        ...PAYMENT_ERROR,
        message: 'payment_error.01',
        cancelAction: () => navigation.navigate(SCREENS_NAME.MIDDLEWARE),
        confirmAction: () => navigation.goBack(),
        btnLeft: 'common.go_to_homepage',
        btnRight: 'common.pay_back'
      })
    );
    dispatch(getPaymentResultClear());
  }, [dispatch, navigation]);

  const getPaymentResult = useCallback(() => {
    if (tryCount < MAX_TRY) {
      setTryCount(prev => prev + 1);
      dispatch(getPaymentResultHandle({ id: invoiceId }));
    } else {
      paymentError();
    }
  }, [tryCount, paymentError]);

  useEffect(() => {
    // m??? sdk
    eventEmitter.addListener('PaymentBack', e => {
      if (e) {
        eventEmitter.removeAllListeners('PaymentBack');
        switch (e.resultCode) {
          case -1:
            //resultCode == -1
            //vi: Ng?????i d??ng nh???n back t??? sdk ????? quay l???i
            //en: back from sdk (user press back in button title or button back in hardware android)
            navigation.goBack();
            break;

          case 10:
            //resultCode == 10
            //vi: Ng?????i d??ng nh???n ch???n thanh to??n qua app thanh to??n (Mobile Banking, V??...) l??c n??y app t??ch h???p s??? c???n l??u l???i c??i PNR, khi n??o ng?????i d??ng m??? l???i app t??ch h???p th?? s??? g???i ki???m tra tr???ng th??i thanh to??n c???a PNR ???? xem ???? thanh to??n hay ch??a.
            //en: user select app to payment (Mobile banking, wallet ...) you need save your PNR code. because we don't know when app banking payment successfully. so when user re-open your app. you need call api check your PNR code (is paid or unpaid). PNR: it's vnp_TxnRef. Reference code of transaction at Merchant system
            getPaymentResult();
            break;

          case 99:
            //resultCode == 99
            //vi: Ng?????i d??ng nh???n back t??? trang thanh to??n th??nh c??ng khi thanh to??n qua th??? khi g???i ?????n http://sdk.merchantbackapp
            //en: back from button (button: done, ...) in the webview when payment success. (incase payment with card, atm card, visa ...)
            navigation.navigate(SCREENS_NAME.MIDDLEWARE);
            navigation.navigate(SCREENS_NAME.APPLICATION_LIST_SCREEN);
            break;

          case 98:
            //resultCode == 98
            //vi: giao d???ch thanh to??n b??? failed
            //en: payment failed

            paymentError();
            break;

          case 97:
            //resultCode == 97
            //vi: thanh to??n th??nh c??ng tr??n webview
            //en: payment success
            getPaymentResult();
            // paymentSuccess();
            break;

          default:
            dispatch(
              getShowAlertError({
                ...PAYMENT_ERROR,
                cancelAction: () => navigation.navigate(SCREENS_NAME.HOME_SCREEN),
                confirmAction: () => navigation.goBack(),
                btnLeft: 'common.go_to_homepage',
                btnRight: 'common.pay_back'
              })
            );
            break;
        }
      }
    });
    return () => {
      // khi t???t sdk
      eventEmitter.removeAllListeners('PaymentBack');
    };
  }, [dispatch, navigation, paymentSuccess, paymentError, getPaymentResult]);

  useEffect(() => {
    if (paymentResult != null) {
      if (paymentResult?.status === 1) {
        // recall
        setTimeout(() => {
          getPaymentResult();
        }, 1000);
      } else if (paymentResult?.status === 2) {
        // success
        paymentSuccess();
      } else if (paymentResult?.status === 3) {
        // error
        paymentError();
      }
    }
  }, [paymentResult, paymentSuccess, paymentError, getPaymentResult]);

  useEffect(() => {
    VnpayMerchant.show({
      isSandbox,
      paymentUrl: paymentUrl?.startsWith('https')
        ? paymentUrl
        : paymentUrl.replace('http', 'https'),
      tmn_code: tmnCode,
      backAlert: 'B???n c?? ch???c ch???n tr??? l???i kh??ng?',
      titleColor: TEXT_COLOR.GreenBold,
      beginColor: BACKGROUND_COLOR.White,
      endColor: BACKGROUND_COLOR.White,
      iconBackName: 'back',
      scheme: settings?.scheme
    });
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
};

export default WithLoading(VNPayScreen, [PAYMENT.GENERATE_LINK.HANDLER]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOM_COLOR.White,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backButton: {
    position: 'absolute',
    left: SPACING.Normal,
    top: hasNotch() ? scale(62) : scale(22),
    zIndex: 1
  },
  backToHome: {
    position: 'absolute',
    bottom: hasNotch() ? scale(42) : scale(20),
    left: scale(14),
    right: scale(14)
  }
});
