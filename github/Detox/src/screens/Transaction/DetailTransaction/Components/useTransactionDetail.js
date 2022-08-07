import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import {useRef, useState} from 'react';

import {
  GetCustomerByIdQueryVariables,
  GetSimpleTransactionDetailResponse,
  GetTransactionValidatePaymentResponse,
  PaymentUnit,
  SimpleTransactionDetailInput,
  TransactionCancelReason,
  TransactionType as TransactionTypeByServer,
  useGetBookingDetailValidatePaymentLazyQuery,
  useGetBookingTransactionDetailLazyQuery,
  useGetCustomerByIdLazyQuery,
  useGetDepositeDetailValidatePaymentLazyQuery,
  useGetDepositTransactionDetailLazyQuery,
  useGetFastPaymentTransferInfoByTransIdLazyQuery,
  useGetPaymentTransferInfoByTransIdLazyQuery,
  useGetSimpleTransactionDetailLazyQuery,
  useGetVnPayPaymentTransferInfoByTransIdLazyQuery,
} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy, useMutationGraphql} from '../../../../api/graphql/useGraphqlApiLazy';
import {APP_CURRENCY, BOOKING_STATUS, FETCH_POLICY} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import NumberUtils from '../../../../utils/NumberUtils';
import {
  getTextDateFromTimeStamp,
  getTransactionDateTimeString,
} from '../../../../utils/TimerCommon';
import {getUserFullName} from '../../../../utils/UserAgentUtil';
import PropertyType from '../../../ManagePost/PropertyType';
import {DepositType, EndTransactionType, TransactionType} from './DetailTransactionConstant';

const INITIAL_TRANSACTION_DETAIL = {
  transactionCode: '',
  startTransactionDateTime: '',
  agentFullName: '',
  agentPhoto: '',
  customerFullName: '',
  customerPhoneNumber: '',
  projectName: '',
  propertyTypeName: '',
  propertyCode: '',
  floor: null,
  blockName: '',
  isMeBuy: false,

  transactionType: null,
  shortNamePropertyType: '',
  //Booking
  confirmedBookingDatetime: '',
  bookingInfoTime: '',

  transactionStatus: '',
  transactionAmount: '',
  transactionIndex: null,

  //Deposit
  depositInfoTime: '',

  depositType: DepositType.Nothing,
  saleOpenDate: '',
  transferredDepositCode: '',
  depositDuration: '',
  beginDepositeDatetime: 0,
  endDepositeDatetime: 0,
  canTransferProperty: false,
  isSaleSeasonClosed: false,
  endTransactionTime: '',
  endTransactionType: EndTransactionType.InActive,
  canConfirmDeposit: true,
  paymentUnit: '',
  priorBookingInfo: null,
};

const getEndTransactionType = ({transactionStatus, depositType, isSaleSeasonClosed, rawData}) => {
  let endTransactionType = EndTransactionType.InActive;
  let endTransactionTimeStamp = null;
  if (isSaleSeasonClosed) {
    switch (depositType) {
      case DepositType.Deposited:
      case DepositType.BookDeposited:
        endTransactionType = EndTransactionType.Completed;
        endTransactionTimeStamp = rawData.propertyPostInfo?.saleSeasonInfo?.closeDatetime;
        break;
    }
  }

  switch (depositType) {
    case DepositType.Nothing:
    case DepositType.DepositTransfer: // set end time for DepositTransfer
      if (transactionStatus === BOOKING_STATUS.DEPOSITED) {
        endTransactionType = EndTransactionType.Deposited;
        endTransactionTimeStamp = rawData.confirmedDepositeDatetime;
      } else if (transactionStatus === BOOKING_STATUS.DEPOSTIE_TRANSFER) {
        endTransactionType = EndTransactionType.TransferDeposit;
        endTransactionTimeStamp =
          rawData.changeToTransaction?.changeAnotherPropertyDatetime ??
          rawData.confirmedDepositeDatetime;
      }
      break;
  }

  return {
    endTransactionType,
    endTransactionTime: getTransactionDateTimeString(endTransactionTimeStamp),
  };
};

