import React, { ReactElement } from 'react';
import { RefreshControl, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import AuctionsWon from './AuctionsWon';
import LikesGoneLive from './LikesGoneLive';
import AuctionsInProgress from './AuctionsInProgress';
import NoBodyGoLive from '@/screens/Bid/MyBidsScreen/components/NoBodyGoLive';
import { Auction } from '@/models';

interface Props {
  auctionWonList?: Auction[];
  auctionLikeGoneLiveList?: Auction[];
  auctionProgressList?: Auction[];
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function MyBidsPresenter(props: Props): ReactElement {
  const { auctionWonList, auctionLikeGoneLiveList, auctionProgressList, refreshing, onRefresh = () => {} } = props;

  if (auctionWonList.length < 1 && auctionLikeGoneLiveList.length < 1 && auctionProgressList.length < 1) {
    return <NoBodyGoLive />;
  }

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <AuctionsWon data={auctionWonList} />
      <LikesGoneLive data={auctionLikeGoneLiveList} />
      <AuctionsInProgress data={auctionProgressList} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
});
