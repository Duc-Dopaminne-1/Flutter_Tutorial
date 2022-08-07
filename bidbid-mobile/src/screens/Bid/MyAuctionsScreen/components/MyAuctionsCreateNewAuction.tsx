import React, { ReactElement, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import { useNavigation } from '@react-navigation/native';
import { CREATE_AUCTION_NORMAL_SCREEN, MODAL_PAYMENT, PAYMENT_ACCOUNTS_SCREEN, PROFILE_SCREEN } from '@/navigation/screenKeys';
import { useSelector } from 'react-redux';
import { alertError } from '@/shared/alert';
import { UserInit } from '@/redux/user/reducer';
import { AppInit } from '@/redux/app/reducer';
import Modal from 'react-native-modal';
import NavigationActionsService from '@/navigation/navigation';
import MyAuctionCreateModal from '@/screens/Bid/MyAuctionsScreen/components/MyAuctionCreateModal';
import { isUserPaused } from '@/shared/processing';
import { getUser } from '@/redux/user/actions';
import { StatusProfile } from '@/constants/app';
import Spinner from '@/components/Spinner';
import { getTransactionsRequired } from '@/redux/payment/actions';
import { getVerify } from '@/shared/discovery';
import CustomConfirmModalHaveLink from '@/components/CustomModalHaveLink';

export default function MyAuctionsCreateNewAuction(): ReactElement {
  const navigation = useNavigation();
  const user = useSelector((state: UserInit) => state.user.data);
  const settingApp = useSelector((state: AppInit) => state.app.setting);
  const { paymentMethodId, payoutMethodId, likes } = user;
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const textError = useRef('');

  const setShowDate = () => {
    setShowPicker(true);
  };

  const onBackdropPress = () => {
    setShowPicker(false);
  };

  const onBackdropPressPause = () => {
    setModalVisible(false);
  };

  const checkValidPayment = (): boolean => {
    return !(!paymentMethodId || paymentMethodId === 0 || !payoutMethodId || payoutMethodId === 0);
  };

  const handleResult = result => {
    if (isUserPaused(result.pauses)) {
      textError.current = language('deleteAccountScreen.alertPausedDesc');
      setModalVisible(true);
      return;
    }
    if (result.status !== StatusProfile.VERIFIED) {
      getVerify();
      return;
    }
    if (!checkValidPayment()) {
      setShowDate();
      return;
    } else {
      if (likes < settingApp.MINIMUM_CONDITION_LIKES) {
        alertError(language('needLikeAuction', { like: settingApp.MINIMUM_CONDITION_LIKES }));
        return;
      }
      navigation.navigate(CREATE_AUCTION_NORMAL_SCREEN);
    }
  };

  const checkPaymentIssue = data => {
    if (data && data.length > 0) {
      const { amount, id } = data[0];
      setIsLoading(false);
      setTimeout(() => {
        NavigationActionsService.push(MODAL_PAYMENT, { amount, id, isFromCreateMyAuction: true });
      }, 400);
    } else {
      validUserToCreateAuction();
    }
  };

  const onCreate = () => {
    setIsLoading(true);
    NavigationActionsService.dispatchAction(
      getTransactionsRequired({
        onSuccess: checkPaymentIssue,
      }),
    );
  };

  const onPressLinkPause = () => {
    onBackdropPressPause();
    NavigationActionsService.push(PROFILE_SCREEN);
  };

  const validUserToCreateAuction = () => {
    NavigationActionsService.dispatchAction(
      getUser({
        onSuccess: result => {
          setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => {
              handleResult(result);
            }, 300);
          }, 500);
        },
        onFail: () => {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        },
      }),
    );
  };

  const onPressLink = () => {
    onBackdropPress();
    NavigationActionsService.push(PAYMENT_ACCOUNTS_SCREEN);
  };

  return (
    <View style={styles.container}>
      <Spinner loading={isLoading} />
      <CustomButton
        onPress={onCreate}
        textStyle={styles.textBtnCreate}
        containerStyle={styles.btnCreate}
        text={language('createAuction')}
      />
      <Modal onBackdropPress={onBackdropPress} onBackButtonPress={onBackdropPress} isVisible={showPicker}>
        <MyAuctionCreateModal onBackdropPress={onBackdropPress} onPressLink={onPressLink} />
      </Modal>
      <CustomConfirmModalHaveLink
        textLinkOne={language('pauseAccountOne')}
        textLinkTwo={language('pauseAccountTwo')}
        textLinkThree={language('pauseAccountThree')}
        onPressLink={onPressLinkPause}
        isButton
        title={textError.current}
        onBackdropPress={onBackdropPressPause}
        isVisible={modalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  btnCreate: {
    alignSelf: 'center',
    backgroundColor: colors.red_700,
    marginTop: 5,
    paddingVertical: 12,
  },
  textBtnCreate: {
    color: colors.white,
    fontSize: fonts.size.s17,
    fontWeight: '700',
    fontFamily: fonts.family.PoppinsBold,
  },
});
