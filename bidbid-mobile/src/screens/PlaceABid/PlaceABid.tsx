import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, Animated, View, ViewStyle, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { colors } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import { PlaceABidTitle } from './components/PlaceABidTitle';
import { PlaceABidLineBreak } from './components/PlaceABidLineBreak';
import { PlaceABidCategories } from './components/PlaceABidCategories';
import { PlaceABidSuggestedBids } from './components/PlaceABidSuggestedBids';
import { PlaceABidEndItNowPrice } from './components/PlaceABidEndItNowPrice';
import { PlaceABidCalculatorView } from './components/PlaceABidCalculatorView';
import { PlaceABidButton } from './components/PlaceABidButton';
import { PlaceABidSuccessAlert } from './components/PlaceABidSuccessAlert';
import { PlaceABidErrorAlert } from './components/PlaceABidErrorAlert';
import { PlaceABidErrorMessage } from './components/PlaceABidErrorMessage';
import { SocketManager } from '@/shared/socket/socket-manager';
import { RootState } from '@/redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { clear, setAuction, setCategories, setUserBidded } from '@/redux/placeABid/actions';
import { PlaceABidContext } from './PlaceABidContext';
import { MinimumReservePriceDialog } from './components/MinimumReservePriceDialog';
import NavigationActionsService from '@/navigation/navigation';
import { GlobalProps } from '@/shared/Interface';
import { bidMax } from '@/shared/global';
import { PAYMENT_STATUS } from '@/models/payment';
import { MODAL_PAYMENT, PAYPAL_WEB_VIEW } from '@/navigation/screenKeys';
import { getUserId, Log } from '@/shared/processing';
import { isAndroid } from '@/shared/devices';
import { AUCTION_TYPE } from '@/models';
import { PlaceABidTicketPrice } from '@/screens/PlaceABid/components/PlaceABidTicketPrice';
import { getStatusPayment } from '@/redux/payment/actions';

