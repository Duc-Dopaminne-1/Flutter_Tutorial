import { Action } from 'redux';
import reducer from './reducer';
import { RegisterDeviceParam } from '@goldfishcode/noir-caesar-api-sdk/libs/api/notification';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';

export enum ActionTypes {
  GET_BADGE = 'GET_BADGE',
  SAVE_BADGE = 'SAVE_BADGE',

  REGISTER_TOKEN = 'REGISTER_TOKEN',
  UNREGISTER_TOKEN = 'UNREGISTER_TOKEN',

  GET_NOTIFICATIONS_DETAIL = 'GET_NOTIFICATIONS_DETAIL',
  MARK_READ_ALL_NOTIFICATIONS = 'MARK_READ_ALL_NOTIFICATIONS',
}

export interface INotificationState {
  badge: number;
}

// Payloads
export interface IActionSaveBadgePayload {
  badge: number;
}

export interface IActionRegisterTokenPayload extends IActionCallback {
  param: RegisterDeviceParam;
}

export interface IActionUnregisterTokenPayload extends IActionCallback {
  registrationID: string;
}

export interface IActionGetNotificationsDetailPayload extends IActionCallback {
  notificationId: string;
}

export type IActionMarkReadAllNotificationsPayload = IActionCallback

// Actions
export interface IActionGetBadge extends Action {
  type: ActionTypes.GET_BADGE;
  payload: IActionCallback;
}

export interface IActionSaveBadge extends Action {
  type: ActionTypes.SAVE_BADGE;
  payload: IActionSaveBadgePayload;
}

export interface IActionRegisterToken extends Action {
  type: ActionTypes.REGISTER_TOKEN;
  payload: IActionRegisterTokenPayload;
}

export interface IActionUnregisterToken extends Action {
  type: ActionTypes.UNREGISTER_TOKEN;
  payload: IActionUnregisterTokenPayload;
}

export interface IActionGetNotificationsDetail extends Action {
  type: ActionTypes.GET_NOTIFICATIONS_DETAIL;
  payload: IActionGetNotificationsDetailPayload;
}

export interface IActionMarkReadAllNotifications extends Action {
  type: ActionTypes.GET_NOTIFICATIONS_DETAIL;
  payload: IActionMarkReadAllNotificationsPayload;
}

export type IActionNotifications =
  | IActionGetBadge
  | IActionSaveBadge
  | IActionRegisterToken
  | IActionUnregisterToken
  | IActionResetAllState
  | IActionGetNotificationsDetail;

export { reducer };
