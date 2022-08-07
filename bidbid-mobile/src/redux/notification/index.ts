import { Action } from 'redux';
import { ActionCallback } from '@/redux/auth';
import { NotificationSetting } from '@/models/notification';

// Action Types
export enum ActionTypes {
  LOG_OUT = 'LOG_OUT',
  SET_FCM_TOKEN = 'SET_FCM_TOKEN',
  GET_NOTIFICATION = 'GET_NOTIFICATION',
  LOAD_MORE_NOTIFICATION = 'LOAD_MORE_NOTIFICATION',
  INIT_NOTIFICATION = 'INIT_NOTIFICATION',
  GET_TOTAL_UNREAD = 'GET_TOTAL_UNREAD',
  SET_TOTAL_UNREAD = 'SET_TOTAL_UNREAD',
  READ_ALL = 'READ_ALL',
  READ_ONE = 'READ_ONE',
  DELETE_ONE = 'DELETE_ONE',
  GET_NOTIFICATION_SETTING = 'GET_NOTIFICATION_SETTING',
  SAVE_NOTIFICATION_SETTING = 'SAVE_NOTIFICATION_SETTING',
  SET_NOTIFICATION_SETTING = 'SET_NOTIFICATION_SETTING',
  SET_STATUS_DEEPLINK = 'SET_STATUS_DEEPLINK',
  DELETE_ALL_NOTIFICATION = 'DELETE_ALL_NOTIFICATION',
  RESET_NOTIFICATION = 'RESET_NOTIFICATION',
}

export interface ActionLogout extends Action {
  type: ActionTypes.LOG_OUT;
}

export interface ActionSetFCMTokenPayload extends ActionCallback {
  os: string;
  token: string;
}

export interface ActionSetFCMToken extends Action {
  type: ActionTypes.SET_FCM_TOKEN;
  payload: ActionSetFCMTokenPayload;
}

export interface ActionGetNotificationPayload extends ActionCallback {
  page: number;
  isRefresh?: boolean;
}

export interface ActionGetNotification extends Action {
  type: ActionTypes.GET_NOTIFICATION;
  payload: ActionGetNotificationPayload;
}

export interface ActionSaveNotificationPayload extends ActionCallback {
  data: [];
  page?: number;
}

export interface ActionSaveNotification extends Action {
  type: ActionTypes.LOAD_MORE_NOTIFICATION;
  payload: ActionSaveNotificationPayload;
}

export interface ActionInitNotificationPayload extends ActionCallback {
  data: [];
}

export interface ActionInitNotification extends Action {
  type: ActionTypes.INIT_NOTIFICATION;
  payload: ActionInitNotificationPayload;
}

export interface ActionGetTotalUnread extends Action {
  type: ActionTypes.GET_TOTAL_UNREAD;
  payload: ActionCallback;
}

export interface ActionSetTotalUnreadPayload extends ActionCallback {
  unread: number;
}

export interface ActionSetTotalUnread extends Action {
  type: ActionTypes.SET_TOTAL_UNREAD;
  payload: ActionSetTotalUnreadPayload;
}

export interface ActionReadAll extends Action {
  type: ActionTypes.READ_ALL;
  payload: ActionCallback;
}

export interface ActionReadOnePayload extends ActionCallback {
  id: string;
}

export interface ActionReadOne extends Action {
  type: ActionTypes.READ_ONE;
  payload: ActionReadOnePayload;
}

export interface ActionDeleteOnePayload extends ActionCallback {
  id: string;
}

export interface ActionDeleteOne extends Action {
  type: ActionTypes.DELETE_ONE;
  payload: ActionDeleteOnePayload;
}

export interface ActionGetNotificationSetting extends Action {
  type: ActionTypes.GET_NOTIFICATION_SETTING;
}

export interface ActionSaveNotificationSettingPayload extends ActionCallback {
  data: NotificationSetting[];
}

export interface ActionSaveNotificationSetting extends Action {
  type: ActionTypes.SAVE_NOTIFICATION_SETTING;
  payload: ActionSaveNotificationSettingPayload;
}

export interface ActionSetNotificationSettingPayload extends ActionCallback {
  type: string;
  value: boolean;
}

export interface ActionSetNotificationSetting extends Action {
  type: ActionTypes.SET_NOTIFICATION_SETTING;
  payload: ActionSetNotificationSettingPayload;
}

export interface ActionResetNotification extends Action {
  type: ActionTypes.RESET_NOTIFICATION;
}

export interface ActionDeleteAllNotification extends Action {
  type: ActionTypes.DELETE_ALL_NOTIFICATION;
  payload: ActionCallback;
}

export interface ActionSetStatusDeeplink extends Action {
  type: ActionTypes.SET_STATUS_DEEPLINK;
}

export type NotificationAction =
  | ActionSetStatusDeeplink
  | ActionLogout
  | ActionGetTotalUnread
  | ActionSetTotalUnread
  | ActionDeleteOne
  | ActionSetFCMToken
  | ActionGetNotification
  | ActionSetNotificationSetting
  | ActionSaveNotificationSetting
  | ActionSaveNotification
  | ActionReadAll
  | ActionResetNotification
  | ActionGetNotificationSetting
  | ActionDeleteAllNotification
  | ActionInitNotification;
