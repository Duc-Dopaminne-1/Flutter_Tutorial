import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PaymentInit } from '@/redux/payment/reducer';
import { UserInit } from '@/redux/user/reducer';
import { colors } from '@/vars';
import { PaymentAccountsDefaultItem } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsDefault/PaymentAccountsDefaultItem';
import { PaymentAccountsTitle } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsTitle';
import { PaymentReceivedAccountsContext } from '@/screens/Payment/PaymentAccounts/PaymentReceivedAccountsContext';
import Modal from 'react-native-modal';
import { PaymentAccountsDefaultEdit } from '@/screens/Payment/PaymentAccounts/component/PaymentAccountsDefaultEdit/PaymentAccountsDefaultEdit';
import { language } from '@/i18n';
import { setReceivedDefault } from '@/redux/payment/actions';
import { alertError } from '@/shared/alert';
import { RulePayment } from '@/constants/app';

let selectedId = -1;

export function ReceivedAccountsDefault(): ReactElement {
  const payments = useSelector((state: PaymentInit) => state.payment.data);
  const payoutDefaultMethodId = useSelector((state: UserInit) => state.user.data.payoutMethodId);
  const accountReceived = payments.filter(item => item.id === payoutDefaultMethodId);
  const [isShowModal, setIsShowModal] = useState(false);
  const listPayments = payments.filter(item => item.type !== RulePayment.Card);

  const dispatch = useDispatch();

  useEffect(() => {
    selectedId = payoutDefaultMethodId;
  }, [payoutDefaultMethodId]);

  const onPressModal = () => {
    setIsShowModal(true);
  };

  const onPressOut = () => {
    if (payoutDefaultMethodId !== selectedId) {
      dispatch(
        setReceivedDefault({
          id: selectedId,
          onFail: error => {
            setIsShowModal(false);
            setTimeout(() => {
              alertError(error, language('error'), null);
            }, 700);
            return;
          },
        }),
      );
    }
    setIsShowModal(false);
  };

  const onSelectedItem = (itemId: number) => {
    selectedId = itemId;
  };

  return (
    <PaymentReceivedAccountsContext.Provider
      value={{
        onSelectedItemReceived: onSelectedItem,
      }}
    >
      <View style={styles.container}>
        <PaymentAccountsTitle
          onPress={onPressModal}
          subTitle={language('edit')}
          container={styles.wrapHeader}
          title={language('defaultReceivedAccount')}
        />
        <PaymentAccountsDefaultItem listPayment={accountReceived} />
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
          <PaymentAccountsDefaultEdit
            isFromDefaultReceived
            paymentDefaultId={payoutDefaultMethodId}
            payments={listPayments}
            onPressOut={onPressOut}
          />
        </Modal>
      </View>
    </PaymentReceivedAccountsContext.Provider>
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
    backgroundColor: colors.black,
  },
});
