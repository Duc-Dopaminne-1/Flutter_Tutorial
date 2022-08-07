import { ORDER } from '../actionsType';

export const setOrderNewFlagHandle = payload => ({
  type: ORDER.SET_ORDER_NEW_FLAG.HANDLER,
  payload
});

export const setOrderNewFlagSuccess = payload => ({
  type: ORDER.SET_ORDER_NEW_FLAG.SUCCESS,
  payload
});

export const setOrderNewFlagFailure = payload => ({
  type: ORDER.SET_ORDER_NEW_FLAG.FAILURE,
  payload
});

export const getOrderListHandle = payload => ({
  type: ORDER.GET_ORDER_LIST.HANDLER,
  payload
});

export const getOrderListSuccess = payload => ({
  type: ORDER.GET_ORDER_LIST.SUCCESS,
  payload
});

export const getOrderListFailure = payload => ({
  type: ORDER.GET_ORDER_LIST.FAILURE,
  payload
});

export const getOrderListClear = payload => ({
  type: ORDER.GET_ORDER_LIST.CLEAR,
  payload
});

export const getOrderDetailHandle = payload => ({
  type: ORDER.GET_ORDER_DETAIL.HANDLER,
  payload
});

export const getOrderDetailSuccess = payload => ({
  type: ORDER.GET_ORDER_DETAIL.SUCCESS,
  payload
});

export const getOrderDetailFailure = payload => ({
  type: ORDER.GET_ORDER_DETAIL.FAILURE,
  payload
});

export const clearOrderDetail = () => ({
  type: ORDER.GET_ORDER_DETAIL.CLEAR
});

export const updateOrderStatusHandle = payload => ({
  type: ORDER.UPDATE_ORDER_STATUS.HANDLER,
  payload
});

export const updateOrderStatusSuccess = payload => ({
  type: ORDER.UPDATE_ORDER_STATUS.SUCCESS,
  payload
});

export const updateOrderStatusFailure = payload => ({
  type: ORDER.UPDATE_ORDER_STATUS.FAILURE,
  payload
});

export const clearUpdateOrderStatus = () => ({
  type: ORDER.UPDATE_ORDER_STATUS.CLEAR
});

export const getOrderTotalRecordHandle = payload => ({
  type: ORDER.GET_TOTAL_RECORD.HANDLER,
  payload
});

export const getOrderTotalRecordSuccess = payload => ({
  type: ORDER.GET_TOTAL_RECORD.SUCCESS,
  payload
});

export const getOrderTotalRecordFailure = payload => ({
  type: ORDER.GET_TOTAL_RECORD.FAILURE,
  payload
});

export const getOrderTotalRecordClear = () => ({
  type: ORDER.GET_TOTAL_RECORD.CLEAR
});

/**
 * Delete Order Actions
 * @param {Object} payload parameters
 * @returns
 */
export const deleteOrderHandle = payload => ({
  type: ORDER.DELETE_ORDER.HANDLER,
  payload
});

export const deleteOrderSuccess = payload => ({
  type: ORDER.DELETE_ORDER.SUCCESS,
  payload
});

export const deleteOrderFailure = payload => ({
  type: ORDER.DELETE_ORDER.FAILURE,
  payload
});

export const deleteOrderClear = () => ({
  type: ORDER.DELETE_ORDER.CLEAR
});
