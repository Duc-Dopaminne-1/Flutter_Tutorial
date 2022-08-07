import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { CustomText } from '@/components/CustomText';
import { CustomBidInfoTopTimer } from '@/components/CustomBidInfo/CustomBidInfoTopTimer';
import { RootState } from '@/redux/reducers';
import { useSelector } from 'react-redux';
import NavigationActionsService from '@/navigation/navigation';
import { setTriggerEndTime } from '@/redux/discovery/actions';
import { s, vs } from '@/vars/scaling';
import { formatPrice } from '@/shared/processing';
import ClockSVG from '@/components/SVG/ClockSVG';
import { AUCTION_TYPE } from '@/models';

interface Prop {
  infoPrice?: number;
  infoTime?: string;
  titleBid?: string;
  titleBidAuction?: string;
  auctionId?: string;
  infoEndNowPrice?: number;
  titleEndPrice?: string;
  infoReservePrice?: number;
  titleReservePrice?: string;
  isFromMyAuction?: boolean;
  isRaffleAuction?: boolean;
}

export function CustomBidInfoTop(props: Prop): ReactElement {
  const {
    infoPrice,
    infoTime,
    titleBid,
    titleBidAuction,
    auctionId,
    infoEndNowPrice,
    titleEndPrice,
    infoReservePrice,
    titleReservePrice,
    isFromMyAuction,
    isRaffleAuction,
  } = props;
  const [currentPrice, setCurrentPrice] = useState(0);
  const { auction: auctionReducer } = useSelector((state: RootState) => {
    return state;
  });

  useEffect(() => {
    setCurrentPrice(infoPrice || 0);
  }, [infoPrice]);

  useEffect(() => {
    if (currentPrice === infoEndNowPrice) {
      NavigationActionsService.dispatchAction(setTriggerEndTime());
    }
  }, [currentPrice, infoEndNowPrice]);

  useEffect(() => {
    let price = 0;
    const currentAuction = auctionReducer.auctionDictionary[auctionId] || {};
    if (currentAuction.type === AUCTION_TYPE.RAFFLE) {
      if (currentAuction.winningBid?.price) price = currentAuction.winningBid?.price;
      else if (currentAuction.entryPrice) price = currentAuction.entryPrice;
    } else {
      if (currentAuction.winningBid?.price) price = currentAuction.winningBid?.price;
      else if (currentAuction.startingPrice) price = currentAuction.startingPrice;
    }

    setCurrentPrice(price);
  }, [auctionReducer.auctionDictionary]);

  const endTimeCB = useCallback(() => {
    if (isFromMyAuction) {
      setTimeout(() => {
        NavigationActionsService.dispatchAction(setTriggerEndTime());
      }, 4000);
      return;
    }
    NavigationActionsService.dispatchAction(setTriggerEndTime());
  }, []);

  const currentPriceValue = formatPrice(currentPrice);
  const infoEndNowPriceValue = formatPrice(infoEndNowPrice);
  const infoReservePriceValue = formatPrice(infoReservePrice);

  return (
    <View style={[styles.container, isRaffleAuction ? styles.bgRaffle : {}]}>
      <View style={styles.wrapItemBid}>
        <View style={styles.wrapTitle}>
          <CustomText containerStyle={styles.wrapText} titleStyle={styles.title} title={titleBid} numberOfLines={1} />
        </View>
        <View style={styles.wrapInfo}>
          <CustomText containerStyle={styles.wrapText} titleStyle={styles.money} title={currentPriceValue} numberOfLines={1} />
        </View>
      </View>

      <View style={styles.wrapItemAuction}>
        <View style={styles.wrapTitle}>
          <CustomText containerStyle={styles.wrapText} titleStyle={styles.title} title={titleBidAuction} numberOfLines={1} />
        </View>
        <View style={styles.wrapInfo}>
          <View style={styles.wrapItemTime}>
            <ClockSVG color={colors.white} />
            <CustomBidInfoTopTimer infoTime={infoTime} endTimeCB={endTimeCB} timeStyle={styles.money} />
          </View>
        </View>
      </View>

      {infoEndNowPrice ? (
        <View style={styles.wrapItemAuction}>
          <View style={styles.wrapTitle}>
            <CustomText containerStyle={styles.wrapText} titleStyle={styles.title} title={titleEndPrice} numberOfLines={1} />
          </View>
          <View style={styles.wrapInfo}>
            <CustomText containerStyle={styles.wrapText} titleStyle={styles.money} title={infoEndNowPriceValue} numberOfLines={1} />
          </View>
        </View>
      ) : null}

      {infoReservePrice ? (
        <View style={styles.wrapItemAuction}>
          <View style={styles.wrapTitleReserve}>
            <CustomText containerStyle={styles.wrapText} titleStyle={styles.title} title={titleReservePrice} />
          </View>
          <View style={styles.wrapInfo}>
            <CustomText containerStyle={styles.wrapText} titleStyle={styles.money} title={infoReservePriceValue} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue_600,
    marginTop: vs(6),
    paddingVertical: vs(13),
    paddingHorizontal: s(18),
    marginHorizontal: s(18),
    borderRadius: 12,
    zIndex: 2,
    justifyContent: 'center',
  },
  wrapTitle: {
    width: '45%',
  },
  wrapTitleReserve: {
    marginRight: s(20),
  },
  wrapInfo: {
    width: '57%',
  },
  wrapItemTime: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  wrapText: {
    justifyContent: 'flex-start',
  },
  wrapItemBid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapItemAuction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
  },
  money: {
    fontSize: fonts.size.s14,
    fontWeight: '500',
    fontFamily: fonts.family.RobotoRegular,
    color: colors.white,
  },
  title: {
    fontSize: fonts.size.s12,
    fontFamily: fonts.family.RobotoRegular,
    color: colors.white,
  },
  bgRaffle: {
    backgroundColor: colors.purple,
  },
});
