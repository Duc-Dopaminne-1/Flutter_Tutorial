import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../vars';
import { useRoute } from '@react-navigation/native';
import CustomConfirmModalHaveLink from '../CustomModalHaveLink';
import { language } from '../../i18n';
import NavigationActionsService from '../../navigation/navigation';
import { PAYMENT_ACCOUNTS_SCREEN, PAYPAL_WEB_VIEW } from '../../navigation/screenKeys';
import { getStatusPayment, getTransactionsInfo } from '../../redux/payment/actions';
import { formatPrice, getSpaceTime } from '../../shared/processing';
import { saveAuction } from '../../redux/auction/actions';
import { isIOS } from '../../shared/devices';
import { SocketManager } from '../../shared/socket/socket-manager';
import { setUserBidded } from '../../redux/placeABid/actions';
import { ErrorCode } from '../../constants/codeError';
import { updateStatusAuction } from '../../redux/auction/actions';

interface Prop {
  approveUrl: string;
  profileId?: string;
  id: number;
  endNowBidAt: string;
  hideAlertSuccess?: () => void;
  onPaymentComplete?: (isPaymentSuccess: boolean) => void;
  onCbPaymentIssueSuccess?: () => void;
  onCbPaymentIssue?: () => void;
  checkPaymentCard?: (checkPaymentCardFromModal?: () => void) => void;
  isTryLater?: boolean;
  isFromPaymentDebt?: boolean;
  isFromCreateMyAuction?: boolean;
  isFromAuctionDetailCardFail?: boolean;
  isBidMaxCardFail?: boolean;
  isFromAuctionDetail?: boolean;
  isFromBidMax?: boolean;
  amount?: number;
  isOutOfTime?: boolean;
  timeForPayment?: number;
  isBidNormalAfterBidMax?: boolean;
  auctionId?: string;
}

