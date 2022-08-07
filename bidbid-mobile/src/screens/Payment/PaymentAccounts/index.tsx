import React, { ReactElement, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPayment } from '@/redux/payment/actions';
import { PaymentAccountsDefault } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsDefault/PaymentAccountsDefault';
import { PaymentInit } from '@/redux/payment/reducer';
import CustomButton from '@/components/CustomButton';
import { ReceivedAccountsDefault } from '@/screens/Payment/PaymentAccounts/component/ReceivedAccountsDefault';
import { PaymentAccountsCreditCards } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsCreditCards';
import { PaymentAccountsPayPals } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsPayPals';
import DefaultText from '@/components/CustomText/DefaultText';
import { CustomLine } from '@/components/CustomeLine';
import Modal from 'react-native-modal';
import { PaymentAccountsAddPayment } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsAddPayment/PaymentAccountsSelectMethod';
import { isIphoneX } from '@/shared/devices';
import NavigationActionsService from '@/navigation/navigation';
import { useRoute } from '@react-navigation/native';
import { UserInit } from '@/redux/user/reducer';
import CustomConfirmModal from '@/components/CustomModal';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import IconBack from '@/components/SVG/BackSvg';
import IconCardEmptySVG from '@/components/SVG/IconCardEmptySVG';

export function PaymentAccountsScreen(): ReactElement {
  const dispatch = useDispatch();

  const params: any = useRoute().params ? useRoute().params : { isFromModalAuctionDetailCardFailed: false, onBack: () => {} };
  const { isFromModalAuctionDetailCardFailed, onBack } = params;
  const payments = useSelector((state: PaymentInit) => state.payment.data);
  const { paymentMethodId, payoutMethodId } = useSelector((state: UserInit) => state.user.data);
  const [isShowModal, setIsShowModal] = useState(false);
  const [shouldShowModalRemind, setShouldShowModalRemind] = useState(false);

  useFocusEffect(() => {
    const onBackPress = () => {
      onBackIcon();
      return false;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  });

  useEffect(() => {
    dispatch(getAllPayment({}));
  }, []);

  const renderPayment = () => {
    return (
      <ScrollView style={styles.scroll}>
        <PaymentAccountsDefault />
        <ReceivedAccountsDefault />
        <CustomLine lineStyle={styles.divider} />
        <PaymentAccountsCreditCards />
        <PaymentAccountsPayPals />
      </ScrollView>
    );
  };

  const renderPaymentEmpty = () => {
    return (
      <View style={styles.wrapEmpty}>
        <IconCardEmptySVG />
        <DefaultText style={styles.txtEmpty}>{language('emptyCard')}</DefaultText>
      </View>
    );
  };

  const onPressCreate = () => {
    setIsShowModal(true);
  };

  const renderButtonCreate = () => {
    return (
      <CustomButton
        onPress={onPressCreate}
        wrapBtn={styles.wrapBtn}
        containerStyle={styles.btnContinue}
        text={`${language('addPaymentAccount')}`}
      />
    );
  };

  const onPressOut = () => {
    setIsShowModal(false);
  };

  const onPressYes = () => {
    setShouldShowModalRemind(false);
    NavigationActionsService.goBack();
  };

  const onPressNo = () => {
    setShouldShowModalRemind(false);
  };

  const onBackIcon = () => {
    if (isFromModalAuctionDetailCardFailed) {
      onBack && onBack();
    }

    if (!paymentMethodId || !payoutMethodId) {
      setShouldShowModalRemind(true);
      return;
    }
    NavigationActionsService.goBack();
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} goBack={onBackIcon} title={language('paymentAccounts')} />
      {payments.length > 0 ? renderPayment() : renderPaymentEmpty()}
      {renderButtonCreate()}
      <Modal
        animationOutTiming={500}
        isVisible={isShowModal}
        style={styles.modal}
        customBackdrop={
          <TouchableWithoutFeedback onPress={onPressOut}>
            <View style={styles.wrapOutModal} />
          </TouchableWithoutFeedback>
        }
        useNativeDriver
      >
        <PaymentAccountsAddPayment onPressOut={onPressOut} />
      </Modal>
      <CustomConfirmModal
        isBlockPressOut
        isVisible={shouldShowModalRemind}
        title={language('remindPayment')}
        textBtnConfirm={language('no')}
        textBtnCancel={language('yes')}
        onBackdropPress={onPressYes}
        onConfirmPress={onPressNo}
        titleStyle={styles.titleRemind}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    paddingVertical: 20,
  },
  btnContinue: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '90%',
    height: null,
    minHeight: null,
    marginTop: 10,
    marginBottom: isIphoneX() ? 40 : 25,
  },
  wrapBtn: {
    flex: null,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtEmpty: {
    color: colors.gray_900,
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
  },
  modal: {
    marginHorizontal: 0,
    justifyContent: 'flex-end',
    marginVertical: 0,
  },
  wrapEmpty: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 40,
  },
  divider: {
    height: 8,
    width: '100%',
    backgroundColor: colors.gray_light,
  },
  wrapOutModal: {
    flex: 1,
    backgroundColor: colors.gray_900,
  },
  titleRemind: {
    color: colors.gray_900,
    fontSize: fonts.size.s15,
  },
});