const getDepositInfoTimeStamp = ({depositType, rawData}) => {
  if (!rawData) {
    return null;
  }
  const endDepositeByPropertyTime = rawData.endDepositeDatetimeByPropertyPostId;
  const endDepositeDatetime = rawData.endDepositeDatetime;
  const confirmedDepositeDatetime = rawData.confirmedDepositeDatetime;
  // If user has transfer deposit => show time of transfer
  // If user deposited => show time confirm deposit
  // If his confirm deposit duration end => show endDepositedDateTime
  // If other user deposited before the duration => show endDepositeDatetimeByPropertyPostId
  let depositInfoTimeStamp = null;
  switch (depositType) {
    case DepositType.Deposited:
    case DepositType.BookDeposited:
      depositInfoTimeStamp = confirmedDepositeDatetime;
      break;
    case DepositType.DepositEnded:
      depositInfoTimeStamp = moment(endDepositeByPropertyTime).isBefore(moment(endDepositeDatetime))
        ? endDepositeByPropertyTime
        : endDepositeDatetime;
      break;
    case DepositType.DepositTransfer:
      depositInfoTimeStamp =
        rawData.changeToTransaction?.changeAnotherPropertyDatetime ?? confirmedDepositeDatetime;
  }
  return depositInfoTimeStamp;
};

const getAbleRequestRefund = rawData => {
  const transactionStatus = rawData.transactionStatusName;
  const saleCloseDateTime = rawData?.propertyPostInfo?.saleSeasonInfo?.closeDatetime;

  const ableRequestRefund =
    transactionStatus === BOOKING_STATUS.NO_DEPOSIT &&
    saleCloseDateTime &&
    moment().isAfter(moment(saleCloseDateTime))
      ? true
      : false;

  return ableRequestRefund;
};

const getDepositTypeFromBookingStatus = ({
  transactionStatus,
  saleOpenDateTime,
  endDepositeByPropertyTime,
  transactionType,
}) => {
  let depositType = null;
  switch (transactionStatus) {
    case BOOKING_STATUS.BOOKING_COMPLETED:
      //User booking completed and sale open not yet
      depositType = moment().isBefore(moment(saleOpenDateTime))
        ? DepositType.Future
        : DepositType.Waiting;
      if (endDepositeByPropertyTime) {
        depositType = DepositType.DepositEnded;
      }
      break;
    case BOOKING_STATUS.WAITING_DEPOSIT:
      depositType = endDepositeByPropertyTime ? DepositType.DepositEnded : DepositType.Waiting;
      break;
    case BOOKING_STATUS.DEPOSITED:
      depositType =
        transactionType === TransactionType.Booking
          ? DepositType.BookDeposited
          : DepositType.Deposited;
      break;
    case BOOKING_STATUS.DEPOSTIE_TRANSFER:
      depositType = DepositType.DepositTransfer;
      break;
    case BOOKING_STATUS.NO_DEPOSIT:
      depositType = DepositType.DepositEnded;
      break;
    case BOOKING_STATUS.REFUND_REQUEST:
      depositType =
        transactionType === TransactionType.Booking
          ? DepositType.RefundRequest
          : DepositType.RefundRequestDeposit;
      break;
    case BOOKING_STATUS.REFUNDED:
      depositType =
        transactionType === TransactionType.Booking
          ? DepositType.Refunded
          : DepositType.RefundedDeposit;
      break;
    case BOOKING_STATUS.WAITING_PAYMENT:
      depositType =
        transactionType === TransactionType.Booking
          ? DepositType.WaitingPayment
          : DepositType.WaitingPaymentDeposit;
      break;
    case BOOKING_STATUS.CANCELLED:
      depositType =
        transactionType === TransactionType.Booking
          ? DepositType.Cancelled
          : DepositType.CancelledDeposit;
      break;
  }
  return depositType;
};

const getCancelReason = ({cancelSeason, transactionType}) => {
  if (isEmpty(cancelSeason) || transactionType === TransactionType.Booking) return '';
  switch (cancelSeason) {
    case TransactionCancelReason.Bookingsaleseasonend:
    case TransactionCancelReason.Newsaleseason:
      return translate('transaction.cancelReason.BookingSaleSeasonEnd');
    case TransactionCancelReason.Incompletepayment:
      return translate('transaction.cancelReason.IncompletePayment');
    case TransactionCancelReason.Propertysold:
      return translate('transaction.cancelReason.PropertySold');
    default:
      return '';
  }
};

