import { EXTRA_SERVICE } from '../actionsType';

export const setLeadContactForExtraService = payload => ({
  type: EXTRA_SERVICE.SET_LEAD_CONTACT.SUCCESS,
  payload
});

export const clearLeadContactForExtraService = payload => ({
  type: EXTRA_SERVICE.SET_LEAD_CONTACT.CLEAR,
  payload
});

export const getExtraServiceListHandle = payload => ({
  type: EXTRA_SERVICE.GET_PRODUCT_LIST.HANDLER,
  payload
});

export const getExtraServiceListSuccess = payload => ({
  type: EXTRA_SERVICE.GET_PRODUCT_LIST.SUCCESS,
  payload
});

export const getExtraServiceListFailure = payload => ({
  type: EXTRA_SERVICE.GET_PRODUCT_LIST.FAILURE,
  payload
});

export const getExtraServiceListClear = payload => ({
  type: EXTRA_SERVICE.GET_PRODUCT_LIST.CLEAR,
  payload
});

export const getExtraServiceDetailHandle = payload => ({
  type: EXTRA_SERVICE.GET_PRODUCT_DETAIL.HANDLER,
  payload
});

export const getExtraServiceDetailSuccess = payload => ({
  type: EXTRA_SERVICE.GET_PRODUCT_DETAIL.SUCCESS,
  payload
});

export const getExtraServiceDetailFailure = payload => ({
  type: EXTRA_SERVICE.GET_PRODUCT_DETAIL.FAILURE,
  payload
});

export const getExtraServiceDetailClear = payload => ({
  type: EXTRA_SERVICE.GET_PRODUCT_DETAIL.CLEAR,
  payload
});

export const getExtraServiceOrderFormHandle = payload => ({
  type: EXTRA_SERVICE.GET_ORDER_FORM.HANDLER,
  payload
});

export const getExtraServiceOrderFormSuccess = payload => ({
  type: EXTRA_SERVICE.GET_ORDER_FORM.SUCCESS,
  payload
});

export const getExtraServiceOrderFormFailure = payload => ({
  type: EXTRA_SERVICE.GET_ORDER_FORM.FAILURE,
  payload
});

export const getExtraServiceOrderFormClear = payload => ({
  type: EXTRA_SERVICE.GET_ORDER_FORM.CLEAR,
  payload
});

export const createExtraServiceOrderHandle = payload => ({
  type: EXTRA_SERVICE.CREATE_ORDER.HANDLER,
  payload
});

export const createExtraServiceOrderSuccess = payload => ({
  type: EXTRA_SERVICE.CREATE_ORDER.SUCCESS,
  payload
});

export const createExtraServiceOrderFailure = payload => ({
  type: EXTRA_SERVICE.CREATE_ORDER.FAILURE,
  payload
});

export const createExtraServiceOrderClear = payload => ({
  type: EXTRA_SERVICE.CREATE_ORDER.CLEAR,
  payload
});

export const getExtraServiceOrderListHandle = payload => ({
  type: EXTRA_SERVICE.GET_ORDER_LIST.HANDLER,
  payload
});

export const getExtraServiceOrderListSuccess = payload => ({
  type: EXTRA_SERVICE.GET_ORDER_LIST.SUCCESS,
  payload
});

export const getExtraServiceOrderListFailure = payload => ({
  type: EXTRA_SERVICE.GET_ORDER_LIST.FAILURE,
  payload
});

export const getExtraServiceOrderListClear = () => ({
  type: EXTRA_SERVICE.GET_ORDER_LIST.CLEAR
});

export const getExtraServiceOrderDetailHandle = payload => ({
  type: EXTRA_SERVICE.GET_ORDER_DETAIL.HANDLER,
  payload
});

export const getExtraServiceOrderDetailSuccess = payload => ({
  type: EXTRA_SERVICE.GET_ORDER_DETAIL.SUCCESS,
  payload
});

export const getExtraServiceOrderDetailFailure = payload => ({
  type: EXTRA_SERVICE.GET_ORDER_DETAIL.FAILURE,
  payload
});

export const getExtraServiceOrderDetailClear = () => ({
  type: EXTRA_SERVICE.GET_ORDER_DETAIL.CLEAR
});

export const updateExtraServiceOrderStatusHandle = payload => ({
  type: EXTRA_SERVICE.UPDATE_ORDER_STATUS.HANDLER,
  payload
});

export const updateExtraServiceOrderStatusSuccess = payload => ({
  type: EXTRA_SERVICE.UPDATE_ORDER_STATUS.SUCCESS,
  payload
});

export const updateExtraServiceOrderStatusFailure = payload => ({
  type: EXTRA_SERVICE.UPDATE_ORDER_STATUS.FAILURE,
  payload
});

export const updateExtraServiceOrderStatusClear = () => ({
  type: EXTRA_SERVICE.UPDATE_ORDER_STATUS.CLEAR
});

export const getExtraServiceOrderTotalRecordHandle = payload => ({
  type: EXTRA_SERVICE.GET_TOTAL_RECORD.HANDLER,
  payload
});

export const getExtraServiceOrderTotalRecordSuccess = payload => ({
  type: EXTRA_SERVICE.GET_TOTAL_RECORD.SUCCESS,
  payload
});

export const getExtraServiceOrderTotalRecordFailure = payload => ({
  type: EXTRA_SERVICE.GET_TOTAL_RECORD.FAILURE,
  payload
});

export const getExtraServiceOrderTotalRecordClear = () => ({
  type: EXTRA_SERVICE.GET_TOTAL_RECORD.CLEAR
});

export const createExtraServicePaymentTransactionHandle = payload => ({
  type: EXTRA_SERVICE.CREATE_EXTRA_SERVICE_PAYMENT_TRANSACTION.HANDLER,
  payload
});

export const editExtraServiceOrderHandle = payload => ({
  type: EXTRA_SERVICE.EDIT_ORDER.HANDLER,
  payload
});

export const editExtraServiceOrderSuccess = payload => ({
  type: EXTRA_SERVICE.EDIT_ORDER.SUCCESS,
  payload
});

export const editExtraServiceOrderFailure = payload => ({
  type: EXTRA_SERVICE.EDIT_ORDER.FAILURE,
  payload
});

export const getAddedOrderFormForCreateHandle = payload => ({
  type: EXTRA_SERVICE.GET_ADDED_ORDER_FORM_FOR_CREATE.HANDLER,
  payload
});

export const getAddedOrderFormForCreateSuccess = payload => ({
  type: EXTRA_SERVICE.GET_ADDED_ORDER_FORM_FOR_CREATE.SUCCESS,
  payload
});

export const getAddedOrderFormForCreateFailure = payload => ({
  type: EXTRA_SERVICE.GET_ADDED_ORDER_FORM_FOR_CREATE.FAILURE,
  payload
});

export const getAddedOrderFormForCreateClear = payload => ({
  type: EXTRA_SERVICE.GET_ADDED_ORDER_FORM_FOR_CREATE.CLEAR,
  payload
});