const ModalPayment = () => {
  const {
    approveUrl,
    id,
    profileId,
    endNowBidAt,
    onPaymentComplete,
    hideAlertSuccess,
    onCbPaymentIssueSuccess,
    isTryLater = false,
    isOutOfTime = false,
    isFromPaymentDebt = false,
    isFromCreateMyAuction = false,
    isFromAuctionDetailCardFail = false,
    isBidMaxCardFail = false,
    isFromAuctionDetail = false,
    isFromBidMax = false,
    isBidNormalAfterBidMax = false,
    amount,
    timeForPayment = 5,
    auctionId,
    onCbPaymentIssue,
    checkPaymentCard,
  } = useRoute().params as Prop;
  const [isOutOfTimeLocal, setIsOutOfTimeLocal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timeLast = getSpaceTime(endNowBidAt, timeForPayment);
  const contentTime = timeLast === 1 || timeLast === 0 ? `${timeLast} ${language('minute')}` : `${timeLast} ${language('minutes')}`;
  const [modalVisible, setModalVisible] = useState(true);

  const handleContent = () => {
    if (isFromAuctionDetail) {
      return [
        language('youWonAuction'),
        language('youWonAuctionOne'),
        language('youWonAuctionTwo', { time: contentTime }),
        language('youWonAuctionThree'),
        language('ok'),
      ];
    }

    if (isFromCreateMyAuction) {
      return [
        language('billingProblem'),
        language('billingProblemOne'),
        `${formatPrice(amount)}`,
        language('billingProblemThree'),
        language('ok'),
      ];
    }

    if (isOutOfTimeLocal) {
      return [language('overRetry'), language('overRetryOne'), language('overRetryTwo'), language('overRetryThree'), language('ok')];
    }

    if (isFromPaymentDebt) {
      return [language('paymentIssue'), language('yourBalanceOne'), `${formatPrice(amount)}`, language('yourBalanceThree'), language('ok')];
    }

    if (isBidNormalAfterBidMax || isBidMaxCardFail) {
      return [
        language('paymentFailed'),
        language('checkPaymentOne'),
        language('checkPaymentTwo'),
        language('checkPaymentThree', { time: contentTime }),
        language('retry'),
      ];
    }

    if (isFromAuctionDetailCardFail) {
      return [
        language('paymentFailed'),
        language('youWonAuctionFailOne'),
        language('youWonAuctionFailTwo', { time: contentTime }),
        language('youWonAuctionFailThree'),
        language('retry'),
      ];
    }

    return [
      language('processPayment'),
      language('continueProcessingOne'),
      language('continueProcessingTwo', { time: contentTime }),
      language('continueProcessingThree'),
      language('ok'),
    ];
  };

  const [contentModal, setContentModal] = useState(() => handleContent());

  useEffect(() => {
    setIsOutOfTimeLocal(isOutOfTime);
  }, [isOutOfTime]);

  useEffect(() => {
    setContentModal(_ => handleContent());
  }, [isOutOfTimeLocal]);

  const onBackdropPress = () => {
    setModalVisible(false);
    setTimeout(() => {
      hideAlertSuccess && hideAlertSuccess();
      NavigationActionsService.goBack();
      if (isFromPaymentDebt || isFromAuctionDetail || isFromAuctionDetailCardFail || isBidMaxCardFail) {
        onCbPaymentIssue && onCbPaymentIssue();
      }
    }, 400);
  };

  const onCompletePaypal = (isSuccess: boolean) => {
    // login paypal success
    if (isSuccess) {
      NavigationActionsService.showLoading();
      // isFromTransaction : true /transactions/payment-capture
      // isFromTransaction : false /auctions/payment-capture
      NavigationActionsService.dispatchAction(
        getStatusPayment({
          transactionId: id,
          onSuccess,
          onFail,
        }),
      );
    } else {
      // cancel login paypal
      if (isFromPaymentDebt || isFromCreateMyAuction) {
        setModalVisible(true);
        return;
      }

      setContentPaymentFail();
      setModalVisible(true);
    }
  };

  const onSuccess = data => {
    // Update status auction of biddee when bidder bid max PayPal
    profileId && NavigationActionsService.dispatchAction(updateStatusAuction({ id: profileId }));
    // just hide modal error, still show-place a bid
    if (isFromPaymentDebt || isFromCreateMyAuction || isFromAuctionDetail) {
      onCbPaymentIssueSuccess && onCbPaymentIssueSuccess();
      NavigationActionsService.hideLoading();
      NavigationActionsService.goBack();
      return;
    }

    // hide modal error, hide place a bid, case bid max
    NavigationActionsService.dispatchAction(saveAuction(data));
    NavigationActionsService.hideLoading();
    onPaymentComplete && onPaymentComplete(true);
    NavigationActionsService.goBack();
  };

  const onFail = _err => {
    if (isFromPaymentDebt || isFromCreateMyAuction) {
      NavigationActionsService.hideLoading();
      NavigationActionsService.goBack();
      return;
    }

    if (isFromAuctionDetail) {
      NavigationActionsService.hideLoading();
      onCbPaymentIssue && onCbPaymentIssue();
      NavigationActionsService.goBack();
      return;
    }

    if (isFromBidMax && (_err.toString() === ErrorCode.INVALID_STATUS || _err.toString() === ErrorCode.INVALID_BID)) {
      NavigationActionsService.hideLoading();
      setIsOutOfTimeLocal(true);
      setModalVisible(true);
      return;
    }

    NavigationActionsService.hideLoading();
    onPaymentComplete && onPaymentComplete(false);
    NavigationActionsService.goBack();
  };

  const onPaymentDebt = () => {
    setModalVisible(false);
    NavigationActionsService.showLoading();
    // get link paypal
    NavigationActionsService.dispatchAction(
      getTransactionsInfo({
        id,
        onSuccess: data => {
          const { approveUrl, id } = data;
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            if (approveUrl) {
              NavigationActionsService.push(PAYPAL_WEB_VIEW, { approveUrl, id, onCompletePaypal });
            } else {
              if (data.status === 'failed') {
                setModalVisible(true);
              } else {
                NavigationActionsService.hideLoading();
                NavigationActionsService.goBack();
              }
            }
          }, 400);
        },
      }),
    );
  };

  const onPressLink = () => {
    if (contentModal[0] === language('paymentFailed') || contentModal[0] === language('overRetry')) {
      if (isFromAuctionDetailCardFail) {
        setModalVisible(false);
        NavigationActionsService.push(PAYMENT_ACCOUNTS_SCREEN, { isFromModalAuctionDetailCardFailed: true, onBack });
        return;
      }
      // close modal and go back previous screen
      setModalVisible(false);
      NavigationActionsService.goBack();
      NavigationActionsService.push(PAYMENT_ACCOUNTS_SCREEN);
    }
  };

  const onBack = () => {
    setModalVisible(true);
  };

  const checkPaymentCardFromModal = () => {
    setIsLoading(false);
  };

  const onPressOke = () => {
    // case Debt and createMyAuction
    if (isFromPaymentDebt || isFromCreateMyAuction) {
      onPaymentDebt();
      return;
    }

    if (isFromAuctionDetailCardFail) {
      setIsLoading(true);
      checkPaymentCard && checkPaymentCard(checkPaymentCardFromModal);
      return;
    }

    setModalVisible(false);
    // charge card fail, cb to charge again
    if (isBidMaxCardFail) {
      NavigationActionsService.goBack();
      checkPaymentCard && checkPaymentCard();
      return;
    }

    // case card try bid
    if (!approveUrl && isBidNormalAfterBidMax) {
      NavigationActionsService.goBack();
      SocketManager.instanceBid.setIsBidNormalAfterBidMax(true);
      NavigationActionsService.dispatchAction(setUserBidded(true));
      SocketManager.instanceBid.sendRetryBid(auctionId as string);
      setTimeout(() => {
        SocketManager.instanceBid.setIsBidNormalAfterBidMax(false);
      }, 3000);
      return;
    }

    // case try later
    if (!approveUrl) {
      NavigationActionsService.goBack();
      return;
    }

    // case over time
    if (timeLast === 0) {
      setIsOutOfTimeLocal(true);
      return;
    }

    // case payment by Paypal
    setTimeout(() => {
      NavigationActionsService.push(PAYPAL_WEB_VIEW, { approveUrl, id, onCompletePaypal });
    }, 400);
  };

  const setContentPaymentFail = () => {
    if (isFromAuctionDetail) {
      setContentModal([
        language('paymentFailed'),
        language('youWonAuctionFailOne'),
        language('youWonAuctionFailTwo', { time: contentTime }),
        language('youWonAuctionFailThree'),
        language('retry'),
      ]);
      return;
    }
    setContentModal([
      language('paymentFailed'),
      language('checkPaymentOne'),
      language('checkPaymentTwo'),
      language('checkPaymentThree', { time: contentTime }),
      language('retry'),
    ]);
  };

  if (isOutOfTimeLocal) {
    return (
      <CustomConfirmModalHaveLink
        textLinkOne={contentModal[1]}
        textLinkTwo={contentModal[2]}
        textLinkThree={contentModal[3]}
        isButton
        onPressLink={onPressLink}
        textLinkStyle={styles.textLinkStyle}
        textContentStyle={styles.textContent}
        subTitle={contentModal[0]}
        onBackdropPress={onBackdropPress}
        onPressOke={onPressOke}
        isVisible={modalVisible}
        textButton={contentModal[4]}
      />
    );
  }

  if (isTryLater) {
    return (
      <CustomConfirmModalHaveLink
        isButton
        title={language('pleaseTryAgain')}
        titleStyle={styles.titleStyle}
        onBackdropPress={onBackdropPress}
        onPressOke={onPressOke}
        isVisible={modalVisible}
      />
    );
  }

  return (
    <CustomConfirmModalHaveLink
      isFromAuctionDetail={isFromAuctionDetail}
      isFromAuctionDetailCardFail={isFromAuctionDetailCardFail}
      textLinkOne={contentModal[1]}
      textLinkTwo={contentModal[2]}
      textLinkThree={contentModal[3]}
      isButton
      onPressLink={onPressLink}
      textLinkStyle={styles.textLinkStyle}
      textContentStyle={styles.textContent}
      subTitle={contentModal[0]}
      isLoading={isLoading}
      onBackdropPress={onBackdropPress}
      onPressOke={onPressOke}
      isVisible={modalVisible}
      textButton={contentModal[4]}
    />
  );
};

export default ModalPayment;

const styles = StyleSheet.create({
  textContent: {
    fontSize: fonts.size.s14,
    fontWeight: null,
    fontFamily: fonts.family.PoppinsRegular,
  },
  textLinkStyle: {
    fontSize: fonts.size.s14,
    textDecorationLine: null,
  },
  titleStyle: {
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: isIOS ? '600' : 'bold',
  },
});
