import { Action } from 'redux';
/*
 * Import * as actions from './actions';
 * import { reducer } from './reducer';
 */
import { PlatForm } from '@reup/reup-api-sdk/libs/type';
// Import * as saga from './saga';

export enum ActionTypes {
  GET_BADGE = 'GET_BADGE',
  GET_BADGE_SUCCESS = 'GET_BADGE_SUCCESS',
  GET_BADGE_FAILURE = 'GET_BADGE_FAILURE',

  REGISTER_TOKEN = 'REGISTER_TOKEN',
  UNREGISTER_TOKEN = 'UNREGISTER_TOKEN',

  GET_NOTIFICATIONS = 'GET_NOTIFICATIONS',
  GET_NOTIFICATIONS_SUCCESS = 'GET_NOTIFICATIONS_SUCCESS',
  GET_NOTIFICATIONS_FAILURE = 'GET_NOTIFICATIONS_FAILURE',
  READ_NOTIFICATION = 'READ_NOTIFICATION',
  READ_NOTIFICATION_SUCCESS = 'READ_NOTIFICATION_SUCCESS',
  READ_NOTIFICATION_FAILURE = 'READ_NOTIFICATION_FAILURE',

  ARCHIVE_NOTIFICATION = 'ARCHIVE_NOTIFICATION',
  ARCHIVE_NOTIFICATION_SUCCESS = 'ARCHIVE_NOTIFICATION_SUCCESS',

  DELETE_NOTIFICATION = 'DELETE_NOTIFICATION',
  DELETE_NOTIFICATION_SUCCESS = 'DELETE_NOTIFICATION_SUCCESS',

  ARCHIVE_ALL_NOTIFICATION = 'ARCHIVE_ALL_NOTIFICATION',
  ARCHIVE_ALL_NOTIFICATION_SUCCESS = 'ARCHIVE_ALL_NOTIFICATION_SUCCESS',

  MARK_READ_ALL_NOTIFICATION = 'MARK_READ_ALL_NOTIFICATION',
  MARK_READ_ALL_NOTIFICATION_SUCCESS = 'MARK_READ_ALL_NOTIFICATION_SUCCESS',

  MARK_READ_NOTIFICATION_SUCCESS = 'MARK_READ_NOTIFICATION_SUCCESS',
}

export interface IPagination<T> {
  count: number;
  results: Array<T>;
  next?: string;
  previous?: string;
}

export interface INotificationCategory {
  id: string;
  name: string;
}

export interface INotification {
  id: string;
  verb?: string;
  content: string;
  created: Date;
  read: boolean;
  title: string;
  actor?: IUser;
  category: INotificationCategory;
  badge: number;
}

export interface NotificationsState {
  [id: string]: INotificationsState;
}

export interface IUser {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio?: string;
  phone?: string;
  avatar?: string;
  display_name?: string;
}

export interface ILocalNotificationState {
  total: number;
  notifications: any[];
}

export type INotificationsState = INotification;

export interface IError {
  message: string;
  code: number;
  data?: any;
}

export interface IActionCallback {
  onSuccess?: (notifications?: INotificationsState) => void;
  onFail?: (error?: IError) => void;
}

export interface IGetNotificationsActionPayload extends IActionCallback {
  q?: string;
  page: number;
  limit: number;
}

export interface IGetNotificationsAction extends Action {
  type: ActionTypes.GET_NOTIFICATIONS;
  payload: IGetNotificationsActionPayload;
}

export interface IGetNotificationsSuccessActionPayload {
  currentPage: number;
  data: INotification[];
  canLoadMore: boolean;
}

export interface IGetNotificationsSuccessAction extends Action {
  type: ActionTypes.GET_NOTIFICATIONS_SUCCESS;
  payload: IGetNotificationsSuccessActionPayload;
}

export interface IGetNotificationsFailureAction extends Action {
  type: ActionTypes.GET_NOTIFICATIONS_FAILURE;
  payload: IError;
}

export interface GetBadgeSuccessPayload {
  badge: number;
}

export interface MarkReadAllNotificationSuccessPayload {
  badge: number;
}

export interface MarkReadNotificationPayload {
  id: string;
}
export interface ArchiveNotificationPayload {
  id: string;
}
export interface DeleteNotificationPayload {
  id: string;
}

export interface RegisterTokenPayload {
  deviceName: string;
  registrationID: string;
  deviceID: string;
  type: PlatForm;
}

