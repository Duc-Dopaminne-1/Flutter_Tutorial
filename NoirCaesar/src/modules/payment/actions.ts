import {
  ActionTypes,
  IActionSaveShippingAddressPayload,
  IActionGetShippingMethodListPayload,
  IActionSaveShippingMethodListPayload,
  IActionGetCountriesPayload,
  IActionSaveCountriesPayload,
  IActionSaveShippingMethodPayload,
  IActionSaveBillingAddressPayload,
  IActionAddPromoCodePayload,
  IActionCheckOutPayload,
  IActionGetListOrderPayload,
  IActionSaveListOrderPayload,
  IActionAddCreditCardPayload,
  IActionSaveOrderPayload,
  IActionLoadMoreListOrderPayload,
  IActionGetOrderDetailPayload,
} from './index';

const saveShippingAddress = (payload: IActionSaveShippingAddressPayload) => ({
  type: ActionTypes.SAVE_SHIPPING_ADDRESS,
  payload,
});

const saveBillingAddress = (payload: IActionSaveBillingAddressPayload) => ({
  type: ActionTypes.SAVE_BILLING_ADDRESS,
  payload,
});

const getShippingMethodList = (payload: IActionGetShippingMethodListPayload) => ({
  type: ActionTypes.GET_SHIPPING_METHOD_LIST,
  payload,
});

const saveShippingMethodList = (payload: IActionSaveShippingMethodListPayload) => ({
  type: ActionTypes.SAVE_SHIPPING_METHOD_LIST,
  payload,
});

const getCountries = (payload: IActionGetCountriesPayload) => ({
  type: ActionTypes.GET_COUNTRIES,
  payload,
});

const saveCountries = (payload: IActionSaveCountriesPayload) => ({
  type: ActionTypes.SAVE_COUNTRIES,
  payload,
});

const saveShippingMethod = (payload: IActionSaveShippingMethodPayload) => ({
  type: ActionTypes.SAVE_SHIPPING_METHOD,
  payload,
});

const addPromoCode = (payload: IActionAddPromoCodePayload) => ({
  type: ActionTypes.ADD_PROMO_CODE,
  payload,
});

const checkOut = (payload: IActionCheckOutPayload) => ({
  type: ActionTypes.CHECK_OUT,
  payload,
});

const getOrderDetail = (payload: IActionGetOrderDetailPayload) => ({
  type: ActionTypes.GET_ORDER_DETAIL,
  payload,
});

const saveOrder = (payload: IActionSaveOrderPayload) => ({
  type: ActionTypes.SAVE_ORDER,
  payload,
});

const getListOrder = (payload: IActionGetListOrderPayload) => ({
  type: ActionTypes.GET_LIST_ORDER,
  payload,
});

const saveListOrder = (payload: IActionSaveListOrderPayload) => ({
  type: ActionTypes.SAVE_LIST_ORDER,
  payload,
});

const clearOrder = () => ({
  type: ActionTypes.CLEAR_ORDER,
});

const loadMoreListOrder = (payload: IActionLoadMoreListOrderPayload) => ({
  type: ActionTypes.LOAD_MORE_LIST_ORDER,
  payload,
});

const addCreditCard = (payload: IActionAddCreditCardPayload) => ({
  type: ActionTypes.ADD_CARD,
  payload,
});

export {
  saveShippingAddress,
  saveBillingAddress,
  getShippingMethodList,
  saveShippingMethodList,
  getCountries,
  saveShippingMethod,
  saveCountries,
  addPromoCode,
  checkOut,
  getOrderDetail,
  saveOrder,
  getListOrder,
  saveListOrder,
  clearOrder,
  loadMoreListOrder,
  addCreditCard,
};
