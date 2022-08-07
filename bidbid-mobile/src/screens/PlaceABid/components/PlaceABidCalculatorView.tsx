import React, { ReactElement, useState, useEffect, useContext } from 'react';
import { StyleSheet, View, ViewStyle, TextStyle, TouchableOpacity, Text } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { TextInputComponent } from '@/components/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import { isIOS } from '@/shared/devices';
import { setPrice, setPriceRaffle } from '@/redux/placeABid/actions';
import { currencyFormat } from '../PlaceABid';
import IconPlusSVG from '@/components/SVG/IconPlusSVG';
import IconMinusSVG from '@/components/SVG/IconMinusSVG';
import { PlaceABidContext } from '@/screens/PlaceABid/PlaceABidContext';
import { initialState } from '@/redux/placeABid/reducer';

const PRICE_STEP = 2.0;
const PRICE_AUCTION_STEP = 1;

const CONTAINER: ViewStyle = {
  marginTop: 25,
};

const ROW_CALCULATOR: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: 30,
};

const ROW_DESCRIPTION: ViewStyle = {
  alignItems: 'center',
};

const CURRENT_BID_TEXT: TextStyle = {
  paddingVertical: 10,
  paddingHorizontal: 20,
  fontSize: fonts.size.s14,
  color: colors.gray_600,
  fontFamily: fonts.family.PoppinsRegular,
  alignItems: 'center',
};

const CURRENT_BID_RAFFLE_TEXT: TextStyle = {
  paddingVertical: 10,
  paddingHorizontal: 20,
  fontSize: fonts.size.s14,
  color: colors.blue_700,
  fontFamily: fonts.family.RobotoMediumItalic,
  alignItems: 'center',
};

const searchRegExp = /,/g;

export function PlaceABidCalculatorView(): ReactElement {
  const dispatch = useDispatch();
  const {
    isAuctionRaffle,
    auction: { entryPrice },
  } = useContext(PlaceABidContext);
  const placeABid = useSelector((state: RootState) => {
    return state.placeABid;
  });

  const { auction, price, priceRaffle } = placeABid;
  const priceAuction: any = isAuctionRaffle ? priceRaffle : price;
  const { endNowPrice } = auction;
  const [currentBidPrice, setCurrentBidPrice] = useState<string>('');

  useEffect(() => {
    let currentBidPrice;
    if (auction.winningBid && auction.winningBid.price) {
      currentBidPrice = auction.winningBid?.price?.toFixed(2).toString();
    } else {
      currentBidPrice = auction?.startingPrice ? auction?.startingPrice?.toString() : '0:00';
    }
    setCurrentBidPrice(currentBidPrice);
  }, [auction.winningBid]);

  const onChangeTextPrice = (text: string) => {
    if (isAuctionRaffle && text) {
      dispatch(setPriceRaffle(Number(text)));
      return;
    }

    if (text === '0.00') {
      dispatch(setPrice('0.00'));
      return;
    } else {
      const value = parseFloat(text.replace(searchRegExp, ''));
      if (endNowPrice && value >= endNowPrice) {
        dispatch(setPrice(currencyFormat(endNowPrice)));
      } else {
        dispatch(setPrice(text));
      }
    }
  };

  const minusOnPressed = () => {
    let newPriceNumber;
    if (isAuctionRaffle) {
      newPriceNumber = priceAuction;
      newPriceNumber = newPriceNumber - PRICE_AUCTION_STEP;
      if (newPriceNumber <= 0) {
        newPriceNumber = 0;
      }
      dispatch(setPriceRaffle(newPriceNumber));
    } else {
      if (priceAuction.length === 0) {
        newPriceNumber = '0.00';
      } else {
        const priceNumber = parseFloat(price.replace(searchRegExp, ''));
        newPriceNumber = priceNumber - PRICE_STEP;
        if (newPriceNumber <= 0) {
          newPriceNumber = '';
        } else {
          newPriceNumber = newPriceNumber.toFixed(2);
        }
      }
      dispatch(setPrice(newPriceNumber));
    }
  };

  const plusOnPressed = () => {
    let newPriceNumber;
    if (isAuctionRaffle) {
      newPriceNumber = priceAuction;
      newPriceNumber = newPriceNumber + PRICE_AUCTION_STEP;
      dispatch(setPriceRaffle(newPriceNumber));
    } else {
      if (priceAuction === initialState.price) {
        newPriceNumber = 0.0;
      } else {
        newPriceNumber = parseFloat(priceAuction.replace(searchRegExp, ''));
      }
      newPriceNumber = newPriceNumber + PRICE_STEP;
      if (endNowPrice && newPriceNumber >= endNowPrice) {
        newPriceNumber = endNowPrice.toFixed(2);
      } else {
        newPriceNumber = newPriceNumber.toFixed(2);
      }
      dispatch(setPrice(newPriceNumber));
    }
  };

  const currentBidValue = isAuctionRaffle
    ? language('totalPurchase', { price: priceAuction ? (priceAuction * entryPrice).toFixed(2) : 0 })
    : `${language('placeABid.currentBid')} $${
        currentBidPrice ? currencyFormat(parseFloat(currentBidPrice)) : auction.startingPrice
      } ${language('currency')}`;

  return (
    <View style={CONTAINER}>
      <View style={ROW_CALCULATOR}>
        <TouchableOpacity onPress={minusOnPressed}>
          <IconMinusSVG />
        </TouchableOpacity>
        <TextInputComponent
          styleContainerConfig={styles.wrapInput}
          value={priceAuction}
          onChangeText={onChangeTextPrice}
          placeholderTextColor={colors.bg_tab}
          styleConfig={styles.textInput}
          styleFormConfig={styles.wrapFromInput}
          keyboardType={'number-pad'}
          placeholder={isAuctionRaffle ? '0' : '0.0'}
          isMasked
          isTitleAsterisk
          precision={isAuctionRaffle ? 0 : 2}
        />

        <TouchableOpacity onPress={plusOnPressed}>
          <IconPlusSVG />
        </TouchableOpacity>
      </View>

      <View style={ROW_DESCRIPTION}>
        <Text style={CURRENT_BID_TEXT}>{currentBidValue}</Text>
        {isAuctionRaffle && <Text style={CURRENT_BID_RAFFLE_TEXT}>{language('moreTickets')}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    color: colors.gray_900,
    textAlign: 'center',
    backgroundColor: colors.white,
    fontSize: fonts.size.s22,
    paddingTop: isIOS ? 0 : 3,
    fontFamily: fonts.family.PoppinsBold,
    fontWeight: isIOS ? undefined : '600',
  },

  wrapInput: {
    marginHorizontal: 10,
    borderColor: colors.transparent,
    flex: 1,
  },

  wrapFromInput: {
    height: 40,
    paddingBottom: 0,
    textAlign: 'center',
    borderColor: colors.transparent,
    borderBottomWidth: 0,
    backgroundColor: colors.white,
    fontWeight: '500',
    fontSize: 25,
    color: colors.title_black,
    fontFamily: fonts.family.SSPRegular,
  },
});