export interface IReadNotificationActionPayload extends IActionCallback {
  ids: string[];
  callBack: Function;
}
export interface IGetBadgeActionPayload extends IActionCallback {
  callBack: Function;
}
export interface IArchiveNotificationActionPayload extends IActionCallback {
  ids: string[];
  callBack: Function;
}
export interface IMarkReadAllNotificationActionPayload extends IActionCallback {
  callBack: Function;
}
export interface IArchiveAllNotificationActionPayload extends IActionCallback {
  callBack: Function;
}
export interface IDeleteNotificationActionPayload extends IActionCallback {
  ids: string[];
}
export interface UnregisterTokenActionPayload extends IActionCallback {
  registrationID: string;
  callBackSuccess?: Function;
  callBackFailure?: Function;
}

export interface IReadNotificationAction extends Action {
  type: ActionTypes.READ_NOTIFICATION;
  payload: IReadNotificationActionPayload;
}

export interface IArchiveNotificationAction extends Action {
  type: ActionTypes.ARCHIVE_NOTIFICATION;
  payload: IArchiveNotificationActionPayload;
}
export interface IMarkReadAllNotificationAction extends Action {
  type: ActionTypes.MARK_READ_ALL_NOTIFICATION;
  payload: IMarkReadAllNotificationActionPayload;
}
export interface IArchiveAllNotificationAction extends Action {
  type: ActionTypes.ARCHIVE_ALL_NOTIFICATION;
  payload: IArchiveAllNotificationActionPayload;
}

export interface IDeleteNotificationAction extends Action {
  type: ActionTypes.DELETE_NOTIFICATION;
  payload: IDeleteNotificationActionPayload;
}
export interface IGetBadgeAction extends Action {
  type: ActionTypes.GET_BADGE;
  payload: IGetBadgeActionPayload;
}

export interface UnregisterTokenAction extends Action {
  type: ActionTypes.UNREGISTER_TOKEN;
  payload: UnregisterTokenActionPayload
};

export interface IReadNotificationSuccessActionPayload {
  data: number[];
  canLoadMore: boolean;
}

export interface IReadNotificationsSuccessAction extends Action {
  type: ActionTypes.READ_NOTIFICATION_SUCCESS;
  payload: IReadNotificationSuccessActionPayload;
}

export interface IReadNotificationFailureAction extends Action {
  type: ActionTypes.READ_NOTIFICATION_FAILURE;
  payload: IError;
}

export interface GetBadgeAction extends Action {
  type: ActionTypes.GET_BADGE;
}

export interface GetBadgeSuccessAction {
  type: ActionTypes.GET_BADGE_SUCCESS;
  payload: GetBadgeSuccessPayload;
}

export interface MarkReadNotificationSuccessAction {
  type: ActionTypes.MARK_READ_NOTIFICATION_SUCCESS;
  payload: MarkReadNotificationPayload;
}

export interface ArchiveNotificationSuccessAction {
  type: ActionTypes.ARCHIVE_NOTIFICATION_SUCCESS;
  payload: ArchiveNotificationPayload;
}
export interface MarkReadAllNotificationSuccessAction {
  type: ActionTypes.MARK_READ_ALL_NOTIFICATION_SUCCESS;
  payload: MarkReadAllNotificationSuccessPayload;
}

export type INotificationsAction =
  | IGetNotificationsAction
  | IGetNotificationsSuccessAction
  | IGetNotificationsFailureAction
  | IReadNotificationAction
  | IReadNotificationsSuccessAction
  | IReadNotificationFailureAction
  | GetBadgeAction
  | GetBadgeSuccessAction
  | MarkReadNotificationSuccessAction
  | ArchiveNotificationSuccessAction
  | MarkReadAllNotificationSuccessAction;

export type IGetNotifications = (
  page?: number | undefined,
  limit?: number | undefined,
  q?: string | undefined,
) => Promise<IPagination<INotification>>;
export type IGetNotificationsSuccess = (payload: IGetNotificationsSuccessActionPayload) => IGetNotificationsSuccessAction;
export type IGetNotificationsFailure = (payload: IError) => IGetNotificationsFailureAction;
export type IReadNotification = (payload: IReadNotificationActionPayload) => IReadNotificationAction;
export type IArchiveNotification = (payload: IArchiveNotificationActionPayload) => IArchiveNotificationAction;
export type IReadNotificationsSuccess = (payload: IGetNotificationsSuccessActionPayload) => IReadNotificationsSuccessAction;
export type IReadNotificationFailure = (payload: IError) => IReadNotificationFailureAction;
export type IGetBadge = (payload: IGetBadgeActionPayload) => GetBadgeAction;

export interface INotificationsDispatch {
  getNotifications: IGetNotifications;
  readNotification: IReadNotification;
}
