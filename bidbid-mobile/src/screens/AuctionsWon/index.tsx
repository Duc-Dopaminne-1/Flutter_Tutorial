import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, TextStyle, ViewStyle, View, ActivityIndicator } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import AuctionsWonItem from './component/AuctionsWonItem';
import { filterAuctionsWon } from '@/shared/processing';
import { isIOS } from '@/shared/devices';
import IconBack from '@/components/SVG/BackSvg';
import { Auction } from '@/models';
import { getAuctionsWon } from '@/redux/myBids/actions';
import NavigationActionsService from '@/navigation/navigation';

export function AuctionsWonScreen(): ReactElement {
  let onEndReachedCalledDuringMomentum = true;
  const [isLoading, setIsLoading] = useState(false);
  let currentPageTmp = useRef(1);
  let perPageTmp = useRef(10);
  const [listData, setListData] = useState([]);

  const renderItem = ({ item, index }) => {
    return <AuctionsWonItem item={item} index={index} />;
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator style={styles.loading} />;
  };

  useEffect(() => {
    async function fetchAuctionWons() {
      const result = await fetchAuctionWon();
      setListData(filterAuctionsWon(result));
    }
    fetchAuctionWons().then(_r => undefined);
  }, []);

  const fetchAuctionWon = (): Promise<Auction[]> => {
    return new Promise(resolve => {
      NavigationActionsService.dispatchAction(
        getAuctionsWon({
          currentPage: currentPageTmp.current,
          perPage: perPageTmp.current,
          onSuccess: (data: Auction[]) => {
            return resolve(data);
          },
          onFail: _ => {
            return resolve([]);
          },
        }),
      );
    });
  };

  const handleLoadMore = async () => {
    if (!isLoading && !onEndReachedCalledDuringMomentum) {
      onEndReachedCalledDuringMomentum = true;
      setIsLoading(true);
      currentPageTmp.current = currentPageTmp.current + 1;
      const auctions = await fetchAuctionWon();
      setIsLoading(false);
      setListData([...listData, ...filterAuctionsWon(auctions)]);
    }
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('auctionWonScreen.title')} titleStyle={styles.textTitle} />

      {listData.length === 0 ? (
        <ActivityIndicator color={colors.red_600} style={styles.loadingView} />
      ) : (
        <FlatList
          style={styles.flatList}
          scrollToOverflowEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={listData}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.spaceView} />}
          keyExtractor={item => item.id.toString()}
          extraData={listData}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum = false;
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  } as ViewStyle,

  textTitle: {
    color: colors.gray_900,
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: fonts.size.s16,
  } as TextStyle,

  flatList: {
    marginVertical: 20,
    paddingHorizontal: 16,
  } as ViewStyle,
  spaceView: {
    height: 5,
  } as ViewStyle,
  loadingView: {
    flex: 1,
    paddingVertical: 20,
    color: colors.red_600,
  },
  loading: {
    paddingVertical: 20,
    color: colors.black,
  },
});
