import React, { ReactElement, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle, TextStyle, Text } from 'react-native';
import { MODAL_PAYMENT, PLACE_A_BID, PROFILE_SCREEN } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { setAuctionIdBidding, setUserProfileId } from '@/redux/placeABid/actions';
import { useDispatch, useSelector } from 'react-redux';
import { isUserPaused } from '@/shared/processing';
import { RootState } from '@/redux/reducers';
import { StatusProfile } from '@/constants/app';
import NavigationActionsService from '@/navigation/navigation';
import { getTransactionsRequired } from '@/redux/payment/actions';
import { getVerify } from '@/shared/discovery';
import CustomConfirmModalHaveLink from '@/components/CustomModalHaveLink';
import { Auction } from '@/models';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { savePreviousCategoryBidded } from '@/shared/placeABid';

interface HomeDetailBidNowButtonProps {
  profileId: string;
  auction: Auction;
  isRaffleAuction?: boolean;
}

function HomeDetailBidNowButton({ profileId, auction, isRaffleAuction }): ReactElement<HomeDetailBidNowButtonProps> {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const titleBtn = language(isRaffleAuction ? 'purchaseTicket' : 'profileBidee.bidNow');
  const { user } = useSelector((state: RootState) => {
    return state;
  });
  const [modalVisible, setModalVisible] = useState(false);
  const { pauses, status } = user.data;
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

  const bidNowOnPressed = () => {
    if (isUserPaused(pauses)) {
      checkPaymentIssue();
      return;
    }
    if (status !== StatusProfile.VERIFIED) {
      getVerify();
      return;
    }
    if (auction) {
      savePreviousCategoryBidded(auction);
      dispatch(setAuctionIdBidding(auction.id));
      dispatch(setUserProfileId(profileId));
      navigation.navigate(PLACE_A_BID, { isFromHomeDetail: true });
    }
  };

  const onBackdropPress = () => {
    setModalVisible(false);
  };

  const onPressLinkPause = () => {
    onBackdropPress();
    NavigationActionsService.push(PROFILE_SCREEN);
  };

  return (
    <View style={[styles.container, { paddingBottom: 20 - insets.bottom }]}>
      <TouchableOpacity style={styles.bidNowButton} onPress={bidNowOnPressed}>
        <Text style={styles.bidNowText}>{titleBtn}</Text>
      </TouchableOpacity>
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

export default React.memo(HomeDetailBidNowButton);

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  } as ViewStyle,

  bidNowButton: {
    height: 48,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.red_700,
  } as ViewStyle,
  bidNowText: {
    color: colors.white,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
    alignItems: 'center',
  } as TextStyle,
});
