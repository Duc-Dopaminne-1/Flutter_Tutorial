import React, { ReactElement, useEffect, useRef, useState, memo } from 'react';
import { Platform, StyleSheet, View, Image } from 'react-native';
import { colors, images, screenHeight, screenWidth } from '@/vars';
import Swiper, { customSwiperProps } from 'react-native-deck-swiper';
import { DiscoveryState } from '@/redux/discovery';
import { useDispatch, useSelector } from 'react-redux';
import { bidMaxDiscovery, getDiscovery, likeDiscovery, setIndexDiscovery, unlikeDiscovery } from '@/redux/discovery/actions';
import { bidMax, firstProfile, shouldSwipe, TouchDiscovery, touchDiscovery } from '@/shared/global';
import NavigationActionsService from '@/navigation/navigation';
import { LOAD_PROFILE_DISCOVERY, StatusProfile } from '@/constants/app';
import { isUserPaused, safeAuction, validateAuction } from '@/shared/processing';
import { SocketManager } from '@/shared/socket/socket-manager';
import { Auction } from '@/models';
import { setAuctionIdBidding, setUserProfileId } from '@/redux/placeABid/actions';
import { MODAL_PAYMENT, PLACE_A_BID, PROFILE_SCREEN } from '@/navigation/screenKeys';
import store from '@/redux/store';
import { getFilter } from '@/redux/filters/selector';
import HomeCarouselCard from '@/components/HomeCarouselCard';
import { vs } from '@/vars/scaling';
import { getVerify } from '@/shared/discovery';
import { getTransactionsRequired } from '@/redux/payment/actions';
import { language } from '@/i18n';
import CustomConfirmModalHaveLink from '@/components/CustomModalHaveLink';
import { userShared } from '@/shared/user';
import { RootState } from '@/redux/reducers';
import { savePreviousCategoryBidded } from '@/shared/placeABid';
export const TimeChangeDiscovery = 300;
export let isSwiping = false;

