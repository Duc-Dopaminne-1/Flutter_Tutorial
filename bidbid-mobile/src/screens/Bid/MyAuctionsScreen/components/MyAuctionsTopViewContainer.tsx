import { Auction } from '@/models';
import { getMyAuctionActive, getMyAuctionLasted } from '@/redux/auction/actions';
import { DiscoveryState } from '@/redux/discovery';
import { getMyAuction } from '@/shared/global';
import { filterAuctionsBidding, filterAuctionsOnProcessing, sortAuctionByCreatedAt } from '@/shared/processing';
import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RELOAD_DATA_DELAY_SECOND } from './MeetAndGreetHistoryContainer';
import MyAuctionsTopView from './MyAuctionsTopView';
import NavigationActionsService from '@/navigation/navigation';

export default function MyAuctionsTopViewContainer(): ReactElement {
  const navigation = useNavigation();
  const [auctionNoWinner, setAuctionNoWinner] = useState(undefined);
  const [auctionsActive, setAuctionsActive] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const reloadDataReady = useRef(true);

  const triggerRender = useSelector((state: DiscoveryState) => {
    return state.discovery.triggerEndTime;
  });

  useEffect(() => {
    const auctionSubscribe = getMyAuction.subscribe(async _data => {
      await fetchAuctionActive();
    });
    return () => {
      auctionSubscribe.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (reloadDataReady.current) {
        reloadDataReady.current = false;
        await fetchAuctionActive(data => {
          if (!data || data.length < 1) {
            fetchMyAuctionLasted();
          }
        });
        setTimeout(() => {
          reloadDataReady.current = true;
        }, RELOAD_DATA_DELAY_SECOND);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const fetchAuctionActive = async (cb = (_data: Auction[]) => {}) => {
    NavigationActionsService.dispatchAction(
      getMyAuctionActive({
        onSuccess: data => {
          setAuctionsActive(data);
          cb && cb(data);
        },
        onFail: error => {
          alert(error);
          setAuctionsActive(undefined);
        },
      }),
    );
  };

  const fetchMyAuctionLasted = async () => {
    NavigationActionsService.dispatchAction(
      getMyAuctionLasted({
        onSuccess: data => {
          if (data && data.length > 0) {
            const dataSorted = sortAuctionByCreatedAt(data)[0];
            setAuctionNoWinner(dataSorted);
          } else {
            setAuctionNoWinner(undefined);
          }
        },
        onFail: error => {
          alert(error);
          setAuctionNoWinner(undefined);
        },
      }),
    );
  };

  const fetchData = async () => {
    await fetchAuctionActive();
    await fetchMyAuctionLasted();
    setFirstLoad(false);
  };

  useEffect(() => {
    fetchData().then(_r => {});
  }, [triggerRender]);

  const auctionBiddings: Auction[] = filterAuctionsBidding(auctionsActive);
  const auctionBidding = auctionBiddings && auctionBiddings.length > 0 ? auctionBiddings[0] : null;

  const auctionOnProcessingList: Auction[] = filterAuctionsOnProcessing(auctionsActive);

  if (firstLoad) return null;
  return (
    <MyAuctionsTopView
      auctionBidding={auctionBidding}
      auctionOnProcessingList={auctionOnProcessingList}
      auctionNoWinner={auctionNoWinner}
    />
  );
}
