import { CASHOUT } from '../actionsType';

export const getAdvanceTransactionHandle = payload => ({
  type: CASHOUT.GET_ADVANCE_TRANSACTION.HANDLER,
  payload
});

export const getAdvanceTransactionSuccess = payload => ({
  type: CASHOUT.GET_ADVANCE_TRANSACTION.SUCCESS,
  payload
});

export const getAdvanceTransactionFailure = payload => ({
  type: CASHOUT.GET_ADVANCE_TRANSACTION.FAILURE,
  payload
});

export const createOrEditTransactionHandle = payload => ({
  type: CASHOUT.CREATE_OR_EDIT_TRANSACTION.HANDLER,
  payload
});

export const createOrEditTransactionSuccess = payload => ({
  type: CASHOUT.CREATE_OR_EDIT_TRANSACTION.SUCCESS,
  payload
});

export const createOrEditTransactionFailure = payload => ({
  type: CASHOUT.CREATE_OR_EDIT_TRANSACTION.FAILURE,
  payload
});

export const clearCreateOrEditTransaction = () => ({
  type: CASHOUT.CREATE_OR_EDIT_TRANSACTION.CLEAR
});

export const getTransactionByIdHandle = payload => ({
  type: CASHOUT.GET_TRANSACTION_BY_ID.HANDLER,
  payload
});

export const getTransactionByIdSuccess = payload => ({
  type: CASHOUT.GET_TRANSACTION_BY_ID.SUCCESS,
  payload
});

export const getTransactionByIdFailure = payload => ({
  type: CASHOUT.GET_TRANSACTION_BY_ID.FAILURE,
  payload
});
export const getTransactionByIdClear = payload => ({
  type: CASHOUT.GET_TRANSACTION_BY_ID.CLEAR,
  payload
});

export const getAllGlobalCongifHandle = payload => ({
  type: CASHOUT.GET_ALL_GLOBAL_CONFIG.HANDLER,
  payload
});

export const getAllGlobalCongifSuccess = payload => ({
  type: CASHOUT.GET_ALL_GLOBAL_CONFIG.SUCCESS,
  payload
});

export const getAllGlobalCongifFailure = payload => ({
  type: CASHOUT.GET_ALL_GLOBAL_CONFIG.FAILURE,
  payload
});

export const createOrEditAdvanceCommissionHandle = payload => ({
  type: CASHOUT.CREATE_OR_EDIT_ADVANCE_COMMISSION.HANDLER,
  payload
});

export const createOrEditAdvanceCommissionSuccess = payload => ({
  type: CASHOUT.CREATE_OR_EDIT_ADVANCE_COMMISSION.SUCCESS,
  payload
});

export const createOrEditAdvanceCommissionFailure = payload => ({
  type: CASHOUT.CREATE_OR_EDIT_ADVANCE_COMMISSION.FAILURE,
  payload
});
export const clearCreateOrEditAdvanceCommission = () => ({
  type: CASHOUT.CREATE_OR_EDIT_ADVANCE_COMMISSION.CLEAR
});
