import { Auction, AuctionStatus } from '@/models';
import React, { ReactElement } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import MyAuctionsBidding from './MyAuctionsBidding';
import MyAuctionsCreateNewAuction from './MyAuctionsCreateNewAuction';
import MyAuctionsEmptyDescription from './MyAuctionsEmptyDescription';
import MyAuctionsNoWinner from './MyAuctionsNoWinner';
import MyAuctionsOnProcessingList from './MyAuctionsOnProcessingList';

interface Props {
  style?: ViewStyle;
  auctionNoWinner: Auction;
  auctionBidding: Auction;
  auctionOnProcessingList: Auction[];
}

export default function MyAuctionsTopView(props: Props): ReactElement {
  const { auctionBidding, auctionNoWinner = undefined, auctionOnProcessingList = [] } = props;
  const renderContent = () => {
    if (auctionBidding || (auctionOnProcessingList && auctionOnProcessingList.length > 0))
      return (
        <>
          {auctionBidding && <MyAuctionsBidding auctionBidding={auctionBidding} />}
          {auctionOnProcessingList && auctionOnProcessingList.length > 0 && (
            <MyAuctionsOnProcessingList dataList={auctionOnProcessingList} />
          )}
          {!auctionBidding && <MyAuctionsCreateNewAuction />}
        </>
      );
    if (auctionNoWinner && auctionNoWinner.status === AuctionStatus.NO_WINNER)
      return (
        <>
          <MyAuctionsNoWinner auctionNoWinner={auctionNoWinner} />
          <MyAuctionsEmptyDescription shouldHideImageEmpty />
          <MyAuctionsCreateNewAuction />
        </>
      );
    return (
      <>
        <MyAuctionsEmptyDescription />
        <MyAuctionsCreateNewAuction />
      </>
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
});
