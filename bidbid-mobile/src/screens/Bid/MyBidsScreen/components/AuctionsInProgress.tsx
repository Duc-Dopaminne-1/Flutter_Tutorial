import React, { ReactElement, useCallback } from 'react';
import { StyleSheet, View, ViewStyle, FlatList } from 'react-native';
import { language } from '@/i18n';
import HeaderView from './HeaderView';
import AuctionsInProgressItem from './AuctionsInProgressItem';
import { useNavigation } from '@react-navigation/native';
import { AUCTIONS_IN_PROGRESS_SCREEN, HOME_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { Auction } from '@/models';

interface Prop {
  data: Auction[];
}

export default function AuctionsInProgress(props: Prop): ReactElement {
  const { data } = props;
  const navigation = useNavigation();
  const viewAllOnPressed = () => {
    navigation.navigate(AUCTIONS_IN_PROGRESS_SCREEN);
  };

  const onPressItem = useCallback((item, _index) => {
    navigation.navigate(HOME_DETAIL_SCREEN, {
      profileId: item.creatorId,
      isFromAuctionInProgress: true,
    });
  }, []);

  const renderItem = ({ item, index }) => {
    return <AuctionsInProgressItem item={item} index={index} onPressed={onPressItem} elevation={5} />;
  };

  return (
    <View style={styles.container}>
      <HeaderView title={language('myBidsScreen.auctionsInProgress')} viewAllOnPressed={viewAllOnPressed} />
      {data && data.length > 0 ? (
        <FlatList
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          extraData={data}
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
    paddingHorizontal: 24,
  } as ViewStyle,

  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});
