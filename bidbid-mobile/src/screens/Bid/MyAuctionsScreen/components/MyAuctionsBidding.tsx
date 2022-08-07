import React, { ReactElement, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import { Auction, AUCTION_TYPE } from '@/models';
import { CustomBidInfo } from '@/components/CustomBidInfo/CustomBidInfo';
import { formatTime } from '@/shared/processing';
import { SocketManager } from '@/shared/socket/socket-manager';

interface Props {
  auctionBidding: Auction;
}

export default function MyAuctionsBidding(props: Props): ReactElement {
  const { auctionBidding = null } = props;

  // Check Auction invalid data
  if (!auctionBidding || auctionBidding.id.toString() === '') return null;
  const {
    categories,
    meetDate,
    charity: { name },
    meetPlace,
    endAt,
    startingPrice,
    endNowPrice,
    reservePrice,
    winningBid,
    offering,
    dynamicLink,
    entryPrice,
    type,
  } = auctionBidding;

  const isRaffleAuction = type === AUCTION_TYPE.RAFFLE;
  const totalTimeMeet = auctionBidding?.meetingDuration?.name || '';
  const timeMeet = formatTime(new Date(meetDate));
  const price = winningBid ? winningBid.price : startingPrice;

  useEffect(() => {
    SocketManager.instanceBid.joinAuction(auctionBidding.id.toString(), (_: Auction) => {});
  }, []);

  return (
    <View style={styles.container}>
      <CustomBidInfo
        key={'auction'}
        isFromMyAuction
        isRaffleAuction={isRaffleAuction}
        dynamicLink={dynamicLink}
        auctionId={auctionBidding.id.toString()}
        infoPrice={isRaffleAuction ? entryPrice : price}
        startingPrice={startingPrice?.toString()}
        offering={offering}
        infoTime={endAt}
        titleBid={isRaffleAuction ? language('ticketPrice') : language('currentBid')}
        titleBidAuction={isRaffleAuction ? language('raffleEnds') : language('auctionEnds')}
        titleDonate={`${language('donatingTo')} ${name}`}
        titleTime={`${language('meetGreet')}: ${timeMeet}`}
        tilAddress={meetPlace ? (meetPlace.address ? meetPlace.address.replace(/(\r\n|\n|\r)/gm, '') || '' : '') : ''}
        meetPlace={meetPlace}
        categories={categories as []}
        infoReservePrice={reservePrice}
        infoEndNowPrice={endNowPrice}
        titleReservePrice={language('minimumPrice')}
        titleEndPrice={language('endPrice')}
        totalTimeMeet={totalTimeMeet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginBottom: 5,
  },
});