const mapRawDataToDepositInfo = rawData => {
  const transactionType = rawData.transactionType;
  const propertyPostInfo = rawData.propertyPostInfo;
  const saleSeasonInfo = propertyPostInfo?.saleSeasonInfo;

  const endDepositeByPropertyTime = rawData.endDepositeDatetimeByPropertyPostId;
  const confirmedDepositeDatetime = rawData.confirmedDepositeDatetime;
  const changeToTransaction = rawData.changeToTransaction;
  const endDepositeTimeInSecond = rawData.endDepositeTimeInSecond;
  const saleOpenDateTime = saleSeasonInfo?.openDatetime;
  const saleCloseDateTime = saleSeasonInfo?.closeDatetime;
  const transactionStatus = rawData.transactionStatusName;
  const ableConfirmDeposite = rawData.ableConfirmDeposite;
  const beginDepositTime = rawData.beginDepositeDatetime;
  const endDepositTime = rawData.endDepositeDatetime;
  const priorBookingInfo =
    transactionType === TransactionType.Deposit && !isEmpty(rawData?.bookingTransactionId)
      ? {bookingTransactionId: rawData?.bookingTransactionId, bookingCode: rawData?.bookingCode}
      : rawData?.priorBookingInfo;

  let depositType = getDepositTypeFromBookingStatus({
    transactionStatus,
    saleOpenDateTime,
    endDepositeByPropertyTime,
    transactionType,
  });
  const isDepositedAfterSaleClose =
    depositType === DepositType.Deposited &&
    confirmedDepositeDatetime &&
    moment(confirmedDepositeDatetime).isAfter(moment(saleCloseDateTime));

  const changeAnotherPropertyDatetime = changeToTransaction?.changeAnotherPropertyDatetime;
  const isDepositTransferAfterSaleClose =
    depositType === DepositType.DepositTransfer &&
    changeAnotherPropertyDatetime &&
    moment(changeAnotherPropertyDatetime).isAfter(moment(saleCloseDateTime));

  if (isDepositedAfterSaleClose || isDepositTransferAfterSaleClose) {
    //Deposited: This transaction happens after saleCloseDateTime => this property is transfered from other transaction
    // => ignore Deposit milestone for this transaction
    //Transfer: Transfer deposit to other property after closing sale season => show detail on end transaction milestone
    depositType = DepositType.Nothing;
  }
  if (
    depositType === DepositType.Waiting &&
    ableConfirmDeposite &&
    moment().isAfter(beginDepositTime) &&
    moment().isBefore(endDepositTime) &&
    endDepositeTimeInSecond > 0
  ) {
    depositType = DepositType.OpeningDeposit;
  }

  const depositInfoTimeStamp = getDepositInfoTimeStamp({depositType, rawData});
  const depositInfoTime = getTransactionDateTimeString(depositInfoTimeStamp);

  let depositDuration = '';

  if (beginDepositTime && endDepositTime) {
    depositDuration = moment(endDepositTime).diff(moment(beginDepositTime), 'minutes');
  }

  let isSaleSeasonClosed = false;
  if (saleCloseDateTime) {
    isSaleSeasonClosed = moment(saleCloseDateTime).isBefore(moment());
  }

  const {endTransactionType, endTransactionTime} = getEndTransactionType({
    transactionStatus,
    depositType,
    isSaleSeasonClosed,
    rawData,
  });

  const cancelSeason = getCancelReason({
    cancelSeason: rawData?.cancelReason,
    transactionStatus,
    transactionType,
  });

  const depositInfo = {
    //Deposit
    depositInfoTime: depositInfoTime,
    depositType: depositType,
    saleOpenDate: getTransactionDateTimeString(saleOpenDateTime),
    transferredDepositCode: changeToTransaction?.depositeCode ?? '',
    depositDuration: `${depositDuration}p`,
    beginDepositeDatetime: getTransactionDateTimeString(beginDepositTime),
    endDepositeDatetime: endDepositTime,
    canTransferProperty: false,
    isSaleSeasonClosed,
    endTransactionTime,
    endTransactionType,
    canConfirmDeposit: ableConfirmDeposite ?? false,
    // priorBookingInfo for new feature BIDV
    priorBookingInfo: priorBookingInfo,
    cancelledSeason: cancelSeason,
  };
  return depositInfo;
};

