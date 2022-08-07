import React, { ReactElement, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, images } from '@/vars';
import CustomButtonIcon from '@/components/CustomButtonIcon';
import { MODAL_PAYMENT, PLACE_A_BID, PROFILE_SCREEN } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import { Auction } from '@/models';
import { TouchDiscovery, touchDiscovery } from '@/shared/global';
import { isUserPaused } from '@/shared/processing';
import { setAuctionIdBidding, setUserProfileId } from '@/redux/placeABid/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import { StatusProfile } from '@/constants/app';
import NavigationActionsService from '@/navigation/navigation';
import { getTransactionsRequired } from '@/redux/payment/actions';
import { getVerify } from '@/shared/discovery';
import { language } from '@/i18n';
import CustomConfirmModalHaveLink from '@/components/CustomModalHaveLink';
import ThumbDownSVG from '@/components/SVG/ThumbDownSVG';
import ThumbUpSVG from '@/components/SVG/ThumbUpSVG';
import { getUserId } from '@/redux/user/selector';
import { DiscoveryRate } from '@/redux/discovery';
import { likeDiscovery, unlikeDiscovery } from '@/redux/discovery/actions';

interface HomeDetailButtonProps {
  profileId?: string;
  isDeepLink?: boolean;
  isFromShareSocial?: boolean;
  auction?: Auction;
  rates?: DiscoveryRate[];
}

export function HomeDetailButton({ profileId, isDeepLink, auction, isFromShareSocial, rates }): ReactElement<HomeDetailButtonProps> {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => {
    return state.user;
  });
  const { pauses, status } = user.data;
  const [modalVisible, setModalVisible] = useState(false);
  const textError = useRef('');

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
      textError.current = language('deleteAccountScreen.alertPausedDesc');
      setModalVisible(true);
    }
  };

  const onBackdropPress = () => {
    setModalVisible(false);
  };

  const onPressLinkPause = () => {
    onBackdropPress();
    NavigationActionsService.push(PROFILE_SCREEN);
  };

  const onPressShow = async () => {
    if (isUserPaused(pauses)) {
      checkPaymentIssue();
      return;
    }
    if (status !== StatusProfile.VERIFIED) {
      getVerify();
      return;
    } else {
      dispatch(setAuctionIdBidding(auction?.id as string));
      dispatch(setUserProfileId(profileId));
      navigation.navigate(PLACE_A_BID);
    }
  };

  const onPressBack = () => {
    if (isDeepLink) {
      navigation.goBack();
      return;
    }

    navigation.goBack();
    if (isFromShareSocial) {
      const isLiked = rates?.find(item => item.ratedById === getUserId())?.score === '1.0';
      dispatch(unlikeDiscovery({ userId: profileId, isLiked, userAuthId: getUserId() }));
      return;
    }

    setTimeout(() => {
      touchDiscovery.next({
        type: TouchDiscovery.Close,
      });
    }, 500);
  };

  const onPressLike = () => {
    if (isDeepLink) {
      navigation.goBack();
      return;
    }
    navigation.goBack();
    if (isFromShareSocial) {
      const isLiked = rates?.find(item => item.ratedById === getUserId())?.score === '1.0';
      if (isLiked) return;
      dispatch(likeDiscovery({ userId: profileId, isLiked, userAuthId: getUserId() }));
      return;
    }

    setTimeout(() => {
      touchDiscovery.next({
        type: TouchDiscovery.Like,
      });
    }, 500);
  };

  return (
    <View style={styles.container}>
      <CustomButtonIcon onPress={onPressBack} containerStyle={styles.btnIcon} icon={<ThumbDownSVG />} />

      {!auction && <CustomButtonIcon onPress={onPressLike} containerStyle={styles.btnIcon} icon={<ThumbUpSVG />} />}

      {!!auction && <CustomButtonIcon onPress={onPressShow} containerStyle={styles.btnIcon} imagesPng={images.thumbBid} />}
      <CustomConfirmModalHaveLink
        textLinkOne={language('pauseAccountOne')}
        textLinkTwo={language('pauseAccountTwo')}
        textLinkThree={language('pauseAccountThree')}
        onPressLink={onPressLinkPause}
        isButton
        title={textError.current}
        onBackdropPress={onBackdropPress}
        isVisible={modalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    bottom: 0,
    paddingHorizontal: 12,
    shadowColor: colors.gray_shadow_beta,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 7,
  },
  btnIcon: {
    marginHorizontal: 12,
  },
});
