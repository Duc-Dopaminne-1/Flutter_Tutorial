import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import URL from 'url';

import {AppContext} from '../../appData/appContext/useAppContext';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {STRINGS} from '../../assets/localize/string';
import {large} from '../../assets/theme/metric';
import BaseScreen from '../../components/BaseScreen';
import CenterText from '../../components/CenterText';
import KeyboardScrollView from '../../components/KeyboardScrollView';
import ModalPopup from '../../components/Modal/ModalPopup';
import Configs from '../../configs';
import UrlUtils from '../../utils/UrlUtils';
import FailureScreen from './FailureScreen';

const RETURN_URL_PREFIX = Configs.portal;
const VNP_RESPONSE_CODE = {
  SUCCESS: '00',
  CANCELED: '24',
};

const styles = StyleSheet.create({
  fullScreenPopupStyle: {
    padding: 0,
    margin: 0,
  },
  viewContainer: {
    flex: 1,
  },
  centerTextContainer: {
    paddingHorizontal: large,
  },
});

function parseReturnUrl(urlObject) {
  const query = urlObject.query ?? {};
  const {vnp_ResponseCode, vnp_TxnRef} = query;
  const paymentReturnUrl = urlObject.href ?? '';

  const isSuccess = vnp_ResponseCode === VNP_RESPONSE_CODE.SUCCESS;
  const isCancel = vnp_ResponseCode === VNP_RESPONSE_CODE.CANCELED;

  return {
    isSuccess,
    isCancel,
    transactionId: vnp_TxnRef,
    paymentReturnUrl,
  };
}

function checkIsReturnUrl(urlObject, returnUrl) {
  const isReturnUrl = urlObject?.href?.startsWith(returnUrl);
  return isReturnUrl;
}

const initResultPopupState = {
  showPopup: false,
  errorDescription: '',
};

const FailurePopup = ({showPopup, errorDescription}) => {
  const failureTitle = translate(STRINGS.PAY_FAILURE);
  return (
    <ModalPopup
      contentContainerStyle={styles.fullScreenPopupStyle}
      visible={showPopup}
      animationType="slide">
      <FailureScreen title={failureTitle} description={errorDescription} />
    </ModalPopup>
  );
};

const ErrorView = ({message}) => {
  return <CenterText containerStyle={styles.centerTextContainer} title={message} />;
};

function renderError(errorDomain, errorCode) {
  let errorMessage = '';
  if (errorCode === -1009) {
    errorMessage = translate(Message.NTW_NETWORK_ERROR);
  } else {
    errorMessage = translate(Message.NTW_UNKNOWN_ERROR);
  }
  return <ErrorView message={errorMessage} />;
}

const PaymentWebview = ({paymentUrl, onNavigateToUrl, onShouldStartLoadUrl}) => {
  const webViewRef = useRef(null);
  const [showNetworkError, setShowNetworkError] = useState(false);
  const {state: appState} = useContext(AppContext);

  useEffect(() => {
    setShowNetworkError(!appState.isOnline);
  }, [appState.isOnline]);

  const navigationStateChangedHandler = ({url}) => {
    const validUrl = UrlUtils.getValidUrl(url);
    if (!validUrl) {
      return;
    }
    const urlObject = URL.parse(validUrl, true);
    onNavigateToUrl && onNavigateToUrl(validUrl, urlObject);
  };

  const onShouldStartLoadWithRequest = event => {
    const url = event?.url;
    const validUrl = UrlUtils.getValidUrl(url);
    if (!validUrl) {
      return false; // do not load page with invalid url
    }
    const urlObject = URL.parse(validUrl, true);
    if (onShouldStartLoadUrl) {
      return onShouldStartLoadUrl(validUrl, urlObject); // let delegate handle should request
    }

    return true; // load page with valid url
  };

  return (
    <KeyboardScrollView>
      {showNetworkError && <ErrorView message={translate(Message.NTW_NETWORK_ERROR)} />}
      <WebView
        style={styles.viewContainer}
        useWebKit={true}
        source={{uri: paymentUrl}}
        onNavigationStateChange={navigationStateChangedHandler}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        ref={webViewRef}
        renderError={renderError}
      />
    </KeyboardScrollView>
  );
};

const CommonPaymentWebViewScreen = ({navigation, route}) => {
  const {payTransactionResponse, onPaymentSucceedHandler} = route?.params || {};
  const paymentUrl = payTransactionResponse?.linkPaymentUrl?.replace('http://', 'https://');
  const returnUrl = payTransactionResponse?.returnUrl ?? RETURN_URL_PREFIX;
  const disablePayment = payTransactionResponse?.disablePayment ?? false;

  const [showResultPopup, setShowResultPopup] = useState(initResultPopupState);
  const {showPopup, errorDescription} = showResultPopup;

  const {showAppModal} = useContext(AppContext);

  const showAlertConfirmCancelPayment = () => {
    showAppModal({
      isVisible: true,
      message: translate('PAYMENT_CONFIRM_ALERT'),
      okText: translate('YES'),
      cancelText: translate('NO'),
      onOkHandler: () => navigation.goBack(),
    });
  };

  const isHandledReturnUrl = useRef(false);
  const isAlreadyHandledReturnUrl = () => isHandledReturnUrl.current;
  const setIsAlreadyHandledReturnUrl = value => (isHandledReturnUrl.current = value);

  const handleFailurePayment = () => {
    const displayError = translate(STRINGS.ERROR_OCCUR_WHEN_PAYING);
    setShowResultPopup({showPopup: true, errorDescription: displayError});
  };

  const handleSuccessPayment = ({transactionId, paymentReturnUrl}) => {
    onPaymentSucceedHandler(transactionId, paymentReturnUrl);
  };

  const onShouldStartLoadUrl = (url, urlObject) => {
    if (!disablePayment && !checkIsReturnUrl(urlObject, returnUrl)) {
      return true; //ignore other urls that differ to our return url
    }

    //handle before redirect to our return url website
    const info = parseReturnUrl(urlObject);
    const {isSuccess, isCancel, transactionId: transId, paymentReturnUrl} = info;

    if (isAlreadyHandledReturnUrl()) {
      return false; //to not load webpage
    }

    setIsAlreadyHandledReturnUrl(true);

    if (isCancel) {
      navigation?.canGoBack() && navigation.goBack();
      return false; //to not load webpage
    }

    const successPaymentInfo = {
      transactionId: transId,
      paymentReturnUrl,
    };

    isSuccess ? handleSuccessPayment(successPaymentInfo) : handleFailurePayment();

    return false; //to not load webpage
  };

  return (
    <BaseScreen title={translate(STRINGS.PAY)} onBackPress={showAlertConfirmCancelPayment}>
      <PaymentWebview paymentUrl={paymentUrl} onShouldStartLoadUrl={onShouldStartLoadUrl} />
      <FailurePopup showPopup={showPopup} errorDescription={errorDescription} />
    </BaseScreen>
  );
};

export default CommonPaymentWebViewScreen;
