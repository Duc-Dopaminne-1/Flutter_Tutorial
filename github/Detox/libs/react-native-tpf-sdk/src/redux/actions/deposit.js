import { DEPOSIT } from '../actionsType';

export const getDepositMoneyHandler = payload => ({
  type: DEPOSIT.GET_DEPOSIT_MONEY.HANDLER,
  payload
});

export const getDepositMoneySuccess = payload => ({
  type: DEPOSIT.GET_DEPOSIT_MONEY.SUCCESS,
  payload
});

export const getDepositMoneyFailure = payload => ({
  type: DEPOSIT.GET_DEPOSIT_MONEY.FAILURE,
  payload
});

export const getListDepositRefundRequestHandler = payload => ({
  type: DEPOSIT.GET_LIST_REFUND_REQUEST.HANDLER,
  payload
});

export const getListDepositRefundRequestSuccess = payload => ({
  type: DEPOSIT.GET_LIST_REFUND_REQUEST.SUCCESS,
  payload
});

export const getListDepositRefundRequestFailure = payload => ({
  type: DEPOSIT.GET_LIST_REFUND_REQUEST.FAILURE,
  payload
});

export const clearListDepositRefundRequest = payload => ({
  type: DEPOSIT.GET_LIST_REFUND_REQUEST.CLEAR,
  payload
});

export const getSummaryTransactionHandler = payload => ({
  type: DEPOSIT.GET_SUMMARY_TRANSACTION.HANDLER,
  payload
});

export const getSummaryTransactionSuccess = payload => ({
  type: DEPOSIT.GET_SUMMARY_TRANSACTION.SUCCESS,
  payload
});

export const getSummaryInsuranceHandler = payload => ({
  type: DEPOSIT.GET_SUMMARY_INSURANCE.HANDLER,
  payload
});

export const getSummaryInsuranceSuccess = payload => ({
  type: DEPOSIT.GET_SUMMARY_INSURANCE.SUCCESS,
  payload
});
