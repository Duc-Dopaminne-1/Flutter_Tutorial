import { getMyAuctionHistory } from '@/redux/auction/actions';
import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import MeetAndGreetHistory from './MeetAndGreetHistory';

const SHOW_MAX_ITEM = 3;
export const RELOAD_DATA_DELAY_SECOND = 5000; //5000ms = 5s

export default function MeetAndGreetHistoryContainer(): ReactElement {
  const dispatch = useDispatch();
  const [auctionHistoryList, setAuctionHistoryList] = useState([]);
  const navigation = useNavigation();
  const reloadDataReady = useRef(undefined);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (reloadDataReady.current) {
        reloadDataReady.current = false;
        fetchAuctionHistory();
      }
      setTimeout(() => (reloadDataReady.current = true), RELOAD_DATA_DELAY_SECOND);
    });
    return unsubscribe;
  }, [navigation]);

  const fetchAuctionHistory = useCallback(() => {
    dispatch(
      getMyAuctionHistory({
        perPage: SHOW_MAX_ITEM,
        callback: {
          onSuccess: data => {
            setAuctionHistoryList(data);
          },
          onFail: error => {
            alert(error);
            setAuctionHistoryList([]);
          },
        },
      }),
    );
  }, []);

  useEffect(() => {
    fetchAuctionHistory();
  }, []);
  return <MeetAndGreetHistory dataList={auctionHistoryList} />;
}
