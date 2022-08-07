import React, { ReactElement, useCallback } from 'react';
import { StyleSheet, View, ViewStyle, FlatList } from 'react-native';
import { language } from '@/i18n';
import { AUCTIONS_WON_SCREEN, MY_AUCTION_DETAIL_SCREEN } from '@/navigation/screenKeys';
import HeaderView from './HeaderView';
import AuctionsWonItem from './AuctionsWonItem';
import { useNavigation } from '@react-navigation/native';
import { Auction, AuctionStatus } from '@/models';
import { alertError } from '@/shared/alert';

interface Prop {
  data: Auction[];
}

export default function AuctionsWon(props: Prop): ReactElement {
  const { data } = props;
  const navigation = useNavigation();

  const viewAllOnPressed = () => {
    navigation.navigate(AUCTIONS_WON_SCREEN);
  };

  const onPressItem = useCallback((item, _index) => {
    if (item.status === AuctionStatus.CANCEL || AuctionStatus.READY_TO_MEET || AuctionStatus.COMPLETED) {
      navigation.navigate(MY_AUCTION_DETAIL_SCREEN, {
        item,
      });
    } else {
      alertError('Coming soon', language('error'), null);
    }
  }, []);

  const renderItem = ({ item, index }) => {
    return <AuctionsWonItem item={item} index={index} onPressItem={onPressItem} />;
  };

  const renderFlatListFooter = () => <View style={styles.footer} />;

  return (
    <View style={styles.container}>
      <HeaderView title={language('myBidsScreen.auctionsWon')} viewAllOnPressed={viewAllOnPressed} />
      {data && data.length > 0 ? (
        <FlatList
          style={styles.flatList}
          contentContainerStyle={styles.wrapFlatList}
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          extraData={data}
          horizontal={true}
          ListFooterComponent={renderFlatListFooter}
        />
      ) : (
        <View style={styles.emptyView} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  } as ViewStyle,

  flatList: {
    paddingLeft: 24,
  } as ViewStyle,

  wrapFlatList: {
    paddingVertical: 5,
  } as ViewStyle,

  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  footer: {
    flex: 1,
    width: 34,
  } as ViewStyle,
});
