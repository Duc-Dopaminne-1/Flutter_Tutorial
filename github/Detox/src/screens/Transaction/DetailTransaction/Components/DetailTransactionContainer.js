import isEmpty from 'lodash/isEmpty';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';

import {PaymentUnit} from '../../../../api/graphql/generated/graphql';
import {BOOKING_STATUS, REQUEST_TYPE, TRANSACTION_MODE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {normal} from '../../../../assets/theme/metric';
import TimeLineList, {TimeLineType} from '../../../../components/List/TimeLineList';
import ScrollViewRefresh from '../../../../components/ScrollViewRefresh';
import {downloadFile} from '../../../../utils/fileHandler';
import {BookingContext} from '../../../BookingDeposit/useBooking';
import {StringeeContext} from '../../../Call/StringeeContext';
import ScreenIds from '../../../ScreenIds';
import BookingInfo from './BookingInfo';
import BottomInfoTransaction, {mapDataToUi} from './BottomInfoTransaction';
import DepositInfo from './DepositInfo';
import {ViewBottom} from './DetailTransactionComponents';
import {DepositType, EndTransactionType, TransactionType} from './DetailTransactionConstant';
import EndTransactionInfo from './EndTransactionInfo';

const styles = StyleSheet.create({
  viewContainer: {
    marginHorizontal: normal,
  },
});

export const getListViews = ({
  data,
  onPressTransfer,
  onPressRefund,
  onPressConfirmDeposit,
  onPressTransferWithoutDeposited,
}) => {
  let typeForBooking = TimeLineType.Done;
  let typeForViewDeposit = TimeLineType.Waiting;
  let typeForViewEndTransaction = TimeLineType.InActive;
  let titleDepositStep = '';
  let titleFinishStep = '';
  let time = '';
  let subTitle = data?.endTransactionTime;
  const transaferDeposit = EndTransactionType.TransferDeposit;
  const endTransactionType = data.endTransactionType;
  switch (data.depositType) {
    case DepositType.Future:
    case DepositType.OpeningDeposit:
      titleDepositStep = translate(STRINGS.WAITING_CONFIRM_DEPOSIT);
      subTitle = data.saleOpenDate;
      break;
    case DepositType.Nothing:
      titleDepositStep =
        endTransactionType === transaferDeposit
          ? translate(STRINGS.TRANSFERRED_CONFIRMED_DEPOSIT)
          : translate(STRINGS.SUCCESS);
      typeForViewDeposit = TimeLineType.Done;
      typeForViewEndTransaction =
        endTransactionType === transaferDeposit ? TimeLineType.InActive : TimeLineType.Done;
      time = endTransactionType === transaferDeposit ? '' : data.endTransactionTime;
      titleFinishStep = endTransactionType === transaferDeposit ? '' : translate(STRINGS.COMPLETED);
      break;
    case DepositType.Deposited:
      typeForViewDeposit = TimeLineType.Done;
      typeForViewEndTransaction =
        endTransactionType !== TimeLineType.InActive ? TimeLineType.Done : TimeLineType.InActive;
      titleFinishStep = translate(STRINGS.COMPLETED);
      titleDepositStep = translate(STRINGS.SUCCESS);
      time = data.endTransactionTime;
      subTitle = data.depositInfoTime;
      break;
    case DepositType.DepositTransfer:
      // đỏi thống nhất trong thời gian mở bán: "Đã chuyển quyền tham gia đặt cọc"
      titleDepositStep = translate(STRINGS.TRANSFERRED_CONFIRMED_DEPOSIT);
      typeForViewDeposit = TimeLineType.Done;
      break;
    case DepositType.BookDeposited:
    case DepositType.RefundRequest:
      if (data?.isCancelled && data.depositType === DepositType.RefundRequest) {
        typeForBooking = TimeLineType.Fail;
      }
      titleDepositStep = translate(STRINGS.CONFIRMED_DEPOSITED_END);
      typeForViewDeposit = TimeLineType.Fail;
      typeForViewEndTransaction = data.ableRequestRefund
        ? TimeLineType.InActive
        : TimeLineType.Waiting;
      titleFinishStep = data.ableRequestRefund
        ? ''
        : translate(STRINGS.SENT_BOOKING_REFUND_REQUEST);
      break;
    case DepositType.DepositEnded:
      titleDepositStep = [
        `${BOOKING_STATUS.BOOKING_COMPLETED},${BOOKING_STATUS.WAITING_DEPOSIT}`,
      ].includes(data.transactionStatus)
        ? translate('transaction.detail.previousConfirmedDeposit')
        : translate(STRINGS.CONFIRMED_DEPOSITED_END);
      typeForViewDeposit = TimeLineType.Fail;
      typeForViewEndTransaction = TimeLineType.InActive;
      subTitle = data.isCurrentSaleSeason ? data.depositInfoTime : '';
      break;
    case DepositType.Refunded:
      if (data?.isCancelled) {
        typeForBooking = TimeLineType.Fail;
      }
      titleDepositStep = translate(STRINGS.CONFIRMED_DEPOSITED_END);
      typeForViewDeposit = TimeLineType.Fail;
      typeForViewEndTransaction = TimeLineType.Done;
      titleFinishStep = translate(STRINGS.REFUNDED_BOOKING_MONEY);
      break;
    case DepositType.Waiting:
      titleDepositStep = translate(STRINGS.WAITING_CONFIRM_DEPOSIT);
      typeForViewDeposit = TimeLineType.Waiting;
      typeForViewEndTransaction = TimeLineType.InActive;
      subTitle = data.beginDepositeDatetime;
      break;
    case DepositType.WaitingPayment:
      typeForBooking = TimeLineType.Waiting;
      typeForViewDeposit = TimeLineType.InActive;
      time = '';
      subTitle = '';
      break;
    case DepositType.Cancelled:
      typeForBooking = TimeLineType.Fail;
      typeForViewDeposit = TimeLineType.InActive;
      time = '';
      subTitle = '';
      break;
    case DepositType.WaitingPaymentDeposit:
      typeForViewDeposit = TimeLineType.Waiting;
      titleDepositStep = translate('payment.status.waitingForPay');
      break;
    case DepositType.CancelledDeposit:
    case DepositType.RefundRequestDeposit:
    case DepositType.RefundedDeposit:
      typeForViewDeposit = TimeLineType.Fail;
      titleDepositStep = translate('payment.status.expired');
      subTitle = data?.cancelledSeason;
      if (data.depositType === DepositType.RefundRequestDeposit) {
        typeForViewEndTransaction = TimeLineType.Waiting;
        titleFinishStep = translate(STRINGS.SENT_BOOKING_REFUND_REQUEST);
      } else if (data.depositType === DepositType.RefundedDeposit) {
        typeForViewEndTransaction = TimeLineType.Done;
        titleFinishStep = translate(STRINGS.REFUNDED_BOOKING_MONEY);
      }
      break;
    default:
      break;
  }

  return [
    {
      stepName: translate(STRINGS.BOOKING),
      type: typeForBooking,
      view: <BookingInfo data={data} onPressRefund={onPressRefund} />,
    },
    {
      stepName: 'Quyền tham gia đặt cọc',
      type: typeForViewDeposit,
      view: (
        <DepositInfo
          data={data}
          titleDepositStep={titleDepositStep}
          onPressTransfer={onPressTransfer}
          subTitle={subTitle}
          onPressRefund={onPressRefund}
          onPressConfirmDeposit={onPressConfirmDeposit}
          onPressTransferWithoutDeposite={onPressTransferWithoutDeposited}
        />
      ),
    },
    {
      stepName: translate(STRINGS.COMPLETED),
      type: typeForViewEndTransaction,
      hideLine: true,
      view: (
        <EndTransactionInfo
          data={data}
          time={time}
          titleFinishStep={
            typeForViewEndTransaction === TimeLineType.InActive ? '' : titleFinishStep
          }
          onPressTransfer={onPressTransfer}
        />
      ),
    },
  ];
};

const getDataTransfer = data => {
  const rawData = data?.rawData;
  if (!rawData) {
    return {project: {}, other: {}};
  }
  const propertyPostInfo = rawData?.propertyPostInfo;
  const projectInfo = propertyPostInfo?.projectInfo;
  const saleSeasonInfo = propertyPostInfo.saleSeasonInfo;
  const projectStatus = TRANSACTION_MODE.MOVE_DEPOSIT;
  const project = {
    ...projectInfo,
    saleSeasonInfo,
    projectStatus,
  };
  const originTransaction = {
    bookingTransactionId: rawData.bookingTransactionId,
    depositeTransactionId: rawData.depositeTransactionId,
    saleAgentInfo: rawData?.saleAgentInfo,
    customerInfo: rawData?.customerInfo,
    propertyPost: propertyPostInfo,
  };
  const other = {
    saleSeasonId: saleSeasonInfo.saleSeasonId,
    originTransaction,
  };
  return {project, other};
};

export const getDataToConfirmDeposit = data => {
  return {
    projectName: data?.projectName,
    transactionAmount: data?.transactionAmount,
    price: data?.price,
    propertyCode: data?.propertyCode,
    floor: data?.floor,
    block: data?.blockName,
    consultantId: data?.rawData?.consultantInfo?.staffId,
    consultantName: data?.rawData?.consultantInfo?.fullName,
    propertyTypeName: data?.propertyTypeName,
    consultantAvatar: data?.rawData?.consultantInfo?.profilePhoto,
    propertyPostId: data?.rawData?.propertyPostInfo?.propertyPostId,
    bookingTransactionInfo: {bookingTransactionId: data?.rawData?.bookingTransactionId},
    customerInfo: data?.customerInfo,
  };
};

const DetailTransactionContainer = ({
  data,
  transactionId,
  transactionType,
  paymentInfo,
  onRefreshGetDetail,
  loading,
  navigation,
}) => {
  const {setStateMoveDeposit, setPropertyPost} = useContext(BookingContext);
  const {callUser, chatUser} = useContext(StringeeContext);

  const onPressTransfer = () => {
    const {project, other} = getDataTransfer(data);
    const rawData = data.rawData;
    setStateMoveDeposit({project, other});
    navigation.navigate(ScreenIds.SlotSelection, {
      feeAmount: rawData?.transactionAmount,
      projectName: project?.projectName,
      projectStatusDescription: '',
      buyerId: rawData?.customerInfo?.customerId,
      propertyTypeId: rawData?.propertyPostInfo?.propertyTypeId,
      saleSeasonInfo: rawData?.propertyPostInfo.saleSeasonInfo,
      projectTypeName: rawData?.propertyPostInfo?.propertyTypeName,
      consultantInfo: rawData?.consultantInfo,
    });
  };

  const onPressRefund = () => {
    const rawData = data.rawData;

    // set quầy đã thanh toán tiền mặt
    const fundAccount =
      paymentInfo?.paymentUnit === PaymentUnit.Fast ? paymentInfo?.fundAccount : null;
    navigation.navigate(ScreenIds.RefundScreen, {
      propertyPostId: rawData?.propertyPostInfo?.propertyPostId,
      paidAmount: rawData?.paidAmount,
      transactionCode: rawData?.bookingCode ? rawData?.bookingCode : rawData?.depositeCode,
      projectName: rawData?.propertyPostInfo?.projectInfo?.projectName,
      propertyCode: rawData?.propertyPostInfo?.propertyCode,
      customerInfo: rawData?.customerInfo,
      requestType: REQUEST_TYPE.REFUND,
      transactionIndex: data?.transactionIndex,
      paymentUnit: paymentInfo?.paymentUnit,
      transactionType: rawData?.transactionType,
      fundAccount: fundAccount,
    });
  };

  const onPressConfirmDeposit = () => {
    navigation.navigate(ScreenIds.ConfirmDepositScreen, {
      transactionInfo: getDataToConfirmDeposit(data),
    });
  };

  const onPressDetailAgent = () => {
    const agentId = data?.rawData?.saleAgentInfo?.agentId;
    agentId && navigation.navigate(ScreenIds.AgentManagement, {agentId});
  };

  const dataInfo = mapDataToUi({data, paymentInfo});
  const onPressProjectDetail = () => {
    navigation.navigate(ScreenIds.ProjectDetail, {projectId: data?.projectId, shouldRefresh: true});
  };

  const onPressDocument = () => {
    const url = data?.rawData?.documentUrl;
    downloadFile({
      fileName: 'BienBanXacNhan',
      fileUrl: url,
    });
  };

  const onPressUpdateProfile = () => {
    const rawData = data.rawData;
    const {propertyPostInfo, consultantInfo, customerInfo, depositeTransactionId} = rawData;
    const propertyPost = {
      propertyTypeName: propertyPostInfo?.propertyTypeName,
      projectName: propertyPostInfo?.projectInfo?.projectName,
      projectCode: propertyPostInfo?.propertyCode,
      floor: propertyPostInfo.floor,
      blockName: propertyPostInfo?.blockName,
    };
    const consultant = {
      profilePhoto: consultantInfo?.profilePhoto,
      name: consultantInfo?.fullName,
      staffId: consultantInfo?.staffId,
    };
    setPropertyPost(propertyPost);
    navigation.navigate(ScreenIds.ConfirmTransaction, {
      isUpdateInfo: true,
      customerInfo: customerInfo,
      depositeTransactionId: depositeTransactionId,
      consultantInfo: consultant,
    });
  };

  const isShowBottomView = data.hasCustomerInfoChangeHistory || data.allowUpdateCustomer;

  const onPressButtonHistoryUpdateInfo = () => {
    navigation.navigate(ScreenIds.ListHistoryUpdateInfoScreen, {
      id: data.rawData.depositeTransactionId,
    });
  };

  const onPressCallConsultant = () => {
    onPressCallOrChatConsultant(true);
  };

  const onPressChatConsultant = () => {
    onPressCallOrChatConsultant(false);
  };

  const onPressCallOrChatConsultant = isCall => {
    const consultantInfo = data.rawData?.consultantInfo;
    const phoneNumber = consultantInfo?.phoneNumber;
    if (phoneNumber) {
      if (isCall) {
        callUser(phoneNumber, {
          fullName: consultantInfo?.fullName,
          avatar: consultantInfo?.profilePhoto,
          objectId: transactionId,
          objectType: `fo-transaction-b2c-${
            transactionType === TransactionType.Booking ? 'booking' : 'deposit'
          }`,
        });
      } else {
        chatUser(phoneNumber, consultantInfo?.fullName, navigation);
      }
    }
  };

  return (
    <>
      <ScrollViewRefresh
        loading={loading}
        showCenterText={isEmpty(data)}
        onRefresh={onRefreshGetDetail}>
        <TimeLineList
          style={styles.viewContainer}
          views={getListViews({
            data,
            onPressDetailAgent,
            onPressTransfer,
            onPressRefund,
            onPressConfirmDeposit,
          })}
        />
        <BottomInfoTransaction
          onPressProjectDetail={onPressProjectDetail}
          {...dataInfo}
          documentName={data?.rawData?.documentName}
          onPressDocument={onPressDocument}
          onPressCallConsultant={onPressCallConsultant}
          onPressChatConsultant={onPressChatConsultant}
          navigation={navigation}
        />
      </ScrollViewRefresh>
      {isShowBottomView && (
        <ViewBottom
          onPressHistory={onPressButtonHistoryUpdateInfo}
          data={data}
          onPressUpdate={onPressUpdateProfile}
        />
      )}
    </>
  );
};

export default DetailTransactionContainer;
