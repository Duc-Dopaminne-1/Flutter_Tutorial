import { CREDIT, INSURANCE } from '../actionsType';

export const setDealNewFlagHandle = payload => ({
  type: CREDIT.SET_DEAL_NEW_FLAG.HANDLER,
  payload
});

export const setDealNewFlagSuccess = payload => ({
  type: CREDIT.SET_DEAL_NEW_FLAG.SUCCESS,
  payload
});

export const setDealNewFlagFailure = payload => ({
  type: CREDIT.SET_DEAL_NEW_FLAG.FAILURE,
  payload
});
export const setLeadContactForCredit = payload => ({
  type: CREDIT.SET_LEAD_CONTACT.SUCCESS,
  payload
});

export const clearLeadContactForCredit = payload => ({
  type: CREDIT.SET_LEAD_CONTACT.CLEAR,
  payload
});

export const setProductListFilter = payload => ({
  type: CREDIT.SET_PRODUCT_FILTER.SUCCESS,
  payload
});

export const clearProductListFilter = payload => ({
  type: CREDIT.SET_PRODUCT_FILTER.CLEAR,
  payload
});

export const getLoanProductListHandle = payload => ({
  type: CREDIT.GET_LOAN_PRODUCT_LIST.HANDLER,
  payload
});

export const getLoanProductListSuccess = payload => ({
  type: CREDIT.GET_LOAN_PRODUCT_LIST.SUCCESS,
  payload
});

export const getLoanProductListFailure = payload => ({
  type: CREDIT.GET_LOAN_PRODUCT_LIST.FAILURE,
  payload
});

export const getAllCategoryHandle = payload => ({
  type: CREDIT.GET_ALL_CATEGORY.HANDLER,
  payload
});

export const getAllCategorySuccess = payload => ({
  type: CREDIT.GET_ALL_CATEGORY.SUCCESS,
  payload
});

export const getAllCategoryFailure = payload => ({
  type: CREDIT.GET_ALL_CATEGORY.FAILURE,
  payload
});

export const getLoanProductDetailHandle = payload => ({
  type: CREDIT.GET_LOAN_PRODUCT_DETAIL.HANDLER,
  payload
});

export const getLoanProductDetailSuccess = payload => ({
  type: CREDIT.GET_LOAN_PRODUCT_DETAIL.SUCCESS,
  payload
});

export const getLoanProductDetailFailure = payload => ({
  type: CREDIT.GET_LOAN_PRODUCT_DETAIL.FAILURE,
  payload
});

export const getLoanProductDetailClear = payload => ({
  type: CREDIT.GET_LOAN_PRODUCT_DETAIL.CLEAR,
  payload
});

export const getLoanProductListClear = payload => ({
  type: CREDIT.GET_LOAN_PRODUCT_LIST.CLEAR,
  payload
});

export const getFinanceDealOrderFormHandle = payload => ({
  type: CREDIT.GET_FINANCEDEAL_ORDER_FORM.HANDLER,
  payload
});

export const getFinanceDealOrderFormSuccess = payload => ({
  type: CREDIT.GET_FINANCEDEAL_ORDER_FORM.SUCCESS,
  payload
});

export const getFinanceDealOrderFormFailure = payload => ({
  type: CREDIT.GET_FINANCEDEAL_ORDER_FORM.FAILURE,
  payload
});

export const getFinanceDealOrderFormClear = payload => ({
  type: CREDIT.GET_FINANCEDEAL_ORDER_FORM.CLEAR,
  payload
});

export const getCreditOrderListHandle = payload => ({
  type: CREDIT.GET_ORDER_LIST.HANDLER,
  payload
});

export const getCreditOrderListSuccess = payload => ({
  type: CREDIT.GET_ORDER_LIST.SUCCESS,
  payload
});

export const getCreditOrderListFailure = payload => ({
  type: CREDIT.GET_ORDER_LIST.FAILURE,
  payload
});

export const getCreditOrderListOrderClear = payload => ({
  type: CREDIT.GET_ORDER_LIST.CLEAR,
  payload
});

export const getListResponsesHandle = payload => ({
  type: CREDIT.GET_LIST_RESPONSES.HANDLER,
  payload
});

export const getListResponsesSuccess = payload => ({
  type: CREDIT.GET_LIST_RESPONSES.SUCCESS,
  payload
});

export const getListResponsesFailure = payload => ({
  type: CREDIT.GET_LIST_RESPONSES.FAILURE,
  payload
});

export const compareProductsHandle = payload => ({
  type: CREDIT.COMPARE_PRODUCTS.HANDLER,
  payload
});

export const compareProductsSuccess = payload => ({
  type: CREDIT.COMPARE_PRODUCTS.SUCCESS,
  payload
});

export const compareProductsFailure = payload => ({
  type: CREDIT.COMPARE_PRODUCTS.FAILURE,
  payload
});

export const compareProductsClear = payload => ({
  type: CREDIT.COMPARE_PRODUCTS.CLEAR,
  payload
});

