import moment from 'moment';

import {BOOKING_STATUS, CONSTANTS} from '../../assets/constants';
import {COLORS} from '../../assets/theme/colors';
import JsonDataUtils from '../../utils/JsonDataUtils';
import {dateToTimestamp, getDateBefore} from '../../utils/TimerCommon';
import {TransactionType} from './DetailTransaction/Components/DetailTransactionConstant';

// Cấu hình: Hệ thống có cấu hình thời gian, mặc định 03 tháng.
export const TRANSACTION_RANGE_DATE = 90;
const ORDER_DESC = 'DESC';
const DEFAULT_TRANSACTION_STATUS = true;

const getInitialFilterData = () => {
  return {
    fromDate: getDateBefore(TRANSACTION_RANGE_DATE).toISOString(),
    toDate: new Date().toISOString(),
    alreadyBooked: DEFAULT_TRANSACTION_STATUS,
    waitingDeposit: DEFAULT_TRANSACTION_STATUS,
    deposited: DEFAULT_TRANSACTION_STATUS,
    depositTransfer: DEFAULT_TRANSACTION_STATUS,
    refundRequest: DEFAULT_TRANSACTION_STATUS,
    refunded: DEFAULT_TRANSACTION_STATUS,
    noDeposit: DEFAULT_TRANSACTION_STATUS,
    pending: DEFAULT_TRANSACTION_STATUS,
    expired: DEFAULT_TRANSACTION_STATUS,
    signedContract: DEFAULT_TRANSACTION_STATUS,
    depositCancel: DEFAULT_TRANSACTION_STATUS,
  };
};

const filterDataToQueryParams = ({keywords, filterData, cursorSetting}) => {
  const statusList = [];
  const {
    alreadyBooked,
    waitingDeposit,
    deposited,
    depositTransfer,
    refundRequest,
    refunded,
    fromDate,
    toDate,
    noDeposit,
    pending,
    expired,
    depositCancel,
    signedContract,
  } = filterData;
  alreadyBooked && statusList.push(BOOKING_STATUS.BOOKING_COMPLETED);
  waitingDeposit && statusList.push(BOOKING_STATUS.WAITING_DEPOSIT);
  deposited && statusList.push(BOOKING_STATUS.DEPOSITED);
  depositTransfer && statusList.push(BOOKING_STATUS.DEPOSTIE_TRANSFER);
  refundRequest && statusList.push(BOOKING_STATUS.REFUND_REQUEST);
  refunded && statusList.push(BOOKING_STATUS.REFUNDED);
  noDeposit && statusList.push(BOOKING_STATUS.NO_DEPOSIT);
  pending && statusList.push(BOOKING_STATUS.WAITING_PAYMENT);
  expired && statusList.push(BOOKING_STATUS.CANCELLED);
  signedContract && statusList.push(BOOKING_STATUS.SIGNED_CONTRACT);
  depositCancel && statusList.push(BOOKING_STATUS.DEPOSIT_CANCEL);
  const fromDatetime = fromDate
    ? {fromDatetime: dateToTimestamp(new Date(moment(fromDate).startOf(CONSTANTS.DAY)))}
    : {};
  const toDatetime = toDate
    ? {toDatetime: dateToTimestamp(new Date(moment(toDate).endOf(CONSTANTS.DAY)))}
    : {};

  const params = {
    keywords,
    transactionStatuses: JsonDataUtils.stringifyJSONArray(statusList),
    ...fromDatetime,
    ...toDatetime,
  };

  const orderBy = {
    transactionDatetime: ORDER_DESC,
  };

  return {input: params, ...cursorSetting, orderBy};
};

const statusToStyle = status => {
  let container = {};
  let text = {};
  switch (status) {
    case BOOKING_STATUS.BOOKING_COMPLETED:
      container = {
        backgroundColor: COLORS.BOOKING_COMPLETED,
        borderColor: COLORS.BOOKING_COMPLETED,
      };
      text = {color: COLORS.NEUTRAL_WHITE};
      break;
    case BOOKING_STATUS.BOOKING_TRANSFER:
      container = {
        borderColor: COLORS.BOOKING_TRANSFER,
      };
      text = {color: COLORS.BOOKING_TRANSFER};
      break;
    case BOOKING_STATUS.WAITING_DEPOSIT:
      container = {
        borderColor: COLORS.WAITING_DEPOSIT,
      };
      text = {color: COLORS.WAITING_DEPOSIT};
      break;
    case BOOKING_STATUS.DEPOSITED:
      container = {backgroundColor: COLORS.DEPOSITED, borderColor: COLORS.DEPOSITED};
      text = {color: COLORS.NEUTRAL_WHITE};
      break;
    case BOOKING_STATUS.DEPOSTIE_TRANSFER:
      container = {
        borderColor: COLORS.DEPOSTIE_TRANSFER,
      };
      text = {color: COLORS.DEPOSTIE_TRANSFER};
      break;
    case BOOKING_STATUS.REFUND_REQUEST:
    case BOOKING_STATUS.DEPOSIT_CANCEL:
      container = {
        borderColor: COLORS.REFUND_REQUEST,
      };
      text = {color: COLORS.REFUND_REQUEST};
      break;
    case BOOKING_STATUS.REFUNDED:
      container = {backgroundColor: COLORS.REFUNDED, borderColor: COLORS.REFUNDED};
      text = {color: COLORS.NEUTRAL_WHITE};
      break;
    case BOOKING_STATUS.NO_DEPOSIT:
      container = {backgroundColor: COLORS.NO_DEPOSIT, borderColor: COLORS.NO_DEPOSIT};
      text = {color: COLORS.NEUTRAL_WHITE};
      break;
    case BOOKING_STATUS.CANCELLED:
      container = {backgroundColor: COLORS.TEXT_DARK_40, borderColor: COLORS.TEXT_DARK_40};
      text = {color: COLORS.NEUTRAL_WHITE};
      break;
    case BOOKING_STATUS.WAITING_PAYMENT:
      container = {backgroundColor: COLORS.STATE_ERROR, borderColor: COLORS.STATE_ERROR};
      text = {color: COLORS.NEUTRAL_WHITE};
      break;
  }
  return {container, text};
};

const getTransactionType = transactionTypeText => {
  let normalizedTransactionType = '';
  if (transactionTypeText) {
    const lowerCaseTransactionType = transactionTypeText.toLowerCase();
    if (lowerCaseTransactionType === TransactionType.Booking.toLowerCase()) {
      normalizedTransactionType = TransactionType.Booking;
    } else if (lowerCaseTransactionType === TransactionType.Deposit.toLowerCase()) {
      normalizedTransactionType = TransactionType.Deposit;
    }
  }

  return normalizedTransactionType;
};

const TransactionUtil = {
  getInitialFilterData,
  filterDataToQueryParams,
  statusToStyle,
  getTransactionType,
};

export default TransactionUtil;