const mapTransactionDetailToData = rawData => {
  //Hard code
  // const rawData = {
  //   ...rawData1,
  //   transactionStatusName: BOOKING_STATUS.NO_DEPOSIT,
  //   beginDepositeDatetime: 1589890463000,
  //   endDepositeDatetime: 1589972983000,
  //   propertyPostInfo: {
  //     ...rawData1.propertyPostInfo,
  //     saleSeasonInfo: {
  //       ...rawData1.propertyPostInfo?.saleSeasonInfo,
  //       openDatetime: 1590002788000,
  //       closeDatetime: 1589829988000,
  //     },
  //   },
  // };
  //End hard code

  if (!rawData) {
    return INITIAL_TRANSACTION_DETAIL;
  }
  const propertyPrice = Math.max(
    rawData.propertyPostInfo?.priceVat,
    rawData.propertyPostInfo?.priceNoVat,
  );
  const transactionType = rawData.transactionType;
  const startTransactionDateTimeStamp =
    rawData.confirmedBookingDatetime ?? rawData.confirmedDepositeDatetime;
  const propertyPostInfo = rawData.propertyPostInfo;
  const projectInfo = propertyPostInfo?.projectInfo;
  const transactionStatus = rawData.transactionStatusName;
  const endDepositeTimeInSecond = rawData?.endDepositeTimeInSecond;
  const ableRequestRefund = getAbleRequestRefund(rawData);

  const customerInfo = {
    customerNationalIdIssueDate: getTextDateFromTimeStamp(
      rawData.customerInfo?.customerNationalIdIssueDate,
    ),
    permanentAddress: rawData?.customerInfo?.permanentAddress,
    customerNationalIdIssuePlace: rawData.customerInfo?.customerNationalIdIssuePlace,
    customerPhoneNumber: rawData.customerInfo?.customerPhone,
    customerFullName: getUserFullName({
      firstName: rawData.customerInfo?.customerFirstName,
      lastName: rawData.customerInfo?.customerLastName,
    }),
    nationalIdType: rawData?.customerInfo?.nationalIdType,
    gender: rawData?.customerInfo?.gender,
    customerDob: getTextDateFromTimeStamp(rawData?.customerInfo?.customerDob),
    customerEmail: rawData.customerInfo?.customerEmail,
    customerNationalId: rawData.customerInfo?.customerNationalId,
    customerContactAddress: rawData.customerInfo?.customerContactAddress,
  };

  const uiData = {
    transactionId: rawData?.bookingTransactionId ?? rawData?.depositeTransactionId,
    transactionType,
    transactionCode:
      transactionType === TransactionType.Booking ? rawData.bookingCode : rawData.depositeCode,
    startTransactionDateTime: getTransactionDateTimeString(startTransactionDateTimeStamp),
    agentFullName: getUserFullName(rawData.saleAgentInfo),
    agentPhoto: rawData.saleAgentInfo?.profilePhoto ?? '',
    customerInfo: customerInfo,
    projectName: projectInfo?.projectName,
    propertyTypeName: propertyPostInfo?.propertyTypeName,
    propertyCode: propertyPostInfo?.propertyCode,
    floor: propertyPostInfo?.floor,
    blockName: propertyPostInfo?.blockName,
    //To check if user if also buyer
    isMeBuy: rawData.isBuyer ?? false,
    isCancelled: rawData.isCancelled ?? false, // transaction was cancelled
    hasCustomerInfoChangeHistory: rawData?.hasCustomerInfoChangeHistory,
    allowUpdateCustomer: rawData?.allowUpdateCustomer,
    shortNamePropertyType:
      rawData.propertyPostInfo?.propertyTypeName === PropertyType.land
        ? translate(STRINGS.SHORT_NAME_LAND)
        : translate(STRINGS.SHORT_NAME_APARTMENT), // 'căn' or 'lô'
    //Booking
    bookingInfoTime: getTransactionDateTimeString(rawData.confirmedBookingDatetime),
    transactionStatus,
    endDepositeTimeInSecond: endDepositeTimeInSecond,
    transactionAmount: `${NumberUtils.formatNumberToCurrencyNumber(
      rawData.transactionAmount,
      0,
    )} ${APP_CURRENCY}`,
    // remove transactionIndex when transaction was cancelled
    transactionIndex:
      transactionType === TransactionType.Booking && rawData?.isCancelled
        ? null
        : rawData.transactionIndex,

    paidAmount: `${NumberUtils.formatNumberToCurrencyNumber(
      rawData.paidAmount,
      0,
    )} ${APP_CURRENCY}`,
    price: propertyPrice
      ? `${NumberUtils.formatNumberToCurrencyNumber(propertyPrice, 0)} ${APP_CURRENCY}`
      : '',
    //Deposit
    ...mapRawDataToDepositInfo(rawData),
    depositeTransactionId: rawData.depositeTransactionId,
    ableRequestRefund,
    projectId: projectInfo?.projectId,
    saleSeasonId: propertyPostInfo?.saleSeasonInfo?.saleSeasonId,
    isCurrentSaleSeason: true,
    // Phương thức thanh toán enum
    paymentUnit: rawData?.paymentUnit,
    // enable button refund for deposit and booking
    refundReady: rawData?.refundReady ?? false,
    //Transfer data to other screens
    rawData,
  };
  return uiData;
};