export const currencyFormat = (num = 0) => {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

let isPaymentSuccess = true;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ROOT_VIEW: ViewStyle = {
  justifyContent: 'flex-end',
  flex: 1,
};

const BACK_DROP: ViewStyle = {
  flex: 1,
  backgroundColor: colors.transparent,
};

const CONTAINER: ViewStyle = {
  backgroundColor: colors.white,
  // borderRadius: 20,
  paddingBottom: 30,
};

export function PlaceABid(props: GlobalProps): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState(null);
  let isFromHomeDetail = props.route.params ? props.route.params?.isFromHomeDetail : false;
  let transactionIdRef = useRef(0);
  const {
    placeABid,
    user,
    auction: auctionReducer,
  } = useSelector((state: RootState) => {
    return state;
  });
  const isAuctionRaffle = placeABid.auction.type === AUCTION_TYPE.RAFFLE;

  useEffect(() => {
    const auctionIdBidding = placeABid.auctionIdBiding;
    SocketManager.instanceBid.joinAuction(auctionIdBidding, _ => {});
  }, []);

  const saveCategoryBidded = currentAuction => {
    if (currentAuction?.winningBid?.creatorId === getUserId()) {
      const categoriesSelected = currentAuction?.winningBid?.categories || [];
      if (categoriesSelected.length > 0) {
        const categoryName = categoriesSelected[categoriesSelected.length - 1];
        if (currentAuction?.categories) {
          const indexCategorySelected = currentAuction.categories.findIndex(item => item.name === categoryName);
          const idCategorySelected = currentAuction.categories[indexCategorySelected].id;
          NavigationActionsService.dispatchAction(setCategories([idCategorySelected]));
        }
      }
    }
  };

  useEffect(() => {
    NavigationActionsService.hideLoading();
    if (SocketManager.instanceBid.getIshHideSuccessWhenProcessingPaypal()) return;
    const auctionIdBidding = placeABid.auctionIdBiding;
    const auctionObject = auctionReducer.auctionDictionary[auctionIdBidding];
    saveCategoryBidded(auctionObject);
    if (auctionObject) {
      if (!placeABid.userBidded) {
        dispatch(setAuction(auctionObject));
      } else if (
        user.data.id === auctionObject.winningBid?.creatorId ||
        (isAuctionRaffle && user.data.id === auctionObject?.lastBid?.creatorId)
      ) {
        if (!auctionObject.reservePrice) {
          setShowSuccessAlert(true);
          dispatch(setAuction(auctionObject));
        } else {
          let minimumPrice = auctionObject.reservePrice || 0;
          if (auctionObject.winningBid?.price < minimumPrice) {
            setMinimumReservePriceDialog(true);
            dispatch(setAuction(auctionObject));
          } else {
            setShowSuccessAlert(true);
            dispatch(setAuction(auctionObject));
          }
        }
      } else {
        dispatch(setAuction(auctionObject));
      }
    }
  }, [auctionReducer.auctionDictionary]);

  const { auction } = placeABid;
  const { endNowPrice } = auction;
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [minimumReservePriceDialog, setMinimumReservePriceDialog] = useState(false);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [disableTouch, setDisableTouch] = useState(false);

  useEffect(() => {
    SocketManager.instanceBid.listenException(error => {
      NavigationActionsService.hideLoading();
      if (error.message === PAYMENT_STATUS.AUCTION_PROCESSING_TRY_LATER) {
        NavigationActionsService.push(MODAL_PAYMENT, { isTryLater: true });
        return;
      }
      if (error.message === PAYMENT_STATUS.INVALID_BID || error.message === PAYMENT_STATUS.USER_IN_AUCTION_BLACKLIST) {
        NavigationActionsService.push(MODAL_PAYMENT, { isOutOfTime: true });
        return;
      }
      if (error.message === PAYMENT_STATUS.PROCESS_PAYMENT) {
        const auctionIdBidding = placeABid.auctionIdBiding;
        SocketManager.instanceBid.joinAuction(auctionIdBidding, _ => {});
        handleBixMax(error, auctionIdBidding);
        return;
      }
      setShowErrorAlert(true);
    });
    return () => {
      dispatch(clear());
    };
  }, []);

  useEffect(() => {
    show(0);
  }, []);

  const onCbPaymentIssue = () => {
    setShowSuccessAlert(false);
    headerCloseButton().then(_r => {});
  };

  const checkPayment = () => {
    const auctionIdBidding = placeABid.auctionIdBiding;
    dispatch(setUserBidded(true));
    SocketManager.instanceBid.sendRetryBid(auctionIdBidding as string);
  };

  const hideAlertSuccess = () => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    setMinimumReservePriceDialog(false);
  };

  const handleBixMax = (data, auctionId: string) => {
    const {
      transaction: { approveUrl, id, status },
      auction: { endNowBidAt, type },
    } = data.data;

    transactionIdRef.current = id;

    SocketManager.instanceBid.setIshHideSuccessWhenProcessingPaypal(true);
    setTimeout(() => {
      SocketManager.instanceBid.setIshHideSuccessWhenProcessingPaypal(false);
    }, 3000);

    if (type === AUCTION_TYPE.RAFFLE) {
      NavigationActionsService.push(PAYPAL_WEB_VIEW, { approveUrl, id, onCompletePaypal });
      return;
    }

    // card failed
    if (status === 'failed') {
      NavigationActionsService.push(MODAL_PAYMENT, {
        endNowBidAt: endNowBidAt,
        isBidMaxCardFail: true,
        onCbPaymentIssue,
        checkPaymentCard: checkPayment,
      });
      return;
    }

    NavigationActionsService.push(MODAL_PAYMENT, {
      approveUrl,
      id,
      profileId: placeABid.auctionIdBiding,
      endNowBidAt,
      isFromBidMax: true,
      onPaymentComplete,
      auctionId: auctionId,
      isBidNormalAfterBidMax: SocketManager.instanceBid.getIsBidNormalAfterBidMax(),
      hideAlertSuccess,
    });
  };

  const onCompletePaypal = (isSuccess: boolean) => {
    // login paypal success
    if (isSuccess) {
      // isFromTransaction : true /transactions/payment-capture
      // isFromTransaction : false /auctions/payment-capture
      NavigationActionsService.dispatchAction(
        getStatusPayment({
          transactionId: transactionIdRef.current,
          onSuccess: onPaymentComplete,
          onFail: onPaymentComplete,
        }),
      );
    }
  };

  const onPaymentComplete = (isSuccess: boolean) => {
    // login paypal success
    isPaymentSuccess = isSuccess;
    setShowSuccessAlert(true);
    const auctionIdBidding = placeABid.auctionIdBiding;
    const auctionObject = auctionReducer.auctionDictionary[auctionIdBidding];
    dispatch(setAuction(auctionObject));
  };

  const show = async (positoin: number) => {
    return new Promise(resolve => {
      setDisableTouch(true);
      Animated.timing(translateY, {
        toValue: positoin,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setDisableTouch(false);
        resolve(true);
      });
    });
  };

  const hide = async () => {
    return new Promise(resolve => {
      setDisableTouch(true);
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setDisableTouch(false);
        resolve(true);
      });
    });
  };

  const backdropOnPressed = async () => {
    await headerCloseButton();
  };

  const headerCloseButton = async () => {
    await hide();
    navigation.canGoBack() && navigation.goBack();
  };

  const successAlertClose = () => {
    // remove user when bid max case bid over 5p
    if (!isPaymentSuccess) {
      setShowSuccessAlert(false);
      headerCloseButton().then(_r => {});
      placeABid.userProfileId && bidMax.next({ userId: placeABid.userProfileId });
      // set init value
      isPaymentSuccess = true;
      return;
    }
    setShowSuccessAlert(false);
    headerCloseButton().then(_r => {});
    bidMax.next({ userId: placeABid.userProfileId });
  };

  const pointerEvents = disableTouch ? 'none' : 'auto';

  const errorMessageHandler = (mesage: string) => {
    setErrorMessage(mesage);
  };

  return (
    <PlaceABidContext.Provider
      value={{
        errorMessageHandler: errorMessageHandler,
        isAuctionRaffle,
        auction,
      }}
    >
      <KeyboardAvoidingView style={ROOT_VIEW} behavior={isAndroid ? 'height' : 'padding'}>
        <View style={ROOT_VIEW} pointerEvents={pointerEvents}>
          <Pressable style={BACK_DROP} onPress={backdropOnPressed} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Animated.View style={[CONTAINER, { transform: [{ translateY: translateY }] }]}>
              <PlaceABidTitle closeOnPressed={headerCloseButton} />
              <PlaceABidLineBreak />
              <PlaceABidCategories />
              {isAuctionRaffle ? (
                <PlaceABidTicketPrice />
              ) : (
                <>
                  <PlaceABidSuggestedBids />
                  {endNowPrice && <PlaceABidEndItNowPrice />}
                </>
              )}
              <PlaceABidCalculatorView />
              <PlaceABidErrorMessage errorMessage={errorMessage} />
              <PlaceABidButton />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>

        <PlaceABidSuccessAlert
          isAuctionRaffle={isAuctionRaffle}
          isVisible={showSuccessAlert}
          onBackdropPress={successAlertClose}
          isFromHomeDetail={isFromHomeDetail}
        />
        <PlaceABidErrorAlert
          isVisible={showErrorAlert}
          onBackdropPressed={() => setShowErrorAlert(false)}
          tryAgainOnPressed={() => setShowErrorAlert(false)}
        />
        <MinimumReservePriceDialog
          isVisible={minimumReservePriceDialog}
          onBackdropPressed={() => setMinimumReservePriceDialog(false)}
          bidHigherOnPressed={() => setMinimumReservePriceDialog(false)}
        />
      </KeyboardAvoidingView>
    </PlaceABidContext.Provider>
  );
}
