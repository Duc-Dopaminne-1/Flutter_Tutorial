import reducer from './reducer';
import { Action } from 'redux';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { IAddress, IShippingMethod, ICountry, IOrder } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { CheckOutParams } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';

export enum ActionTypes {
  SAVE_SHIPPING_ADDRESS = 'SAVE_SHIPPING_ADDRESS',
  SAVE_BILLING_ADDRESS = 'SAVE_BILLING_ADDRESS',
  GET_SHIPPING_METHOD_LIST = 'GET_SHIPPING_METHOD_LIST',
  SAVE_SHIPPING_METHOD_LIST = 'SAVE_SHIPPING_METHOD_LIST',
  GET_COUNTRIES = 'GET_COUNTRIES',
  SAVE_COUNTRIES = 'SAVE_COUNTRIES',
  SAVE_SHIPPING_METHOD = 'SAVE_SHIPPING_METHOD',
  ADD_PROMO_CODE = 'ADD_PROMO_CODE',
  CHECK_OUT = 'CHECK_OUT',
  GET_ORDER_DETAIL = 'GET_ORDER_DETAIL',
  SAVE_ORDER = 'SAVE_ORDER',
  GET_LIST_ORDER = 'GET_LIST_ORDER',
  SAVE_LIST_ORDER = 'SAVE_LIST_ORDER',
  CLEAR_ORDER = 'CLEAR_ORDER',
  LOAD_MORE_LIST_ORDER = 'LOAD_MORE_LIST_ORDER',
  ADD_CARD = 'ADD_CARD',
}

export interface IPaymentState {
  shippingAddress: IAddress;
  billingAddress: IAddress;
  countries: ICountry[];
  shippingMethodList: IShippingMethod[];
  shippingMethod?: IShippingMethod;
  orderList: IPagination<IOrder>;
  orderDetail?: IOrder;
}

// Payloads
export interface IActionSaveShippingAddressPayload {
  shippingAddress: IAddress;
}

export interface IActionSaveBillingAddressPayload {
  billingAddress: IAddress;
}

export interface IActionGetShippingMethodListPayload extends IActionCallback {
  data: IAddress;
}

export interface IActionSaveShippingMethodListPayload {
  results: IShippingMethod[];
}

export interface IActionGetCountriesPayload extends IActionCallback {
  name?: string;
}

export interface IActionSaveCountriesPayload {
  results: ICountry[];
}

export interface IActionSaveShippingMethodPayload {
  shippingMethod: IShippingMethod;
}

export interface IActionAddPromoCodePayload extends IActionCallback {
  promoCode: string;
}

export interface IActionCheckOutPayload extends IActionCallback {
  data: CheckOutParams;
}

export interface IActionGetOrderDetailPayload extends IActionCallback {
  order_id: number;
}

export interface IActionSaveOrderPayload {
  result: IOrder;
}

export interface IActionGetListOrderPayload extends IActionCallback {
  page?: number;
  limit?: number;
}

export interface IActionSaveListOrderPayload {
  orderList: IPagination<IOrder>;
}

export interface IActionLoadMoreListOrderPayload {
  orderList: IPagination<IOrder>;
}

export interface IActionAddCreditCardPayload extends IActionCallback {
  token: string;
}

// Actions
export interface IActionSaveShippingAddress extends Action {
  type: ActionTypes.SAVE_SHIPPING_ADDRESS;
  payload: IActionSaveShippingAddressPayload;
}

export interface IActionSaveBillingAddress extends Action {
  type: ActionTypes.SAVE_BILLING_ADDRESS;
  payload: IActionSaveBillingAddressPayload;
}

export interface IActionGetShippingMethodList extends Action {
  type: ActionTypes.GET_SHIPPING_METHOD_LIST;
  payload: IActionGetShippingMethodListPayload;
}

export interface IActionSaveShippingMethodList extends Action {
  type: ActionTypes.SAVE_SHIPPING_METHOD_LIST;
  payload: IActionSaveShippingMethodListPayload;
}

export interface IActionGetCountries extends Action {
  type: ActionTypes.GET_COUNTRIES;
  payload: IActionGetCountriesPayload;
}

export interface IActionSaveCountries extends Action {
  type: ActionTypes.SAVE_COUNTRIES;
  payload: IActionSaveCountriesPayload;
}

export interface IActionSaveShippingMethod extends Action {
  type: ActionTypes.SAVE_SHIPPING_METHOD;
  payload: IActionSaveShippingMethodPayload;
}

export interface IActionAddPromoCode extends Action {
  type: ActionTypes.ADD_PROMO_CODE;
  payload: IActionAddPromoCodePayload;
}

export interface IActionCheckOut extends Action {
  type: ActionTypes.CHECK_OUT;
  payload: IActionCheckOutPayload;
}

export interface IActionGetOrderDetail extends Action {
  type: ActionTypes.GET_ORDER_DETAIL;
  payload: IActionGetOrderDetailPayload;
}

export interface IActionSaveOrder extends Action {
  type: ActionTypes.SAVE_ORDER;
  payload: IActionSaveOrderPayload;
}

export interface IActionGetListOrder extends Action {
  type: ActionTypes.GET_LIST_ORDER;
  payload: IActionGetListOrderPayload;
}

export interface IActionSaveListOrder extends Action {
  type: ActionTypes.SAVE_LIST_ORDER;
  payload: IActionSaveListOrderPayload;
}

export interface IActionClearOrder extends Action {
  type: ActionTypes.CLEAR_ORDER;
}

export interface IActionLoadMoreListOrder extends Action {
  type: ActionTypes.LOAD_MORE_LIST_ORDER;
  payload: IActionLoadMoreListOrderPayload;
}

export interface IActionAddCreditCard extends Action {
  type: ActionTypes.ADD_CARD;
  payload: IActionAddCreditCardPayload;
}

export type IActionPayment =
  | IActionSaveShippingAddress
  | IActionSaveBillingAddress
  | IActionGetShippingMethodList
  | IActionSaveShippingMethodList
  | IActionGetCountries
  | IActionSaveCountries
  | IActionSaveShippingMethod
  | IActionAddPromoCode
  | IActionCheckOut
  | IActionGetOrderDetail
  | IActionSaveOrder
  | IActionGetListOrder
  | IActionSaveListOrder
  | IActionClearOrder
  | IActionLoadMoreListOrder
  | IActionAddCreditCard
  | IActionResetAllState;

export { reducer };
