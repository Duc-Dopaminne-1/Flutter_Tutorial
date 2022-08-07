import reducer from './reducer';
import { Action } from 'redux';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { ISubscription, ICoinsPackage, ISubscriptionPackage } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { SubscribeParams, PurchaseCoinsParams } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop';

export enum ActionTypes {
  GET_LIST_IAP_PRODUCT = 'GET_LIST_IAP_PRODUCT',
  GET_LIST_IAP_SUBSCRIPTION = 'GET_LIST_IAP_SUBSCRIPTION',
  SAVE_LIST_IAP_PRODUCT = 'SAVE_LIST_IAP_PRODUCT',
  SAVE_LIST_IAP_SUBSCRIPTION = 'SAVE_LIST_IAP_SUBSCRIPTION',
  GET_ACTIVE_PLAN = 'GET_ACTIVE_PLAN',
  SAVE_ACTIVE_PLAN = 'SAVE_ACTIVE_PLAN',
  BUY_COINS = 'BUY_COINS',
  REQUEST_SUBSCRIPTION = 'REQUEST_SUBSCRIPTION',
}

// Payloads
export type IActionGetListIAPProductPayload = IActionCallback;

export type IActionGetListIAPSubscriptionPayload = IActionCallback;

export type IActionGetActivePlanPayload = IActionCallback;

export interface IActionSaveListIAPProductPayload extends IActionCallback {
  products: ICoinsPackage[];
}

export interface IActionSaveListIAPSubscriptionPayload extends IActionCallback {
  subscriptions: ISubscriptionPackage[];
}

export interface IActionBuyCoinsPayload extends IActionCallback {
  data: PurchaseCoinsParams;
}

export interface IActionRequestSubscriptionPayload extends IActionCallback {
  data: SubscribeParams;
}

export interface IActionSaveActivePlanPayload extends IActionCallback {
  activePlan: ISubscription;
}

// Actions
export interface IActionGetListIAPProduct extends Action {
  type: ActionTypes.GET_LIST_IAP_PRODUCT;
  payload: IActionGetListIAPProductPayload;
}

export interface IActionGetListIAPSubscription extends Action {
  type: ActionTypes.GET_LIST_IAP_SUBSCRIPTION;
  payload: IActionGetListIAPSubscriptionPayload;
}

export interface IActionGetActivePlan extends Action {
  type: ActionTypes.GET_ACTIVE_PLAN;
  payload: IActionGetActivePlanPayload;
}

export interface IActionSaveListIAPProduct extends Action {
  type: ActionTypes.SAVE_LIST_IAP_PRODUCT;
  payload: IActionSaveListIAPProductPayload;
}

export interface IActionSaveListIAPSubscription extends Action {
  type: ActionTypes.SAVE_LIST_IAP_SUBSCRIPTION;
  payload: IActionSaveListIAPSubscriptionPayload;
}

export interface IActionBuyCoins extends Action {
  type: ActionTypes.BUY_COINS;
  payload: IActionBuyCoinsPayload;
}

export interface IActionRequestSubscription extends Action {
  type: ActionTypes.REQUEST_SUBSCRIPTION;
  payload: IActionRequestSubscriptionPayload;
}

export interface IActionSaveActivePlan extends Action {
  type: ActionTypes.SAVE_ACTIVE_PLAN;
  payload: IActionSaveActivePlanPayload;
}

export type IActionIAP =
  | IActionGetListIAPProduct
  | IActionGetActivePlan
  | IActionSaveListIAPProduct
  | IActionSaveListIAPSubscription
  | IActionBuyCoins
  | IActionRequestSubscription
  | IActionSaveActivePlan
  | IActionResetAllState;

export { reducer };
