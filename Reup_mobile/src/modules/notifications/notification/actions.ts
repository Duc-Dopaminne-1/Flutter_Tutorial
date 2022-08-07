import {
  ActionTypes,
  ArchiveNotificationPayload,
  GetBadgeSuccessPayload,
  IArchiveNotificationActionPayload,
  IError,
  IGetBadge,
  IGetBadgeActionPayload,
  IGetNotificationsAction,
  IGetNotificationsActionPayload,
  IGetNotificationsFailure,
  IGetNotificationsSuccess,
  IGetNotificationsSuccessActionPayload,
  IReadNotification,
  IReadNotificationActionPayload,
  MarkReadNotificationPayload,
  UnregisterTokenActionPayload,
  IMarkReadAllNotificationActionPayload,
  IMarkReadAllNotificationAction,
  MarkReadAllNotificationSuccessPayload,
} from '../index';
import { PlatForm } from '@reup/reup-api-sdk/libs/type';

export function getNotifications(payload: IGetNotificationsActionPayload): IGetNotificationsAction {
  return {
    type: ActionTypes.GET_NOTIFICATIONS,
    payload,
  };
}

export const getNotificationsSuccess: IGetNotificationsSuccess = (payload: IGetNotificationsSuccessActionPayload) => ({
  type: ActionTypes.GET_NOTIFICATIONS_SUCCESS,
  payload,
});

export const getNotificationsFailure: IGetNotificationsFailure = (payload: IError) => ({
  type: ActionTypes.GET_NOTIFICATIONS_FAILURE,
  payload,
});

export const readNotification = (payload: IReadNotificationActionPayload) => ({
  type: ActionTypes.READ_NOTIFICATION,
  payload,
});

export const archiveNotification = (payload: IArchiveNotificationActionPayload) => ({
  type: ActionTypes.ARCHIVE_NOTIFICATION,
  payload,
});

export const archiveAllNotification = (callBack: Function) => ({
  type: ActionTypes.ARCHIVE_ALL_NOTIFICATION,
  payload: {
    callBack,
  },
});

export function markReadAllNotification(payload: IMarkReadAllNotificationActionPayload): IMarkReadAllNotificationAction {
  return {
    type: ActionTypes.MARK_READ_ALL_NOTIFICATION,
    payload,
  };
};

export const readNotificationSuccess: IReadNotification = (payload: IReadNotificationActionPayload) => ({
  type: ActionTypes.READ_NOTIFICATION,
  payload,
});

export const readNotificationFailure: IReadNotification = (payload: IReadNotificationActionPayload) => ({
  type: ActionTypes.READ_NOTIFICATION,
  payload,
});

export const getBadge: IGetBadge = (payload: IGetBadgeActionPayload) => ({
  type: ActionTypes.GET_BADGE,
  payload,
});

export const registerToken = (deviceName: string, registrationID: string, deviceID: string, type: PlatForm) => ({
  type: ActionTypes.REGISTER_TOKEN,
  payload: {
    deviceName,
    registrationID,
    deviceID,
    type,
  },
});

export const unregisterToken = (payload: UnregisterTokenActionPayload) => ({
  type: ActionTypes.UNREGISTER_TOKEN,
  payload,
});

export const getBadgeSuccess = (payload: GetBadgeSuccessPayload) => ({
  type: ActionTypes.GET_BADGE_SUCCESS,
  payload,
});

export const markReadNotificationSuccess = (payload: MarkReadNotificationPayload) => ({
  type: ActionTypes.MARK_READ_NOTIFICATION_SUCCESS,
  payload,
});

export const archiveNotificationSuccess = (payload: ArchiveNotificationPayload) => ({
  type: ActionTypes.ARCHIVE_NOTIFICATION_SUCCESS,
  payload,
});

export const markReadAllNotificationSuccess = (payload: MarkReadAllNotificationSuccessPayload) => ({
  type: ActionTypes.MARK_READ_ALL_NOTIFICATION_SUCCESS,
  payload,
});
