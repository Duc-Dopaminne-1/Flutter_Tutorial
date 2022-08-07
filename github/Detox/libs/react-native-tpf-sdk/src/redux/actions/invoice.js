import { INVOICE } from '../actionsType';

export const createOrEditInvoiceHandle = payload => ({
  type: INVOICE.CREATE_OR_EDIT_INVOICE.HANDLER,
  payload
});

export const createOrEditInvoiceSuccess = payload => ({
  type: INVOICE.CREATE_OR_EDIT_INVOICE.SUCCESS,
  payload
});

export const createOrEditInvoiceFailure = payload => ({
  type: INVOICE.CREATE_OR_EDIT_INVOICE.FAILURE,
  payload
});

export const createOrEditInvoiceClear = payload => ({
  type: INVOICE.CREATE_OR_EDIT_INVOICE.CLEAR,
  payload
});

export const getAllInvoiceHandle = payload => ({
  type: INVOICE.GET_ALL_INVOICE.HANDLER,
  payload
});

export const getAllInvoiceSuccess = payload => ({
  type: INVOICE.GET_ALL_INVOICE.SUCCESS,
  payload
});

export const getAllInvoiceFailure = payload => ({
  type: INVOICE.GET_ALL_INVOICE.FAILURE,
  payload
});

export const clearInvoices = () => ({
  type: INVOICE.GET_ALL_INVOICE.CLEAR
});

export const getAllTransactionHandle = payload => ({
  type: INVOICE.GET_ALL_TRANSACTION.HANDLER,
  payload
});

export const getAllTransactionSuccess = payload => ({
  type: INVOICE.GET_ALL_TRANSACTION.SUCCESS,
  payload
});

export const getAllTransactionFailure = payload => ({
  type: INVOICE.GET_ALL_TRANSACTION.FAILURE,
  payload
});

export const createUpgradeTopnerTransactionHandle = payload => ({
  type: INVOICE.CREATE_UPGRADE_TOPENER_TRANSACTION.HANDLER,
  payload
});

export const createUpgradeTopnerTransactionSuccess = payload => ({
  type: INVOICE.CREATE_UPGRADE_TOPENER_TRANSACTION.SUCCESS,
  payload
});

export const createUpgradeTopnerTransactionFailure = payload => ({
  type: INVOICE.CREATE_UPGRADE_TOPENER_TRANSACTION.FAILURE,
  payload
});

export const createUpgradeTopnerTransactionClear = payload => ({
  type: INVOICE.CREATE_UPGRADE_TOPENER_TRANSACTION.CLEAR,
  payload
});
