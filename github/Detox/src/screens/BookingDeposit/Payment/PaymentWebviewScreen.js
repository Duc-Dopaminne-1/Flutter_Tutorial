import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useAndroidBackHandler} from 'react-navigation-backhandler';
import URL from 'url';

import {useUnlockDepositForB2CPropertyPostMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {TRANSACTION_MODE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import BaseScreen from '../../../components/BaseScreen';
import ModalPopup from '../../../components/Modal/ModalPopup';
import Configs from '../../../configs';
import UrlUtils from '../../../utils/UrlUtils';
import {callAfterInteraction, useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import {TransactionType} from '../../Transaction/DetailTransaction/Components/DetailTransactionConstant';
import {useTransactionDetailWithChecksum} from '../../Transaction/DetailTransaction/Components/useTransactionDetail';
import {TrackingActions} from '../../WithSegment';
import FailureScreen, {ProjectErrorContainer} from '../Failure/FailureScreen';
import SuccessScreen from '../Success/SuccessScreen';
import {BookingContext} from '../useBooking';
import {encodeVNPayUrl} from './encodeVNPayUrl';
import PaymentWebview from './PaymentWebView';

const RETURN_URL_PREFIX = Configs.portal;
const VNP_RESPONSE_CODE = {
  SUCCESS: '00',
  CANCELED: '24',
};

const MAX_RETRY_GET_TRANSACTION_DETAIL_TIME = 3;
const INITIAL_RETRY_GET_TRANSACTION_COUNT = 0;
const DELAY_TO_RETRY_GET_TRANSACTION_DETAIL_MS = 2000; // delay 2 seconds

const styles = StyleSheet.create({
  fullScreenPopupStyle: {
    padding: 0,
    margin: 0,
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
    transactionId: vnp_TxnRef.split('|')[0],
    propertyPostId: vnp_TxnRef.split('|')[1],
    paymentReturnUrl,
  };
}

function checkIsReturnUrl(urlObject, returnUrl) {
  const isReturnUrl = urlObject?.href?.startsWith(returnUrl);
  return isReturnUrl;
}

const initResultPopupState = {
  showPopup: false,
  isSuccessPopup: true,
  errorDescription: '',
  transactionId: '',
  transactionDetail: {},
};

function renderPopupContent({
  isSuccessPopup,
  moduleState,
  isBooking,
  showResultPopup,
  onDismissPopup,
  onPressBuyMore,
  onReviewNewPost,
}) {
  return isSuccessPopup ? (
    <SuccessPopupContent
      moduleState={moduleState}
      isBooking={isBooking}
      onPressBuyMore={onPressBuyMore}
      onReviewNewPost={onReviewNewPost}
      transactionId={showResultPopup.transactionId}
      transactionDetail={showResultPopup.transactionDetail}
      onDismissPopup={onDismissPopup}
      transactionType={showResultPopup.transactionType}
    />
  ) : (
    <FailureScreen
      containerView={
        <ProjectErrorContainer transactionDetail={showResultPopup?.transactionDetail} />
      }
    />
  );
}

function showPopupComponent({
  showPopup,
  isSuccessPopup,
  isBooking,
  showResultPopup,
  errorDescription,
  onDismissPopup,
  moduleState,
  onPressBuyMore,
  onReviewNewPost,
}) {
  return (
    <ModalPopup
      contentContainerStyle={styles.fullScreenPopupStyle}
      visible={showPopup}
      animationType="slide">
      {renderPopupContent({
        moduleState,
        isSuccessPopup,
        isBooking,
        showResultPopup,
        errorDescription,
        onDismissPopup,
        onPressBuyMore,
        onReviewNewPost,
      })}
    </ModalPopup>
  );
}

const SuccessPopupContent = props => {
  const {screen} = useAnalytics();
  const {
    isBooking,
    transactionId,
    moduleState,
    transactionDetail,
    transactionType,
    onDismissPopup,
    onPressBuyMore,
    onReviewNewPost,
  } = props;
  const {buttonTitle, successTitle} = getSuccessTitles(isBooking);

  useMount(() => {
    screen(ScreenIds.PaymentInfo);
  });

  return (
    <SuccessScreen
      title={successTitle}
      onPressDismiss={onDismissPopup}
      buttonReviewPostTitle={buttonTitle}
      isBooking={isBooking}
      projectInfo={moduleState?.project}
      consultantInfo={moduleState?.consultantInfo}
      transactionId={transactionId}
      onPressBuyMore={onPressBuyMore}
      onReviewNewPost={onReviewNewPost}
      transactionDetail={transactionDetail}
      transactionType={transactionType}
    />
  );
};

function getSuccessTitles(isBooking) {
  let buttonTitle = null;
  let successTitle = null;
  if (isBooking) {
    buttonTitle = translate(STRINGS.BOOKING_REVIEW);
    successTitle = translate(STRINGS.BOOKING_SUCCESS);
  } else {
    buttonTitle = translate(STRINGS.DEPOSITE_REVIEW);
    successTitle = translate(STRINGS.CONFIRM_DEPOSIT_SUCCESSFULLY);
  }
  return {buttonTitle, successTitle};
}

function isBookingStatus(projectStatus) {
  return projectStatus === TRANSACTION_MODE.BOOKING;
}

function getTransactionType(isBooking) {
  return isBooking ? TransactionType.Booking : TransactionType.Deposit;
}

export const useUnlockDepositTransaction = ({transactionId, onUnlockDone}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useUnlockDepositForB2CPropertyPostMutation,
    dataField: 'unlockDepositForB2CPropertyPost',
    onSuccess: onUnlockDone,
    onError: onUnlockDone,
    showSpinner: true,
  });
  const unlockDepositTransaction = () => {
    startApi({
      variables: {
        input: {
          depositTransactionId: transactionId,
        },
      },
    });
  };
  return {unlockDepositTransaction};
};

const PaymentWebviewScreen = ({navigation, route}) => {
  const {payTransactionResponse} = route?.params || {};
  const paymentUrl = encodeVNPayUrl(payTransactionResponse?.linkPaymentUrl);

  const returnUrl = payTransactionResponse?.returnUrl ?? RETURN_URL_PREFIX;
  const disablePayment = payTransactionResponse?.disablePayment ?? false;

  const {track} = useAnalytics();
  const {
    setPaymentResult,
    state: moduleState,
    sendNotifyNewTransaction,
  } = useContext(BookingContext);
  const projectStatus = moduleState?.project?.projectStatus;
  const [isBooking] = useState(isBookingStatus(projectStatus));
  const [showResultPopup, setShowResultPopup] = useState(initResultPopupState);
  const {showPopup, isSuccessPopup, errorDescription} = showResultPopup;
  const {showAppSpinner, showAppModal} = useContext(AppContext);
  const transactionDetailRetryCountRef = useRef(INITIAL_RETRY_GET_TRANSACTION_COUNT);
  const transactionDetailInputRef = useRef({});

  const {
    propertyCode,
    images,
    rawPrice,
    commission,
    numberOfBooking,
    propertySubTypeDescription,
    propertyTypeDescription,
    blockName,
    floor,
    direction,
    numberOfBedrooms,
    numberOfBathrooms,
    buildingArea,
    capetArea,
    rawBookingFee,
    propertyPostId,
  } = moduleState?.propertyPost ?? {};

  const {projectName, projectStatusDescription} = moduleState?.propertyPost ?? {};

  const {unlockDepositTransaction} = useUnlockDepositTransaction({
    transactionId: payTransactionResponse?.transactionId,
    onUnlockDone: () => {
      backToPaymentSelection();
    },
  });

  const {getTransactionDetail} = useTransactionDetailWithChecksum({
    transactionId: payTransactionResponse?.transactionId,
    transactionType: getTransactionType(isBooking),
    propertyPostId,
    showSpinner: true,
    onSuccess: onSuccessGetTransactionDetail,
    onError: handleErrorGetDetailTransaction,
  });

  const showAlertConfirmCancelPayment = () => {
    showAppModal({
      isVisible: true,
      message: translate('PAYMENT_CONFIRM_ALERT'),
      okText: translate('YES'),
      cancelText: translate('NO'),
      onOkHandler: () => {
        if (isBooking) {
          backToPaymentSelection();
        } else {
          unlockDepositTransaction();
        }
      },
    });
  };

  useAndroidBackHandler(() => {
    showAlertConfirmCancelPayment();
    return true; // to not auto call default back button handler
  });

  useMount(() => {
    if (disablePayment) {
      const validUrl = UrlUtils.getValidUrl(paymentUrl);
      const urlObject = URL.parse(validUrl, true);
      onShouldStartLoadUrl(null, urlObject);
    }
  });

  const isHandledReturnUrl = useRef(false);
  const isAlreadyHandledReturnUrl = () => isHandledReturnUrl.current;
  const setIsAlreadyHandledReturnUrl = value => (isHandledReturnUrl.current = value);
  const onShouldStartLoadUrl = (url, urlObject) => {
    if (!disablePayment && !checkIsReturnUrl(urlObject, returnUrl)) {
      return true; //ignore other urls that differ to our return url
    }
    //handle before redirect to our return url website
    const info = parseReturnUrl(urlObject);
    const {
      isSuccess,
      isCancel,
      propertyPostId: postId,
      transactionId: transId,
      paymentReturnUrl,
    } = info;
    if (isAlreadyHandledReturnUrl()) {
      return false; //to not load webpage
    }
    setIsAlreadyHandledReturnUrl(true);
    if (isCancel) {
      backToPaymentSelection();
      return false; //to not load webpage
    }
    const successPaymentInfo = {
      transactionId: transId,
      propertyPostId: postId,
      transactionType: getTransactionType(isBooking),
      paymentReturnUrl,
    };
    isSuccess ? handleSuccessPayment(successPaymentInfo) : handleFailurePayment();
    return false; //to not load webpage
  };

  function retryGetTransactionIfNeeded() {
    if (transactionDetailRetryCountRef.current < MAX_RETRY_GET_TRANSACTION_DETAIL_TIME) {
      transactionDetailRetryCountRef.current = transactionDetailRetryCountRef.current + 1;
      const {
        transactionId,
        paymentReturnUrl,
        propertyPostId: postId,
      } = transactionDetailInputRef.current;
      setTimeout(() => {
        getTransactionDetail(transactionId, postId, paymentReturnUrl);
      }, DELAY_TO_RETRY_GET_TRANSACTION_DETAIL_MS);
    } else {
      handleFailurePayment();
    }
  }

  function handleErrorGetDetailTransaction() {
    showAppSpinner(false);
    callAfterInteraction(retryGetTransactionIfNeeded);
  }
  function handleFailurePayment() {
    const displayError = translate(STRINGS.ERROR_OCCUR_WHEN_PAYING);
    setShowResultPopup({showPopup: true, isSuccessPopup: false, errorDescription: displayError});
  }
  function handleSuccessPayment({transactionId, postId, transactionType, paymentReturnUrl}) {
    setPaymentResult({transactionId, transactionType});
    setShowResultPopup({...showResultPopup, transactionId, transactionType});
    transactionDetailInputRef.current = {transactionId, paymentReturnUrl, propertyPostId: postId};
    transactionDetailRetryCountRef.current = INITIAL_RETRY_GET_TRANSACTION_COUNT;
    getTransactionDetail(transactionId, postId, paymentReturnUrl);
  }

  function backToPaymentSelection() {
    navigation.goBack();
  }

  function onSuccessGetTransactionDetail(responseDetail) {
    if (isEmpty(responseDetail)) {
      callAfterInteraction(retryGetTransactionIfNeeded);
      return;
    }

    track(TrackingActions.projectOrderSucceeded, {
      page_url: moduleState?.project?.detailPath
        ? `${Configs.portal.PORTAL_URL}${moduleState?.project?.detailPath}`
        : '',
      transaction_code: responseDetail?.transactionCode,
      transaction_type: isBooking ? TransactionType.Booking : TransactionType.Deposit,
      transaction_amount: responseDetail?.transactionAmount ?? 0,
      property_id: propertyCode,
      project_status: projectStatusDescription,
      project_name: projectName,
      property_image: JSON.stringify(images[0] ?? ''),
      property_sale_price: rawPrice,
      commission,
      booking_count: `${numberOfBooking ?? 0}`,
      property_type: propertySubTypeDescription ?? propertyTypeDescription,
      property_block: blockName,
      floor,
      direction,
      bedroom_number: `${numberOfBedrooms ?? 0}`,
      bathroom_number: `${numberOfBathrooms ?? 0}`,
      builtup_area: buildingArea,
      carpet_area: capetArea,
      mininmum_payment: rawBookingFee ?? 0,
    });

    sendNotifyNewTransaction();
    callAfterInteraction(() => {
      showSuccessPopup(responseDetail);
    });
  }

  const onDismissPopup = () => {
    setShowResultPopup({...showResultPopup, showPopup: false});
  };

  function showSuccessPopup(transactionDetail) {
    const info = {...showResultPopup, transactionDetail, showPopup: true, isSuccessPopup: true};
    setShowResultPopup(info);
  }

  const onReviewNewPost = () => {
    navigation.navigate(ScreenIds.Transaction);
    navigation.navigate(ScreenIds.DetailTransaction, {
      transactionId: showResultPopup.transactionId,
      transactionType: showResultPopup.transactionType,
      transactionCode: showResultPopup.transactionDetail?.transactionCode,
      propertyPostId: showResultPopup?.transactionDetail.propertyPostInfo.propertyPostId,
    });
  };

  const onPressBuyMore = () => {
    navigation.navigate(ScreenIds.ProjectDetail, {
      projectId: showResultPopup?.transactionDetail?.projectId,
    });
  };

  const popupInfo = {
    showPopup,
    isSuccessPopup,
    isBooking,
    showResultPopup,
    errorDescription,
    onDismissPopup,
    moduleState,
    onPressBuyMore,
    onReviewNewPost,
  };

  return (
    <BaseScreen title={translate(STRINGS.PAY)} onBackPress={showAlertConfirmCancelPayment}>
      {!disablePayment && (
        <PaymentWebview paymentUrl={paymentUrl} onShouldStartLoadUrl={onShouldStartLoadUrl} />
      )}
      {showPopup && showPopupComponent(popupInfo)}
    </BaseScreen>
  );
};

export default PaymentWebviewScreen;
