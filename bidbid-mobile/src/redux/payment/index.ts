import { Action } from 'redux';
import { ActionCallback } from '@/redux/auth';

// Action Types
export enum ActionTypes {
  LOG_OUT = 'LOG_OUT',
  GET_CLIENT_TOKEN = 'GET_CLIENT_TOKEN',
  CREATE_CARD = 'CREATE_CARD',
  GET_ALL_PAYMENT = 'GET_ALL_PAYMENT',
  SAVE_ALL_PAYMENT = 'SAVE_ALL_PAYMENT',
  SET_PAYMENT_DEFAULT = 'SET_PAYMENT_DEFAULT',
  SET_RECEIVED_DEFAULT = 'SET_RECEIVED_DEFAULT',
  DELETE_CARD = 'DELETE_CARD',
  UPDATE_CARD = 'UPDATE_CARD',
  UPDATE_PAYPAL = 'UPDATE_PAYPAL',
  GET_CLIENT_SECRET = 'GET_CLIENT_SECRET',
  GET_STATUS_PAYMENT = 'GET_STATUS_PAYMENT',
  GET_TRANSACTION_REQUIRE = 'GET_TRANSACTION_REQUIRE',
  GET_TRANSACTION_INFO = 'GET_TRANSACTION_INFO',
}

export interface ActionCreateCardPayload extends ActionCallback {
  paymentMethodId?: string;
  email?: string;
}

export interface ActionSaveAllPaymentPayload extends ActionCallback {
  type: string;
  expirationDate: string;
  id: number;
  last4: string;
  cardType: string;
  email?: string;
  cardholderName?: string;
  accountId?: string;
}

export interface ActionSetPaymentDefaultPayload extends ActionCallback {
  id: number;
}

export interface ActionDeleteCardPayload extends ActionCallback {
  id: number;
}

export interface ActionUpdateCardPayload extends ActionCallback {
  id: number;
  cvv?: string;
  expirationMonth: string;
  expirationYear: string;
  cardholderName: string;
}

export interface ActionGetClientToken extends Action {
  type: ActionTypes.GET_CLIENT_TOKEN;
  payload: ActionCallback;
}

export interface ActionCreateCard extends Action {
  type: ActionTypes.CREATE_CARD;
  payload: ActionCreateCardPayload;
}

export interface ActionUpdatePaypalPayload extends ActionCallback {
  id: string;
  email: string;
}

export interface ActionUpdatePaypal extends Action {
  type: ActionTypes.UPDATE_PAYPAL;
  payload: ActionUpdatePaypalPayload;
}

export interface ActionGetAllPayment extends Action {
  type: ActionTypes.GET_ALL_PAYMENT;
  payload: ActionCallback;
}

export interface ActionSaveAllPayment extends Action {
  type: ActionTypes.SAVE_ALL_PAYMENT;
  payload: ActionSaveAllPaymentPayload;
}

export interface ActionSetPaymentDefault extends Action {
  type: ActionTypes.SET_PAYMENT_DEFAULT;
  payload: ActionSetPaymentDefaultPayload;
}

export interface ActionSetReceivedDefaultPayload extends ActionCallback {
  id: number;
}

export interface ActionSetReceivedDefault extends Action {
  type: ActionTypes.SET_RECEIVED_DEFAULT;
  payload: ActionSetReceivedDefaultPayload;
}

export interface ActionDeleteCard extends Action {
  type: ActionTypes.DELETE_CARD;
  payload: ActionDeleteCardPayload;
}

export interface ActionUpdateCard extends Action {
  type: ActionTypes.UPDATE_CARD;
  payload: ActionUpdateCardPayload;
}

export interface ActionGetClientSecret extends Action {
  type: ActionTypes.GET_CLIENT_SECRET;
  payload: ActionCallback;
}

export interface ActionGetStatusPaymentPayload extends ActionCallback {
  transactionId: number;
}

export interface ActionGetStatusPayment extends Action {
  type: ActionTypes.GET_STATUS_PAYMENT;
  payload: ActionGetStatusPaymentPayload;
}

export interface ActionGetTransactionsInfoPayload extends ActionCallback {
  isFromAuctionDetail?: boolean;
  id: number | string;
}

export interface ActionGetTransactionsInfo extends Action {
  type: ActionTypes.GET_TRANSACTION_INFO;
  payload: ActionGetTransactionsInfoPayload;
}

export interface ActionGetTransactionsRequired extends Action {
  type: ActionTypes.GET_TRANSACTION_REQUIRE;
  payload: ActionCallback;
}

export interface ActionLogout extends Action {
  type: ActionTypes.LOG_OUT;
}

export type PaymentAction =
  | ActionUpdateCard
  | ActionGetClientToken
  | ActionCreateCard
  | ActionSetPaymentDefault
  | ActionSetReceivedDefault
  | ActionSaveAllPayment
  | ActionLogout;
