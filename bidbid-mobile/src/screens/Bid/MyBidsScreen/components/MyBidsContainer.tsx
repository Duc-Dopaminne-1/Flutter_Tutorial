import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { getAuctionsInProgress, getAuctionsWon, getLikesGoneLive } from '@/redux/myBids/actions';
import { useDispatch } from 'react-redux';
import { refreshMyBid } from '@/shared/global';
import { useNavigation } from '@react-navigation/core';
import NavigationActionsService from '@/navigation/navigation';
import { Auction } from '@/models';

import MyBidsPresenter from './MyBidsPresenter';
import { filterAuctionsWon } from '@/shared/processing';

export default function MyBidsContainer(): ReactElement {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);

  const [auctionWonList, setAuctionWonList] = useState<Auction[]>([]);
  const [auctionLikeGoneLiveList, setAuctionLikeGoneLiveList] = useState<Auction[]>([]);
  const [auctionProgressList, setAuctionProgressList] = useState<Auction[]>([]);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  useEffect(() => {
    NavigationActionsService.showLoading();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    refreshMyBid.next(true);
    setRefreshing(true);
    wait(1500).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const refreshMyBidSubscribe = refreshMyBid.subscribe(_data => {
      fetchData();
    });

    return () => {
      refreshMyBidSubscribe && refreshMyBidSubscribe.unsubscribe();
    };
  }, []);

  //------------------------------------------------
  // Fetch Data
  //------------------------------------------------
  const fetchData = async () => {
    try {
      const [auctionWonList, likeGoneLiveList, auctionProcessList] = await Promise.all([
        fetchAuctionWon(),
        fetchLikeGoneLive(),
        fetchAuctionProcess(),
      ]);

      setAuctionWonList(filterAuctionsWon(auctionWonList));

      setAuctionLikeGoneLiveList(likeGoneLiveList);
      setAuctionProgressList(auctionProcessList);

      NavigationActionsService.hideLoading();
      setLoading(false);
    } catch (error) {
      setAuctionWonList([]);
      setAuctionLikeGoneLiveList([]);
      setAuctionProgressList([]);
    }
  };

  const fetchAuctionWon = (): Promise<Auction[]> => {
    return new Promise(resolve => {
      dispatch(
        getAuctionsWon({
          currentPage: 1,
          perPage: 4,
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

  const fetchLikeGoneLive = (): Promise<Auction[]> => {
    return new Promise(resolve => {
      dispatch(
        getLikesGoneLive({
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

  const fetchAuctionProcess = (): Promise<Auction[]> => {
    return new Promise(resolve => {
      dispatch(
        getAuctionsInProgress({
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

  if (isLoading) return null;

  return (
    <MyBidsPresenter
      onRefresh={onRefresh}
      refreshing={refreshing}
      auctionWonList={auctionWonList}
      auctionLikeGoneLiveList={auctionLikeGoneLiveList}
      auctionProgressList={auctionProgressList}
    />
  );
}
