import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomBidInfoTop } from '@/components/CustomBidInfo/CustomBidInfoTop';
import { CustomBidInfoBottom } from '@/components/CustomBidInfo/CustomBidInfoBottom';

interface Prop {
  infoPrice?: number;
  infoTime?: string;
  infoEndNowPrice?: number;
  titleEndPrice?: string;
  titleBid?: string;
  titleBidAuction?: string;
  titleDonate?: string;
  titleTime?: string;
  tilAddress?: string;
  categories?: [];
  infoReservePrice?: number;
  auctionId?: string;
  titleReservePrice?: string;
  meetPlace?: any;
  isFromMyAuction?: boolean;
  totalTimeMeet?: string;
  offering?: string;
  dynamicLink?: string;
  startingPrice?: string;
  isRaffleAuction?: boolean;
  isFromDiscovery?: boolean;
}

export function CustomBidInfo(props: Prop) {
  const {
    infoReservePrice,
    infoPrice,
    infoTime,
    infoEndNowPrice,
    titleEndPrice,
    titleBid,
    titleBidAuction,
    titleDonate,
    titleTime,
    titleReservePrice,
    tilAddress,
    categories,
    auctionId,
    isFromMyAuction,
    meetPlace = { name: '', address: '', lng: '', lat: '' },
    totalTimeMeet,
    offering,
    dynamicLink,
    isRaffleAuction = false,
    isFromDiscovery,
  } = props;

  return (
    <View>
      <View style={styles.wrapTop}>
        <CustomBidInfoTop
          isRaffleAuction={isRaffleAuction}
          infoPrice={infoPrice}
          isFromMyAuction={isFromMyAuction}
          infoTime={infoTime}
          titleBid={titleBid}
          titleBidAuction={titleBidAuction}
          auctionId={auctionId}
          infoEndNowPrice={infoEndNowPrice}
          titleEndPrice={titleEndPrice}
          infoReservePrice={infoReservePrice}
          titleReservePrice={titleReservePrice}
        />
      </View>

      <View style={styles.wrapBottom}>
        <CustomBidInfoBottom
          infoPrice={infoPrice}
          isRaffleAuction={isRaffleAuction}
          infoTime={infoTime}
          dynamicLink={dynamicLink}
          auctionId={auctionId}
          categories={categories}
          titleDonate={titleDonate}
          titleTime={titleTime}
          tilAddress={tilAddress}
          meetPlace={meetPlace}
          totalTimeMeet={totalTimeMeet}
          offering={offering}
          isFromMyAuction={isFromMyAuction}
          isFromDiscovery={isFromDiscovery}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapTop: {
    zIndex: 2,
  },
  wrapBottom: {
    zIndex: 1,
  },
});
