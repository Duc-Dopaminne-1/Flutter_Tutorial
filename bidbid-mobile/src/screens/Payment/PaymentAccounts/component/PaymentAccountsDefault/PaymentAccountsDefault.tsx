import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PaymentInit } from '@/redux/payment/reducer';
import { UserInit } from '@/redux/user/reducer';
import { colors, screenWidth } from '@/vars';
import { PaymentAccountsDefaultItem } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsDefault/PaymentAccountsDefaultItem';
import { PaymentAccountsTitle } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsTitle';
import { PaymentAccountsModalContext } from '@/screens/Payment/PaymentAccounts/PaymentAccountsContext';
import Modal from 'react-native-modal';
import { PaymentAccountsDefaultEdit } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsDefaultEdit/PaymentAccountsDefaultEdit';
import { language } from '@/i18n';
import { setPaymentDefault } from '@/redux/payment/actions';
import { CustomLine } from '@/components/CustomeLine';

let selectedId = -1;

export function PaymentAccountsDefault(): ReactElement {
  const payments = useSelector((state: PaymentInit) => state.payment.data);
  const paymentDefaultId = useSelector((state: UserInit) => state.user.data.paymentMethodId);
  const listPayment = payments.filter(item => item.id === paymentDefaultId);
  const [isShowModal, setIsShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    selectedId = paymentDefaultId;
  }, [paymentDefaultId]);

  const onPressModal = () => {
    setIsShowModal(true);
  };

  const onPressOut = () => {
    if (paymentDefaultId !== selectedId) {
      dispatch(
        setPaymentDefault({
          id: selectedId,
        }),
      );
    }

    setIsShowModal(false);
  };

  const onSelectedItem = (itemId: number) => {
    selectedId = itemId;
  };

  return (
    <PaymentAccountsModalContext.Provider
      value={{
        onSelectedItem: onSelectedItem,
      }}
    >
      <View style={styles.container}>
        <PaymentAccountsTitle
          onPress={onPressModal}
          subTitle={language('edit')}
          container={styles.wrapHeader}
          title={language('defaultPayment')}
        />
        <PaymentAccountsDefaultItem listPayment={listPayment} />
        <CustomLine lineStyle={styles.wrapLine} />
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
          <PaymentAccountsDefaultEdit paymentDefaultId={paymentDefaultId} payments={payments} onPressOut={onPressOut} />
        </Modal>
      </View>
    </PaymentAccountsModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  wrapHeader: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modal: {
    marginHorizontal: 0,
    justifyContent: 'flex-end',
    marginVertical: 0,
  },
  wrapOutModal: {
    flex: 1,
    backgroundColor: colors.gray_900,
  },
  wrapLine: {
    width: screenWidth - 25,
    alignSelf: 'center',
  },
});
