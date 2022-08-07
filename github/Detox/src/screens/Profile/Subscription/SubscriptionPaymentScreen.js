import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useRef, useState} from 'react';
import {useAndroidBackHandler} from 'react-navigation-backhandler';

import {useGetAgentSubscriptionTransactionValidatePaymentLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {
  DAY_TO_MILISECOND,
  FETCH_POLICY,
  SUBSCRIPTION_RESULT_TYPE,
  TRANSACTION_STATUS_ID,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import BaseScreen from '../../../components/BaseScreen';
import Configs from '../../../configs';
import logService from '../../../service/logService';
import PaymentWebview from '../../BookingDeposit/Payment/PaymentWebView';
import {callAfterInteraction} from '../../commonHooks';
import {TrackingActions} from '../../WithSegment';
import SubscriptionResultDialog from './components/SubscriptionResultDialog';

const RETURN_URL_PREFIX = Configs.portal;
const VNP_RESPONSE_CODE = {
  SUCCESS: '00',
  CANCELED: '24',
};

const MAX_RETRY_GET_TRANSACTION_DETAIL_TIME = 3;
const INITIAL_RETRY_GET_TRANSACTION_COUNT = 0;
const DELAY_TO_RETRY_GET_TRANSACTION_DETAIL_MS = 2000; // delay 2 seconds

function parseReturnUrl(urlObject) {
  const query = urlObject.query ?? {};
  const {vnp_ResponseCode, vnp_OrderInfo, vnp_TxnRef} = query;
  const paymentReturnUrl = urlObject.href ?? '';

  const isSuccess = vnp_ResponseCode === VNP_RESPONSE_CODE.SUCCESS;
  const isCancel = vnp_ResponseCode === VNP_RESPONSE_CODE.CANCELED;
  return {
    isSuccess,
    isCancel,
    transactionId: vnp_TxnRef,
    transactionType: vnp_OrderInfo,
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
  transactionId: '',
  transactionDetail: {},
  isSuccess: false,
};

const SubscriptionPaymentScreen = ({navigation, route}) => {
  const {payTransactionResponse} = route?.params || {};
  const paymentUrl = payTransactionResponse?.linkPaymentUrl?.replace('http://', 'https://');
  const returnUrl = payTransactionResponse?.returnUrl ?? RETURN_URL_PREFIX;

  const {track} = useAnalytics();
  const [showResultPopup, setShowResultPopup] = useState(initResultPopupState);
  const {showAppSpinner, showAppModal} = useContext(AppContext);
  const transactionDetailRetryCountRef = useRef(INITIAL_RETRY_GET_TRANSACTION_COUNT);
  const transactionDetailInputRef = useRef({});

  const {startApi: getTransactionDetail} = useGraphqlApiLazy({
    graphqlApiLazy: useGetAgentSubscriptionTransactionValidatePaymentLazyQuery,
    dataField: 'getAgentSubscriptionTransactionValidatePayment',
    showSpinner: true,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessGetTransactionDetail,
    onError: handleErrorGetDetailTransaction,
  });

  const popStackNavigation = () => {
    navigation.canGoBack() && navigation.goBack();
  };

  const showAlertConfirmCancelPayment = () => {
    showAppModal({
      isVisible: true,
      message: translate('PAYMENT_CONFIRM_ALERT'),
      okText: translate('YES'),
      cancelText: translate('NO'),
      onOkHandler: popStackNavigation,
    });
  };

  useAndroidBackHandler(() => {
    showAlertConfirmCancelPayment();
    return true; // to not auto call default back button handler
  });

  const isHandledReturnUrl = useRef(false);
  const isAlreadyHandledReturnUrl = () => isHandledReturnUrl.current;
  const setIsAlreadyHandledReturnUrl = value => (isHandledReturnUrl.current = value);
  const onShouldStartLoadUrl = (url, urlObject) => {
    if (!checkIsReturnUrl(urlObject, returnUrl)) {
      return true; //ignore other urls that differ to our return url
    }
    //handle before redirect to our return url website
    const info = parseReturnUrl(urlObject);
    const {isSuccess, isCancel, transactionId: transId, transactionType, paymentReturnUrl} = info;
    if (isAlreadyHandledReturnUrl()) {
      return false; //to not load webpage
    }
    setIsAlreadyHandledReturnUrl(true);
    if (isCancel) {
      popStackNavigation();
      return false; //to not load webpage
    }
    const successPaymentInfo = {transactionId: transId, transactionType, paymentReturnUrl};
    isSuccess ? handleSuccessPayment(successPaymentInfo) : handleFailurePayment();
    return false; //to not load webpage
  };

  function retryGetTransactionIfNeeded() {
    if (transactionDetailRetryCountRef.current < MAX_RETRY_GET_TRANSACTION_DETAIL_TIME) {
      transactionDetailRetryCountRef.current = transactionDetailRetryCountRef.current + 1;
      const {transactionId, paymentReturnUrl} = transactionDetailInputRef.current;
      setTimeout(() => {
        getTransactionDetail({variables: {input: {transactionId, paymentReturnUrl}}});
      }, DELAY_TO_RETRY_GET_TRANSACTION_DETAIL_MS);
    } else {
      handleFailurePayment();
    }
  }

  function handleErrorGetDetailTransaction(error) {
    logService.log('handleErrorGetDetailTransaction', JSON.stringify(error));
    showAppSpinner(false);
    callAfterInteraction(retryGetTransactionIfNeeded);
  }

  function handleFailurePayment() {
    setShowResultPopup({showPopup: true, isSuccess: false});
  }

  function onSuccessPayment() {
    setShowResultPopup({...showResultPopup, showPopup: true, isSuccess: true});
  }

  function handleSuccessPayment({transactionId, transactionType, paymentReturnUrl}) {
    setShowResultPopup({...showResultPopup, transactionId, transactionType});
    transactionDetailInputRef.current = {transactionId, paymentReturnUrl};
    transactionDetailRetryCountRef.current = INITIAL_RETRY_GET_TRANSACTION_COUNT;
    getTransactionDetail({variables: {input: {transactionId, paymentReturnUrl}}});
  }

  function onSuccessGetTransactionDetail(responseDetail) {
    const {
      transactionStatusId,
      subscriptionPackageValidDays,
      subscriptionPackageName,
      purchaseDate,
      startDate,
    } = responseDetail?.agentSubscriptionTransactionDto ?? {};
    const expiredTimestamp = startDate + subscriptionPackageValidDays * DAY_TO_MILISECOND;

    if (isEmpty(responseDetail)) {
      callAfterInteraction(retryGetTransactionIfNeeded);
      return;
    }
    if (transactionStatusId === TRANSACTION_STATUS_ID.IN_PROGRESS) {
      callAfterInteraction(retryGetTransactionIfNeeded);
      return;
    }
    if (transactionStatusId === TRANSACTION_STATUS_ID.FAILED) {
      handleFailurePayment();
      return;
    }
    if (transactionStatusId === TRANSACTION_STATUS_ID.SUCCESS) {
      track(TrackingActions.topenerUpgradeSuccedded, {
        subscription_name: subscriptionPackageName ?? '',
        period: `${subscriptionPackageValidDays ?? ''}`,
        expire_date: new Date(expiredTimestamp ?? 0).toISOString(),
        effective_from: new Date(startDate ?? 0).toISOString(),
        effective_to: new Date(expiredTimestamp ?? 0).toISOString(),
        purchase_date: new Date(purchaseDate ?? 0).toISOString(),
      });

      onSuccessPayment();
      return;
    }
    handleFailurePayment();
  }

  const onConfirmResultDialog = () => {
    setShowResultPopup({...showResultPopup, showPopup: false});
  };

  return (
    <BaseScreen title={translate(STRINGS.PAY)} onBackPress={showAlertConfirmCancelPayment}>
      <PaymentWebview paymentUrl={paymentUrl} onShouldStartLoadUrl={onShouldStartLoadUrl} />
      <SubscriptionResultDialog
        data={showResultPopup}
        onPressButton={onConfirmResultDialog}
        navigation={navigation}
        type={
          showResultPopup?.isSuccess
            ? SUBSCRIPTION_RESULT_TYPE.SUCCESSFUL
            : SUBSCRIPTION_RESULT_TYPE.FAILED
        }
      />
    </BaseScreen>
  );
};

export default SubscriptionPaymentScreen;
