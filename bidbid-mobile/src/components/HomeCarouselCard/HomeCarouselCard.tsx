import React, { FC, memo, useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { DISCOVERY, DiscoveryState } from '@/redux/discovery';
import { safeAuction, validateAuction } from '@/shared/processing';
import { Auction } from '@/models/auction';
import { SocketManager } from '@/shared/socket/socket-manager';
import { deviceHeight } from '@/vars';
import CustomScrollView from '@/components/CustomScrollView';
import HomeCarouselCardImage from './HomeCarouselCardImage';
import HomeCarouselCardDetail from './HomeCarouselCardDetail';
import HomeCarouselCardGallery from './HomeCarouselCardGallery';
import HomeCarouselCardRevertIcon from './HomeCarouselCardRevertIcon';
import useCardHeight from './useCardHeight';
import styles from './styles';
import { IconBorderLeft, IconBorderRight } from '@/vars/imagesSvg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vs } from '@/vars/scaling';
import sortCategories from '@/shared/sortCategories';
import { formatNameUser } from '@/shared/discovery';

interface HomeCarouselCardProps {
  data?: DISCOVERY;
  detailData?: DISCOVERY;
  isActive?: boolean;
  fullHeight?: boolean;
  isFromDiscovery?: boolean;
}

const HomeCarouselCard: FC<HomeCarouselCardProps> = ({ data, isFromDiscovery, detailData, isActive = true, fullHeight }) => {
  const insets = useSafeAreaInsets();
  useSelector((state: DiscoveryState) => {
    return state.discovery.triggerEndTime;
  });
  const height = useCardHeight();

  const discoveryData = useMemo(() => detailData || data, [detailData, data]);
  const linkShareSocial = discoveryData.auctions.length > 0 ? discoveryData.auctions[0].dynamicLink : '';
  const liveAuction: Auction = useMemo(() => {
    return safeAuction(discoveryData?.auctions || [])?.find(auction => validateAuction(auction?.endAt));
  }, [discoveryData?.auctions]);

  useEffect(() => {
    if (liveAuction) {
      SocketManager.instanceBid.joinAuction(liveAuction.id.toString(), _ => {});
    }
  }, [liveAuction]);

  if (!discoveryData) {
    return null;
  }

  const photos = useMemo(() => {
    return (
      discoveryData?.photos?.filter(
        photo => photo.type !== 'verify' && photo.type !== 'thumbnail' && photo.id !== discoveryData?.avatar?.id,
      ) || []
    );
  }, [discoveryData?.photos]);

  const avatar = useMemo(() => {
    return discoveryData?.thumbnail?.url || discoveryData?.avatar?.url || '';
  }, [discoveryData]);

  return (
    <View style={[styles.wrapper, !fullHeight ? { height } : styles.fullHeight]}>
      {!fullHeight && <HomeCarouselCardRevertIcon />}
      <View style={styles.container}>
        <View style={style.wrapIconLeft}>
          <IconBorderLeft />
        </View>

        <View style={style.wrapIconRight}>
          <IconBorderRight />
        </View>

        <CustomScrollView bounces={false} style={styles.scrollContainer} scrollEnabled={isActive}>
          <Pressable style={{ minHeight: !fullHeight ? height : deviceHeight - vs(40) - insets.top - insets.bottom }}>
            <HomeCarouselCardImage
              isFromDiscovery={isFromDiscovery}
              firstName={formatNameUser(discoveryData)}
              dateOfBirth={discoveryData.dateOfBirth}
              uri={avatar}
              isThumbnail={!!discoveryData?.thumbnail?.url}
              hideAge={discoveryData.hideAge}
              liveAuction={liveAuction}
              status={discoveryData.status}
              description={discoveryData.description}
            />

            <HomeCarouselCardDetail
              isFromDiscovery={isFromDiscovery}
              likes={discoveryData.likes}
              donate={discoveryData?.donate}
              languages={discoveryData?.languages}
              liveAuction={liveAuction}
              interests={discoveryData?.interests}
              strengths={discoveryData?.strengths}
              categories={sortCategories(discoveryData?.categories)}
              linkShareSocial={linkShareSocial}
              instagramUsername={discoveryData.instagramUsername}
              city={discoveryData?.city?.address}
              jobName={discoveryData?.job?.name}
              companyName={discoveryData?.company?.name}
              schoolName={discoveryData?.school?.name}
            />
          </Pressable>
          <Pressable>
            <HomeCarouselCardGallery photos={photos} />
          </Pressable>
        </CustomScrollView>
      </View>
    </View>
  );
};

export default memo(HomeCarouselCard);

const style = StyleSheet.create({
  wrapIconLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
  },
  wrapIconRight: {
    position: 'absolute',
    top: 0,
    right: -4,
    zIndex: 99,
  },
});
