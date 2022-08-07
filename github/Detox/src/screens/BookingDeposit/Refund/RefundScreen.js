import {useNavigation} from '@react-navigation/native';
import React, {useContext, useRef, useState} from 'react';
import {Image, Keyboard, StyleSheet, View} from 'react-native';

import {useCreateRefundRequestMutation} from '../../../api/graphql/generated/graphql';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {CONSTANTS} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {medium, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import ModalPopup from '../../../components/Modal/ModalPopup';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import RequestForm from '../../../components/RequestForm';
import TransactionInfo from '../../../components/TransactionInfo';
import ArrayUtils from '../../../utils/ArrayUtils';
import PostSuccessScreen from '../../ManagePost/PostSuccess/PostSuccessScreen';
import {TransactionType} from '../../Transaction/DetailTransaction/Components/DetailTransactionConstant';
import PaymentMethodModalContainer from '../Confirm/Components/PaymentMethodModalContainer';
import {customListTopenLandOffices} from '../Confirm/PaymentModels';
import {BookingContext} from '../useBooking';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconModalStyle: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginVertical: medium,
  },
  containerModalStyle: {
    marginTop: normal,
  },
  contentContainerStyle: {},
});

export const RefundContainer = ({
  propertyCode,
  paidAmount,
  requestType,
  propertyPostId,
  onSubmitSuccess,
  customerInfo,
  transactionCode,
  projectName,
  transactionIndex,
  paymentUnit,
  onShowPopup = () => {},
  extRefundInfo,
}) => {
  return (
    <View style={styles.container}>
      <RequestForm
        requestType={requestType}
        propertyPostId={propertyPostId}
        onSubmitSuccess={onSubmitSuccess}
        defaultSelectValue={CONSTANTS.REFUND_DEPOSITE}
        disabledSelect={true}
        isEditable={false}
        queryLazy={useCreateRefundRequestMutation}
        paymentUnit={paymentUnit}
        onChosenTopenLandOffice={onShowPopup}
        extRefundInfo={extRefundInfo}
        user={{
          email: customerInfo.customerEmail,
          phoneNumber: customerInfo.customerPhone,
          firstName: customerInfo.customerFirstName,
          lastName: customerInfo.customerLastName,
        }}>
        <TransactionInfo
          transactionIndex={transactionIndex}
          projectName={projectName}
          amount={paidAmount}
          transactionCode={transactionCode}
          code={propertyCode}
          paymentUnit={paymentUnit}
        />
      </RequestForm>
    </View>
  );
};

const customBankList = (bankList: Array) => {
  if (ArrayUtils.hasArrayData(bankList)) {
    return bankList.map(e => ({...e, bankName: `${e.bankName} (${e.bankCode})`}));
  }
  return [];
};

const RefundScreen = ({route}) => {
  const {
    propertyPostId,
    projectName,
    paidAmount,
    transactionCode,
    propertyCode,
    customerInfo,
    requestType,
    transactionIndex,
    paymentUnit,
    transactionType,
    fundAccount,
  } = route?.params || {};

  const navigation = useNavigation();
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const [state, setState] = useState({
    selectedOffice: null,
    topenLandOffices: customListTopenLandOffices(masterData?.fundAccounts?.edges ?? [], 'cityId'),
    banks: customBankList(masterData.banks?.edges),
    cities: masterData?.cities?.edges ?? [],
    isBooking: transactionType === TransactionType.Booking,
    fundAccount: fundAccount, // quầy thanh toán tiền mặt
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState();
  const {sendNotifyNewTransaction} = useContext(BookingContext);
  const modalRef = useRef(null);

  const onSubmitSuccess = () => {
    setShowSuccessPopup(true);
    sendNotifyNewTransaction();
  };

  const onCloseModal = () => {
    setShowSuccessPopup(false);
    navigation.goBack();
  };

  const onShowPopup = () => {
    modalRef?.current?.open();
    Keyboard.dismiss();
  };

  const onChosenTopenLandOffice = newList => {
    if (ArrayUtils.hasArrayData(newList)) {
      const selectedItem = newList.find(item => item?.checked === true);
      setState({...state, topenLandOffices: newList, selectedOffice: selectedItem});
    } else {
      setState({...state, topenLandOffices: newList});
    }
    modalRef?.current?.close();
  };

  const modals = (
    <ModalWithModalize getModalRef={modalRef}>
      <PaymentMethodModalContainer
        title={translate('transaction.pleaseSelectOffice')}
        state={state}
        onChosenTopenLandOffice={onChosenTopenLandOffice}
      />
    </ModalWithModalize>
  );

  return (
    <BaseScreen title={translate(STRINGS.REFUND_REQUEST)} showHeaderShadow modals={modals}>
      <RefundContainer
        transactionIndex={transactionIndex}
        propertyCode={propertyCode}
        paidAmount={paidAmount}
        requestType={requestType}
        propertyPostId={propertyPostId}
        onSubmitSuccess={onSubmitSuccess}
        customerInfo={customerInfo}
        transactionCode={transactionCode}
        projectName={projectName}
        paymentUnit={paymentUnit}
        onShowPopup={onShowPopup}
        extRefundInfo={state}
      />
      {showSuccessPopup && (
        <ModalPopup visible={showSuccessPopup} animationType="slide">
          <PostSuccessScreen
            onPressDismiss={() => setShowSuccessPopup(false)}
            onReviewPost={onCloseModal}
            icon={<Image source={IMAGES.IC_LETTER_SUCCESS} style={styles.iconModalStyle} />}
            title={translate(STRINGS.REFUND_THANK_YOU)}
            titleStyle={styles.titleModalStyle}
            description={translate(STRINGS.REFUND_THANK_YOU_DES)}
            buttonReviewPostTitle={translate(STRINGS.RETURN_TRANSACTION)}
            descriptionStyle={styles.descriptionModalStyle}
            hideReturnHomeButton={true}
            buttonNextStyle={commonStyles.buttonOutline}
            buttonNextTextStyle={commonStyles.buttonOutlineText}
            containerStyle={styles.containerModalStyle}
            contentContainerStyle={styles.contentContainerStyle}
            onClose={onCloseModal}
          />
        </ModalPopup>
      )}
    </BaseScreen>
  );
};

export default RefundScreen;