const useTransactionDetail = ({
  transactionType,
  transactionId,
  propertyPostId,
  onSuccess,
  showSpinner = false,
  onSuccessHandler,
}) => {
  const [transactionDetail, setTransactionDetail] = useState(null);

  const customerInfoApi = useMutationGraphql({
    showSpinner: false,
    graphqlApiLazy: useGetCustomerByIdLazyQuery,
    dataField: 'customerById',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
  });

  const bankInfoApi = useMutationGraphql({
    graphqlApiLazy: useGetPaymentTransferInfoByTransIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'bankPaymentTransferInfoByTransId',
    showSpinner: true,
  });
  const fastInfoApi = useMutationGraphql({
    graphqlApiLazy: useGetFastPaymentTransferInfoByTransIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'fastPaymentTransferInfoByTransId',
    showSpinner: true,
  });
  const vnpayInfoApi = useMutationGraphql({
    graphqlApiLazy: useGetVnPayPaymentTransferInfoByTransIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'vnpayPaymentTransferInfoByTransId',
    showSpinner: true,
  });

  const getPaymentByTransId = ({tranId, paymentUnit}) => {
    if (isEmpty(paymentUnit) || isEmpty(tranId)) return;

    switch (paymentUnit) {
      case PaymentUnit.Bidv:
        bankInfoApi.startApi({variables: {input: tranId}}, res => {
          onSuccessHandler && onSuccessHandler(res?.bankPaymentTransferInfoDto);
        });
        break;
      case PaymentUnit.Fast:
        fastInfoApi.startApi({variables: {input: tranId}}, res => {
          onSuccessHandler && onSuccessHandler(res?.fastPaymentTransferInfoDto);
        });
        break;
      case PaymentUnit.Vnpay:
        vnpayInfoApi.startApi({variables: {input: tranId}}, res => {
          onSuccessHandler && onSuccessHandler(res?.vnpayPaymentTransferInfoDto);
        });
        break;
      default:
        break;
    }
  };

  const onSuccessGetDetail = result => {
    setTransactionDetail(result);
    onSuccess && onSuccess(result);
    let detail = {};

    const customerId = result?.customerInfo?.customerId;
    if (customerId) {
      const variables: GetCustomerByIdQueryVariables = {
        customerId: customerId,
      };
      customerInfoApi.startApi({variables}, customerInfo => {
        detail = {
          ...result,
          customerInfo,
        };
        setTransactionDetail(detail);
        onSuccess && onSuccess(detail);
      });
    }

    if (!isEmpty(result?.paymentUnit)) {
      let paymentTransactionId = transactionId;
      if (
        transactionType === TransactionType.Deposit &&
        (!isEmpty(result?.priorBookingTransactionId) || !isEmpty(result?.bookingTransactionId))
      ) {
        paymentTransactionId = isEmpty(result?.priorBookingTransactionId)
          ? result?.bookingTransactionId
          : result?.priorBookingTransactionId;
      }
      if (
        transactionType === TransactionType.Booking ||
        (transactionType === TransactionType.Deposit && isEmpty(result?.priorBookingTransactionId))
      ) {
        getPaymentByTransId({tranId: paymentTransactionId, paymentUnit: result?.paymentUnit});
      } else {
        getPaymentByTransId({
          tranId: paymentTransactionId,
          paymentUnit: result?.paymentUnit,
        });
      }
    }
  };

  const query =
    transactionType === TransactionType.Booking
      ? useGetBookingTransactionDetailLazyQuery
      : useGetDepositTransactionDetailLazyQuery;

  const dataField =
    transactionType === TransactionType.Booking
      ? 'bookingTransactionDetail'
      : 'depositTransactionDetail';

  const {startApi: fetchTransactionDetail, loading} = useGraphqlApiLazy({
    graphqlApiLazy: query,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessGetDetail,
    dataField,
    showSpinner: showSpinner,
  });

  const getTransactionDetail = newId => {
    const input = newId ?? transactionId;
    fetchTransactionDetail({variables: {transactionId: input, propertyPostId}});
  };

  return {getTransactionDetail, transactionDetail, loading};
};