export const getTotalRecordHandle = payload => ({
  type: CREDIT.GET_TOTAL_RECORD.HANDLER,
  payload
});

export const getTotalRecordSuccess = payload => ({
  type: CREDIT.GET_TOTAL_RECORD.SUCCESS,
  payload
});

export const getTotalRecordFailure = payload => ({
  type: CREDIT.GET_TOTAL_RECORD.FAILURE,
  payload
});

export const getTotalRecordClear = payload => ({
  type: CREDIT.GET_TOTAL_RECORD.CLEAR,
  payload
});

export const deteleDealFormHandler = payload => ({
  type: CREDIT.DELETE_DEAL.HANDLER,
  payload
});

export const deteleDealFormSuccess = payload => ({
  type: CREDIT.DELETE_DEAL.SUCCESS,
  payload
});

export const deteleDealFormFailure = payload => ({
  type: CREDIT.DELETE_DEAL.FAILURE,
  payload
});

export const confirmRefundRequestHandler = payload => ({
  type: CREDIT.CONFIRM_REFUND_REQUEST.HANDLER,
  payload
});

export const confirmRefundRequestSuccess = payload => ({
  type: CREDIT.CONFIRM_REFUND_REQUEST.SUCCESS,
  payload
});

export const confirmRefundRequestFailure = payload => ({
  type: CREDIT.CONFIRM_REFUND_REQUEST.FAILURE,
  payload
});

export const confirmRefundRequestClear = payload => ({
  type: CREDIT.CONFIRM_REFUND_REQUEST.CLEAR,
  payload
});

export const needSupportHandle = payload => ({
  type: CREDIT.NEED_SUPPORT.HANDLER,
  payload
});

export const needSupportSuccess = payload => ({
  type: CREDIT.NEED_SUPPORT.SUCCESS,
  payload
});

export const needSupportFailure = payload => ({
  type: CREDIT.NEED_SUPPORT.FAILURE,
  payload
});

export const needSupportClear = payload => ({
  type: CREDIT.NEED_SUPPORT.CLEAR,
  payload
});

export const getCreditByCategoryHandle = payload => ({
  type: CREDIT.GET_CREDIT_BY_CATEGORY.HANDLER,
  payload
});

export const getCreditByCategorySuccess = payload => ({
  type: CREDIT.GET_CREDIT_BY_CATEGORY.SUCCESS,
  payload
});

export const getCreditByCategoryFailure = payload => ({
  type: CREDIT.GET_CREDIT_BY_CATEGORY.FAILURE,
  payload
});

export const clearCreditByCategory = payload => ({
  type: CREDIT.GET_CREDIT_BY_CATEGORY.CLEAR,
  payload
});

export const createDepositPaymentTransactionHandle = payload => ({
  type: CREDIT.CREATE_DEPOSIT_PAYMENT_TRANSACTION.HANDLER,
  payload
});

// CREATE DEAL
export const createFinaneDealOrderHandle = payload => ({
  type: CREDIT.CREATE_FINANE_DEAL_ORDER.HANDLER,
  payload
});

export const createFinaneDealOrderSuccess = payload => ({
  type: CREDIT.CREATE_FINANE_DEAL_ORDER.SUCCESS,
  payload
});

export const createFinaneDealOrderFailure = payload => ({
  type: CREDIT.CREATE_FINANE_DEAL_ORDER.FAILURE,
  payload
});

export const createFinaneDealOrderClear = payload => ({
  type: CREDIT.CREATE_FINANE_DEAL_ORDER.CLEAR,
  payload
});

// EDIT DEAL
export const editDealHandle = payload => ({
  type: CREDIT.EDIT_DEAL.HANDLER,
  payload
});

export const editDealSuccess = payload => ({
  type: CREDIT.EDIT_DEAL.SUCCESS,
  payload
});

export const editDealFailure = payload => ({
  type: CREDIT.EDIT_DEAL.FAILURE,
  payload
});

// GET DEAL FORM
export const getCreateDealOrderFormHandle = payload => ({
  type: CREDIT.GET_CREATE_DEAL_ORDER_FORM.HANDLER,
  payload
});

export const getCreateDealOrderFormSuccess = payload => ({
  type: CREDIT.GET_CREATE_DEAL_ORDER_FORM.SUCCESS,
  payload
});

export const getCreateDealOrderFormFailure = payload => ({
  type: CREDIT.GET_CREATE_DEAL_ORDER_FORM.FAILURE,
  payload
});

export const getCreateDealOrderFormClear = payload => ({
  type: CREDIT.GET_CREATE_DEAL_ORDER_FORM.CLEAR,
  payload
});

export const deleteFinaneDealOrderHandle = payload => ({
  type: CREDIT.DELETE_FINANE_DEAL_ORDER.HANDLER,
  payload
});

export const deleteFinaneDealOrderSuccess = payload => ({
  type: CREDIT.DELETE_FINANE_DEAL_ORDER.SUCCESS,
  payload
});

export const deleteFinaneDealOrderFailure = payload => ({
  type: CREDIT.DELETE_FINANE_DEAL_ORDER.FAILURE,
  payload
});
