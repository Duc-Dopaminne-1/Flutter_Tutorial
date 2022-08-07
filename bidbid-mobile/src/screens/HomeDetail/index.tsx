import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@/vars';
import { useSelector } from 'react-redux';
import { getDiscoveryDetail } from '@/redux/discovery/actions';
import { alertError } from '@/shared/alert';
import { SocketManager } from '@/shared/socket/socket-manager';
import { Auction, AUCTION_TYPE } from '@/models';
import { safeAuction, validateAuction } from '@/shared/processing';
import ErrorDialog from '../DeletetAccount/ErrorDialog';
import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { DISCOVERY, DiscoveryState } from '@/redux/discovery';
import { setAuction } from '@/redux/placeABid/actions';
import HomeCarouselCard from '@/components/HomeCarouselCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';
import HomeDetailBidNowButton from './component/HomeDetailBidNowButton';
import IconBack from '@/components/SVG/BackSvg';
import { saveAuction } from '@/redux/auction/actions';

interface Prop {
  route: any;
}

export function HomeDetailScreen(props: Prop): ReactElement {
  const [data, setData] = useState<DISCOVERY | null>(null);
  const [isRaffleAuction, setIsRaffleAuction] = useState(false);

  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { top, bottom } = useSafeAreaInsets();
  useSelector((state: DiscoveryState) => {
    return state.discovery.triggerEndTime;
  });
  const profileId = props.route.params ? props.route.params?.profileId : {};
  const isDeepLink = props.route.params ? (props.route.params.isDeepLink ? props.route.params.isDeepLink : false) : false;
  const isFromShareSocial = props.route.params
    ? props.route.params.isFromShareSocial
      ? props.route.params.isFromShareSocial
      : false
    : false;
  let isFromAuctionInProgress = props.route.params ? props.route.params?.isFromAuctionInProgress : false;
  let isFromLivesGoneLive = props.route.params ? props.route.params?.isFromLivesGoneLive : false;

  const liveAuction: Auction = useMemo(() => {
    return safeAuction(data?.auctions || [])?.find(auction => validateAuction(auction?.endAt));
  }, [data?.auctions]);

  useEffect(() => {
    NavigationActionsService.dispatchAction(
      getDiscoveryDetail({
        userId: profileId,
        onSuccess,
        onFail: onFail,
      }),
    );
  }, [profileId]);

  const onSuccess = data => {
    const { auctions } = data;
    setData(data);
    const auction: Auction[] = auctions && auctions.length > 0 ? safeAuction(auctions) : [];
    if (auction.length > 0) {
      NavigationActionsService.dispatchAction(saveAuction(auction[0]));
      NavigationActionsService.dispatchAction(setAuction(auction[0]));
      setIsRaffleAuction(auction[0]?.type === AUCTION_TYPE.RAFFLE);
      const auctionId = auction[0].id.toString();
      SocketManager.instanceBid.joinAuction(auctionId, _ => {});
    }
  };

  const onFail = (err: string) => {
    if (!err) {
      setErrorMessage(language('profileNotExist'));
      setErrorDialogVisible(true);
    } else {
      alertError(err);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
      <CustomHeader leftIcon={<IconBack />} isShadow={false} />
      {data?.id ? (
        <>
          <HomeCarouselCard detailData={data} fullHeight />
          {isFromAuctionInProgress || isFromLivesGoneLive || (liveAuction && (isDeepLink || isFromShareSocial)) ? (
            <HomeDetailBidNowButton isRaffleAuction={isRaffleAuction} profileId={profileId} auction={liveAuction} />
          ) : null}
        </>
      ) : (
        <ActivityIndicator color={colors.red_600} size="large" style={styles.activityIndicatorWrapper} />
      )}
      <ErrorDialog
        isVisible={errorDialogVisible}
        onBackdropPress={() => {
          setErrorDialogVisible(false);
          setTimeout(() => {
            NavigationActionsService.goBack();
          }, 200);
        }}
        errorMessage={errorMessage}
        confirmOnPressed={() => {
          setErrorDialogVisible(false);
          setTimeout(() => {
            NavigationActionsService.goBack();
          }, 200);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  activityIndicatorWrapper: {
    backgroundColor: colors.transparent,
    height: 110,
    width: 110,
    borderRadius: 10,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
    flex: 1,
  },
});
