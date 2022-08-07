import CustomHeader from '@/components/CustomHeader';
import { SafeArea } from '@/components/SafeArea';
import { SeparatorView } from '@/components/SeparatorView/SeparatorView';
import { language } from '@/i18n';
import { Auction, AuctionStatus } from '@/models';
import { MY_AUCTION_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { getMyAuctionHistory } from '@/redux/auction/actions';
import { isIOS } from '@/shared/devices';
import { colors, fonts } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import MeetAndGreetItem from '../Bid/MyAuctionsScreen/components/MeetAndGreetItem';
import IconBack from '@/components/SVG/BackSvg';

export const PER_PAGE_AMOUNT = 15;

export function MeetAndGreetHistoryScreen(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [auctionHistoryList, setAuctionHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingFooter, setLoadingFooter] = useState(false);
  const onEndReachedCalledDuringMomentum = useRef(undefined);
  onEndReachedCalledDuringMomentum.current = true;
  const fetchAuctionHistory = async (): Promise<boolean> => {
    const lastAuction: Auction = auctionHistoryList[auctionHistoryList.length - 1];
    return new Promise(resolve => {
      dispatch(
        getMyAuctionHistory({
          perPage: PER_PAGE_AMOUNT,
          offset: lastAuction ? new Date(lastAuction.meetDate).toJSON() : undefined,
          callback: {
            onSuccess: data => {
              setAuctionHistoryList([...auctionHistoryList, ...data]);
              resolve(true);
            },
            onFail: error => {
              alert(error);
              setAuctionHistoryList([]);
              resolve(false);
            },
          },
        }),
      );
    });
  };

  useEffect(() => {
    const fetchDataFirst = async () => {
      setIsLoading(true);
      await fetchAuctionHistory();
      setIsLoading(false);
    };
    fetchDataFirst();
  }, []);

  const renderFooter = () => {
    if (!loadingFooter) return null;
    return <ActivityIndicator style={styles.loading} color={colors.red_600} />;
  };

  const handleLoadMore = async () => {
    if (!loadingFooter && !onEndReachedCalledDuringMomentum.current) {
      onEndReachedCalledDuringMomentum.current = true;
      setLoadingFooter(true);
      await fetchAuctionHistory();
      onEndReachedCalledDuringMomentum.current = false;
      setLoadingFooter(false);
    }
  };

  const onPressItem = useCallback((item, _index) => {
    if ([AuctionStatus.CANCEL, AuctionStatus.COMPLETED, AuctionStatus.FAILED_PAYMENT].includes(item.status)) {
      navigation.navigate(MY_AUCTION_DETAIL_SCREEN, {
        item,
      });
    }
  }, []);

  const renderItem = useCallback(({ item, index }) => {
    return <MeetAndGreetItem item={item} index={index} onPressItem={onPressItem} />;
  }, []);
  const keyExtractor = useCallback(item => item.id as string, []);
  const ItemSeparatorComponent = useMemo(() => SeparatorView, []);

  const renderLoading = () => <ActivityIndicator style={styles.loading} color={colors.red_600} />;
  const renderContent = () => {
    return (
      <FlatList
        style={styles.flatList}
        showsHorizontalScrollIndicator={false}
        data={auctionHistoryList}
        extraData={auctionHistoryList}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
        onEndReached={handleLoadMore}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
      />
    );
  };
  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('myAuctionsScreen.meetAndGreetHistory')} titleStyle={styles.textTitle} />
      {isLoading ? renderLoading() : renderContent()}
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

  loading: {
    flex: 1,
    alignSelf: 'center',
    paddingVertical: 20,
  },
});