function HomeCarousel(): ReactElement {
  const {
    id: userAuthId,
    pauses,
    status,
  } = useSelector((state: RootState) => {
    return state.user.data;
  });

  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const keyExtractor = item => item && item.id.toString();
  const swiPerRef = useRef(null);
  const { index, data } = useSelector((state: DiscoveryState) => state.discovery);
  const [isHaveAuction, setIsHaveAuction] = useState(false);

  useEffect(() => {
    if (data.length > 0 && index < data.length && data[index]?.auctions.length > 0) {
      const auctions = safeAuction(data[index].auctions);
      setIsHaveAuction(!!validateAuction(auctions.length > 0 ? auctions[0].endAt : ''));
    } else {
      if (isHaveAuction) {
        setIsHaveAuction(false);
      }
    }
  }, [index]);

  const renderNope = () => {
    return (
      <View style={styles.wrapText}>
        <Image source={images.thumbDownPng} style={styles.actionIcon} />
      </View>
    );
  };

  const renderLike = () => {
    return (
      <View style={[styles.wrapText, isHaveAuction ? { borderColor: colors.transparent } : {}]}>
        {isHaveAuction ? renderBid() : <Image source={images.thumbUpPng} style={styles.actionIcon} />}
      </View>
    );
  };

  const renderBid = () => {
    return (
      <View style={styles.bidIconContainer}>
        <Image source={images.thumbBid} style={styles.actionIcon} />
      </View>
    );
  };

  const overlayLabels = {
    left: {
      element: renderNope(),
      style: {
        wrapper: styles.wrapperNope,
      },
    },
    right: {
      element: renderLike(),
      style: {
        wrapper: styles.wrapperLike,
      },
    },
  };

  useEffect(() => {
    const touchSubscribe = touchDiscovery.subscribe(data => {
      setTimeout(() => {
        if (data.type === TouchDiscovery.Back) {
          isSwiping = true;
          swiPerRef.current?.swipeBack(idx => {
            isSwiping = false;
            if (idx === 0) return; // Handled in HomeCarouselCardRevertIcon
            NavigationActionsService.dispatchAction(
              setIndexDiscovery({
                index: idx,
                noReset: true,
              }),
            );
          });
        } else if (data.type === TouchDiscovery.Close) {
          if (!isSwiping) {
            swiPerRef.current?.swipeLeft();
          }
        } else if (data.type === TouchDiscovery.Like) {
          if (!isSwiping) {
            swiPerRef.current?.swipeRight();
          }
        }
      }, TimeChangeDiscovery);
    });

    const bidMaxSubscribe = bidMax.subscribe(data => {
      handleBidMax(data.userId);
    });

    return () => {
      bidMaxSubscribe && bidMaxSubscribe.unsubscribe();
      touchSubscribe && touchSubscribe.unsubscribe();
    };
  }, []);

  const handleBidMax = (userId: string) => {
    dispatch(bidMaxDiscovery({ userId }));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    swiPerRef.current?.jumpToCardIndex(store.getState().discovery.index);
  };

  const renderItem = item => {
    if (!item) return null;
    return <HomeCarouselCard isFromDiscovery data={item} isActive />;
  };

  const onSwiped = idx => {
    const _cardIndex = idx - 1;
    if (_cardIndex > 0 && (_cardIndex === data.length - 4 || _cardIndex === data.length - 12)) {
      const { lat, lng } = userShared.getLocation();
      NavigationActionsService.dispatchAction(
        getDiscovery({
          perPage: LOAD_PROFILE_DISCOVERY,
          filterGlobal: getFilter().global,
          instaUsername: getFilter().instaUsername,
          latitude: lat,
          longitude: lng,
        }),
      );
    }

    NavigationActionsService.dispatchAction(
      setIndexDiscovery({
        index: idx,
        noReset: !!getFilter().instaUsername,
        findProfiles: getFilter().findProfiles,
      }),
    );

    if (data.length === 1) {
      firstProfile.next(false);
    }
  };

  const checkPaymentIssue = () => {
    NavigationActionsService.dispatchAction(
      getTransactionsRequired({
        onSuccess: checkPaymentIssueSuccess,
      }),
    );
  };

  const checkPaymentIssueSuccess = data => {
    if (data && data.length > 0) {
      const { amount, id } = data[0];
      NavigationActionsService.push(MODAL_PAYMENT, { amount, id, isFromPaymentDebt: true });
    } else {
      setModalVisible(true);
    }
  };

  const onSwipedRight = (idx: number) => {
    const _cardIndex = idx === 0 ? data.length - 1 : idx - 1;
    if (_cardIndex < 0) {
      return;
    }
    const userData = data[_cardIndex];
    if (userData && userData.auctions.length > 0 && validateAuction(userData.auctions[0].endAt)) {
      //Check user status: (account has been paused can't not perform this action)
      if (isUserPaused(pauses)) {
        checkPaymentIssue();
        return;
      }
      if (status !== StatusProfile.VERIFIED) {
        getVerify();
        return;
      }

      const auctions = safeAuction(userData.auctions);
      const auctionId = auctions[0].id.toString();
      savePreviousCategoryBidded(auctions[0]);
      SocketManager.instanceBid.joinAuction(auctionId, (_: Auction) => {});
      dispatch(setAuctionIdBidding(auctionId));
      dispatch(setUserProfileId(userData?.id));
      NavigationActionsService.push(PLACE_A_BID);

      return;
    }

    const isLiked = userData.rates?.find(item => item.ratedById === userAuthId)?.score === '1.0';
    dispatch(likeDiscovery({ userId: userData.id, isLiked, userAuthId }));
    onSwiped(idx);
  };

  const onSwipedLeft = (idx: number) => {
    const _cardIndex = idx === 0 ? data.length - 1 : idx - 1;
    if (_cardIndex < 0) {
      return;
    }
    const userData = data[_cardIndex];
    const isLiked = userData.rates?.find(item => item.ratedById === userAuthId)?.score === '1.0';
    dispatch(unlikeDiscovery({ userId: userData.id, isLiked, userAuthId }));
    onSwiped(idx);
  };

  const dragStart = () => {
    shouldSwipe.next({ status: true });
    if (index === 0) {
      firstProfile.next(true);
    }
  };

  const onSwipedAborted = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (store.getState().discovery.data.length === 1) {
      firstProfile.next('final-back');
    } else if (index === 0) {
      firstProfile.next(false);
    }
  };

  const dragEnd = () => {
    shouldSwipe.next({ status: false });
  };

  const onBackdropPress = () => {
    setModalVisible(false);
  };

  const onPressLinkPause = () => {
    onBackdropPress();
    NavigationActionsService.push(PROFILE_SCREEN);
  };

  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <Swiper
          ref={swiPerRef}
          cards={data.concat([])}
          cardIndex={index}
          disableTopSwipe={true}
          disableBottomSwipe={true}
          renderCard={renderItem}
          stackScale={5}
          animateOverlayLabelsOpacity
          dragStart={dragStart}
          dragEnd={dragEnd}
          onSwipedAborted={onSwipedAborted}
          onSwipedRight={onSwipedRight}
          onSwipedLeft={onSwipedLeft}
          keyExtractor={keyExtractor}
          cardStyle={styles.card}
          animateCardOpacity
          infinite={true}
          swipeBackCard
          cardVerticalMargin={0}
          backgroundColor={colors.white}
          stackSize={data.length > 2 ? 5 : data.length}
          goBackToPreviousCardOnSwipeLeft={false}
          overlayLabels={overlayLabels}
          overlayOpacityHorizontalThreshold={screenWidth / 14}
          inputOverlayLabelsOpacityRangeX={[-screenWidth / 8, -screenWidth / 13, 0, screenWidth / 13, screenWidth / 8]}
          inputOverlayLabelsOpacityRangeY={[-screenHeight / 9, -screenHeight / 14, 0, screenHeight / 14, screenHeight / 9]}
          verticalSwipe={false}
          cardHorizontalMargin={0}
          marginTop={Platform.OS === 'android' ? -10 : 0}
          {...customSwiperProps}
        />
      ) : null}
      <CustomConfirmModalHaveLink
        textLinkOne={language('pauseAccountOne')}
        textLinkTwo={language('pauseAccountTwo')}
        textLinkThree={language('pauseAccountThree')}
        onPressLink={onPressLinkPause}
        isButton
        title={language('deleteAccountScreen.alertPausedDesc')}
        onBackdropPress={onBackdropPress}
        isVisible={modalVisible}
      />
    </View>
  );
}

export default memo(HomeCarousel);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    height: '100%',
  },

  wrapperNope: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: 15,
    marginLeft: -30,
    elevation: 10,
  },

  wrapperLike: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 15,
    marginLeft: 30,
    elevation: 10,
  },
  wrapText: {
    backgroundColor: colors.white,
    borderRadius: 50,
    height: vs(60),
    width: vs(60),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blue_700,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  bidIconContainer: {
    width: vs(60),
    height: vs(60),
    borderRadius: 25,
    backgroundColor: colors.white_30p,
    justifyContent: 'center',
  },
  actionIcon: {
    width: vs(36),
    height: vs(36),
    alignSelf: 'center',
  },
});
