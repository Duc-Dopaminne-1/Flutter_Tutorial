import React, { ReactElement, useContext, useState } from 'react';
import { TextStyle, ViewStyle, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { RootState } from '@/redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { AUCTION_TYPE, AuctionStatus } from '@/models';
import { PlaceABidContext } from '../PlaceABidContext';
import DefaultText from '@/components/CustomText/DefaultText';
import NavigationActionsService from '@/navigation/navigation';
import { setUserBidded } from '@/redux/placeABid/actions';
import { SocketManager } from '@/shared/socket/socket-manager';
import store from '@/redux/store';
import { PAYMENT_ACCOUNTS_SCREEN } from '@/navigation/screenKeys';
import MyAuctionCreateModal from '@/screens/Bid/MyAuctionsScreen/components/MyAuctionCreateModal';
import Modal from 'react-native-modal';

const CONTAINER: ViewStyle = {
  padding: 12,
  marginTop: 15,
  marginHorizontal: 15,
  borderRadius: 36,
  alignItems: 'center',
  backgroundColor: colors.red_700,
};

const CURRENT_BID_TEXT: TextStyle = {
  fontSize: fonts.size.s18,
  fontWeight: '500',
  color: colors.white,
  fontFamily: fonts.family.SSPRegular,
  alignItems: 'center',
};

export function PlaceABidButton(): ReactElement {
  const dispatch = useDispatch();
  const { placeABid, user } = useSelector((state: RootState) => {
    return state;
  });
  const { isAuctionRaffle } = useContext(PlaceABidContext);
  const { categoriesIdSelected, price, auction, priceRaffle } = placeABid;

  const { errorMessageHandler: errorMessageHandler } = useContext(PlaceABidContext);
  const { paymentMethodId } = user.data;

  const [isModalVisile, setModalVisible] = useState(false);

  const onPressLink = () => {
    setModalVisible(false);
    NavigationActionsService.push(PAYMENT_ACCOUNTS_SCREEN);
  };

  const onBackdropPress = () => {
    setModalVisible(false);
  };

  const sendBidOnPressed = () => {
    Keyboard.dismiss();
    let errorMessage = null;
    if (!isAuctionRaffle && (!price || price.length < 1 || price === '0.00')) {
      errorMessage = language('placeABid.bidPriceGreaterOrEqualIsRequired');
    } else if (isAuctionRaffle && (!priceRaffle || priceRaffle === 0)) {
      errorMessage = language('placeABid.ticketRaffle');
    } else if (!categoriesIdSelected || categoriesIdSelected.length < 1) {
      errorMessage = language('placeABid.categoryIsRequired');
    } else if (
      !isAuctionRaffle &&
      (auction.startingPrice >= parseFloat(price?.replace(/,/g, '')) || auction.winningBid?.price >= parseFloat(price?.replace(/,/g, '')))
    ) {
      errorMessage = language('placeABid.bidPriceGreaterOrEqualIsRequired');
    }

    if (errorMessage && errorMessage.length > 0) {
      errorMessageHandler(errorMessage);
      return;
    } else {
      errorMessageHandler(null);

      if (auction.status === AuctionStatus.BIDDING) {
        if (!paymentMethodId || paymentMethodId === 0) {
          setModalVisible(true);
        } else {
          if (auction.type === AUCTION_TYPE.RAFFLE) {
            NavigationActionsService.showLoading();
            dispatch(setUserBidded(true));
            SocketManager.instanceBid.sendBid({
              categoryIds: categoriesIdSelected,
              quantity: priceRaffle,
              auctionId: auction.id.toString(),
              auctionType: AUCTION_TYPE.RAFFLE,
            });
            return;
          }
          let priceConvert = price ? parseFloat(price?.replace(/,/g, '')) : 0;
          // after bid max but not success
          if (auction.hasOwnProperty('endNowBid') && auction.endNowBid && auction.endNowBid.creatorId === store.getState().user.data.id) {
            if (priceConvert < auction.endNowPrice) {
              SocketManager.instanceBid.setIsBidNormalAfterBidMax(true);
            }
            dispatch(setUserBidded(true));
            SocketManager.instanceBid.sendRetryBid(auction.id.toString());
            setTimeout(() => {
              SocketManager.instanceBid.setIsBidNormalAfterBidMax(false);
            }, 3000);
            return;
          }

          if (priceConvert < auction.endNowPrice) {
            NavigationActionsService.showLoading();
            dispatch(setUserBidded(true));
            SocketManager.instanceBid.sendBid({
              categoryIds: categoriesIdSelected,
              price: priceConvert,
              auctionId: auction.id.toString(),
              auctionType: AUCTION_TYPE.BID,
            });
            return;
          }

          NavigationActionsService.showLoading();
          dispatch(setUserBidded(true));
          SocketManager.instanceBid.sendBid({
            categoryIds: categoriesIdSelected,
            price: priceConvert,
            auctionId: auction.id.toString(),
            auctionType: AUCTION_TYPE.BID,
          });
        }
      } else {
        Alert.alert(
          language('alert.notice'),
          language('placeABid.auctionNotAvailabel'),
          [{ text: language('alert.ok'), onPress: () => {} }],
          {
            cancelable: false,
          },
        );
      }
    }
  };

  return (
    <>
      <TouchableOpacity style={CONTAINER} onPress={() => sendBidOnPressed()}>
        <DefaultText style={CURRENT_BID_TEXT}>{language(isAuctionRaffle ? 'purchaseTicket' : 'placeABid.title')}</DefaultText>
      </TouchableOpacity>
      <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={isModalVisile}>
        <MyAuctionCreateModal isFromPlaceABid={true} onBackdropPress={onBackdropPress} onPressLink={onPressLink} />
      </Modal>
    </>
  );
}