const useTransactionDetailWithChecksum = ({
  transactionType,
  transactionId,
  propertyPostId,
  onSuccess,
  onError,
  showSpinner = false,
}) => {
  const [transactionDetail, setTransactionDetail] = useState(null);
  const updatedTransactionId = useRef(null);

  const onSuccessValidate = (result: GetTransactionValidatePaymentResponse) => {
    const isValidated = result?.isValid ?? false;

    if (isValidated) {
      const input: SimpleTransactionDetailInput = {
        propertyPostId,
        transactionId: updatedTransactionId.current,
        transactionType:
          transactionType === TransactionType.Booking
            ? TransactionTypeByServer.Booking
            : TransactionTypeByServer.Deposit,
      };

      fetchTransactionDetail({
        variables: {
          input,
        },
      });
    } else {
      onError && onError(isValidated);
    }
  };

  const onSuccessGetDetail = (result: GetSimpleTransactionDetailResponse) => {
    if (result?.errorCode === 0) {
      setTransactionDetail(result.transactionDetailDto);
      onSuccess && onSuccess(result.transactionDetailDto);
    }
  };

  const onErrorGetDetail = error => {
    onError && onError(error);
  };

  const query =
    transactionType === TransactionType.Booking
      ? useGetBookingDetailValidatePaymentLazyQuery
      : useGetDepositeDetailValidatePaymentLazyQuery;

  const dataField =
    transactionType === TransactionType.Booking
      ? 'bookingTransactionValidatePayment'
      : 'depositeTransactionValidatePayment';

  const {startApi: fetchTransactionDetail, loading: loadingDetail} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSimpleTransactionDetailLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessGetDetail,
    onError: onErrorGetDetail,
    dataField: 'simpleTransactionDetail',
    showSpinner: showSpinner,
  });

  const {startApi: validateTransaction, loading: validationLoading} = useGraphqlApiLazy({
    graphqlApiLazy: query,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessValidate,
    onError: onErrorGetDetail,
    dataField,
    showSpinner: showSpinner,
  });

  const getTransactionDetail = (newId, postId, paymentReturnUrl) => {
    const input = newId ?? transactionId;
    updatedTransactionId.current = input;
    validateTransaction({
      variables: {transactionId: input, propertyPostId: propertyPostId ?? postId, paymentReturnUrl},
    });
  };

  return {getTransactionDetail, transactionDetail, loading: loadingDetail && validationLoading};
};

export {
  INITIAL_TRANSACTION_DETAIL,
  mapTransactionDetailToData,
  useTransactionDetail,
  useTransactionDetailWithChecksum,
};
