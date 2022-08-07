import {
  ActionDeleteAllNotification,
  ActionDeleteOne,
  ActionDeleteOnePayload,
  ActionGetNotification,
  ActionGetNotificationPayload,
  ActionGetNotificationSetting,
  ActionGetTotalUnread,
  ActionInitNotification,
  ActionInitNotificationPayload,
  ActionReadAll,
  ActionReadOne,
  ActionReadOnePayload,
  ActionResetNotification,
  ActionSaveNotification,
  ActionSaveNotificationPayload,
  ActionSaveNotificationSetting,
  ActionSaveNotificationSettingPayload,
  ActionSetFCMToken,
  ActionSetFCMTokenPayload,
  ActionSetNotificationSetting,
  ActionSetNotificationSettingPayload,
  ActionSetStatusDeeplink,
  ActionSetTotalUnread,
  ActionSetTotalUnreadPayload,
  ActionTypes,
} from './index';
import { ActionCallback } from '@/redux/auth';

export function setFCMToken(payload: ActionSetFCMTokenPayload): ActionSetFCMToken {
  return {
    type: ActionTypes.SET_FCM_TOKEN,
    payload,
  };
}

export function getNotification(payload: ActionGetNotificationPayload): ActionGetNotification {
  return {
    type: ActionTypes.GET_NOTIFICATION,
    payload,
  };
}

export function loadMoreNotification(payload: ActionSaveNotificationPayload): ActionSaveNotification {
  return {
    type: ActionTypes.LOAD_MORE_NOTIFICATION,
    payload,
  };
}

export function initNotification(payload: ActionInitNotificationPayload): ActionInitNotification {
  return {
    type: ActionTypes.INIT_NOTIFICATION,
    payload,
  };
}

export function getTotalUnRead(payload: ActionCallback): ActionGetTotalUnread {
  return {
    type: ActionTypes.GET_TOTAL_UNREAD,
    payload,
  };
}

export function setTotalUnRead(payload: ActionSetTotalUnreadPayload): ActionSetTotalUnread {
  return {
    type: ActionTypes.SET_TOTAL_UNREAD,
    payload,
  };
}

export function readAll(payload: ActionCallback): ActionReadAll {
  return {
    type: ActionTypes.READ_ALL,
    payload,
  };
}

export function readOne(payload: ActionReadOnePayload): ActionReadOne {
  return {
    type: ActionTypes.READ_ONE,
    payload,
  };
}

export function deleteOne(payload: ActionDeleteOnePayload): ActionDeleteOne {
  return {
    type: ActionTypes.DELETE_ONE,
    payload,
  };
}

export function getNotificationSetting(): ActionGetNotificationSetting {
  return {
    type: ActionTypes.GET_NOTIFICATION_SETTING,
  };
}

export function saveNotificationSetting(payload: ActionSaveNotificationSettingPayload): ActionSaveNotificationSetting {
  return {
    type: ActionTypes.SAVE_NOTIFICATION_SETTING,
    payload,
  };
}

export function setNotificationSetting(payload: ActionSetNotificationSettingPayload): ActionSetNotificationSetting {
  return {
    type: ActionTypes.SET_NOTIFICATION_SETTING,
    payload,
  };
}

export function setStatusDeeplink(): ActionSetStatusDeeplink {
  return {
    type: ActionTypes.SET_STATUS_DEEPLINK,
  };
}

export function deleteAllNotification(payload: ActionCallback): ActionDeleteAllNotification {
  return {
    type: ActionTypes.DELETE_ALL_NOTIFICATION,
    payload,
  };
}

export function resetNotification(): ActionResetNotification {
  return {
    type: ActionTypes.RESET_NOTIFICATION,
  };
}
