import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import {PaymentUnit, TransactionServiceType} from '../../api/graphql/generated/graphql';
import {CONSTANTS, ManagePaymentStatus, ManagePaymentStatusId} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {dateToTimestamp, getDateBefore} from '../../utils/TimerCommon';

// Cấu hình: Hệ thống có cấu hình thời gian, mặc định 03 tháng.
export const LIMIT_RANGE_DATE = 90;
const ORDER_DESC = 'DESC';
const DEFAULT_SELECTED = '';

// Transaction types
export const transactionServices = [
  {
    id: STRINGS.ALL,
    name: translate(STRINGS.ALL),
    checked: false,
  },
  {
    id: TransactionServiceType.B2Ctype,
    name: translate(STRINGS.PROJECT),
    checked: false,
  },
  {
    id: TransactionServiceType.C2Ctype,
    name: translate(STRINGS.RETAIL_ESTATES),
    checked: false,
  },
  {
    id: TransactionServiceType.Subtype,
    name: translate('common.fee'),
    checked: false,
  },
  {
    id: TransactionServiceType.Refundtype,
    name: translate(STRINGS.REFUND_REQUEST),
    checked: false,
  },
];

export const paymentUnits = [
  {
    id: STRINGS.ALL,
    name: translate(STRINGS.ALL),
    checked: false,
  },
  {
    id: PaymentUnit.Bidv,
    name: translate('common.bankTransfer'),
    checked: false,
  },
  {
    id: PaymentUnit.Vnpay,
    name: 'VNPay',
    checked: false,
  },
  {
    id: PaymentUnit.Fast,
    name: translate('common.cash'),
    checked: false,
  },
];

export const paymentStatus = [
  {
    id: STRINGS.ALL,
    name: translate(STRINGS.ALL),
    checked: false,
  },
  {
    id: ManagePaymentStatusId.WAITING,
    name: translate('payment.status.waitingForPay'),
    checked: false,
  },
  {
    id: ManagePaymentStatusId.PARTIAL,
    name: translate('payment.status.partialPayment'),
    checked: false,
  },
  {
    id: ManagePaymentStatusId.PAID,
    name: translate('payment.status.paid'),
    checked: false,
  },
  {
    id: ManagePaymentStatusId.CANCELLED,
    name: translate('payment.status.expired'),
    checked: false,
  },
  {
    id: ManagePaymentStatusId.REFUND_REQUEST,
    name: translate('payment.status.refundRequest'),
    checked: false,
  },
  {
    id: ManagePaymentStatusId.REFUNDED,
    name: translate('payment.status.refunded'),
    checked: false,
  },
];

const getInitialFilterData = () => {
  return {
    fromDate: getDateBefore(LIMIT_RANGE_DATE).toISOString(),
    toDate: new Date().toISOString(),
    transactionServiceType: DEFAULT_SELECTED,
    transactionPaymentStatus: DEFAULT_SELECTED,
    paymentUnit: DEFAULT_SELECTED,
  };
};

const filterDataToQueryParams = ({paymentTransferNumber, filterData}) => {
  const {fromDate, toDate, transactionServiceType, transactionPaymentStatus, paymentUnit} =
    filterData;
  const fromDatetime = dateToTimestamp(new Date(moment(fromDate).startOf(CONSTANTS.DAY)));
  const toDatetime = dateToTimestamp(new Date(moment(toDate).endOf(CONSTANTS.DAY)));
  const paymentCode = isEmpty(paymentTransferNumber)
    ? null
    : {paymentTransferNumber_contains: paymentTransferNumber};
  const paymentServiceType =
    isEmpty(transactionServiceType) || transactionServiceType === STRINGS.ALL
      ? null
      : {transactionServiceType};

  const transactionStatus =
    isEmpty(transactionPaymentStatus) || transactionPaymentStatus === STRINGS.ALL
      ? null
      : {transactionPaymentStatus};
  const paymentMethod = isEmpty(paymentUnit) || paymentUnit === STRINGS.ALL ? null : {paymentUnit};
  const params = {
    ...paymentCode,
    ...paymentServiceType,
    ...transactionStatus,
    ...paymentMethod,
    createdDatetime_gte: fromDatetime,
    createdDatetime_lte: toDatetime,
  };

  return {
    where: {...params},
    order_by: {
      createdDatetime: ORDER_DESC,
    },
  };
};

const getColorAndNameByStatus = paymentStatusId => {
  let status = null;
  if (paymentStatusId) {
    const statusObj = ManagePaymentStatus[paymentStatusId];
    if (statusObj) {
      status = statusObj;
    }
  }
  return status;
};

const ManagePaymentFilterUtil = {
  getInitialFilterData,
  filterDataToQueryParams,
  getColorAndNameByStatus,
};

export default ManagePaymentFilterUtil;
