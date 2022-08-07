import { NOTIFICATION } from '../actionsType';

export const getAllNotificationsHandle = payload => ({
  type: NOTIFICATION.GET_ALL_NOTIFICATION.HANDLER,
  payload
});

export const getAllNotificationsSuccess = payload => ({
  type: NOTIFICATION.GET_ALL_NOTIFICATION.SUCCESS,
  payload
});

export const getAllNotificationsFailure = payload => ({
  type: NOTIFICATION.GET_ALL_NOTIFICATION.FAILURE,
  payload
});

export const getGeneralNotificationsHandle = payload => ({
  type: NOTIFICATION.GET_GENERAL_NOTIFICATION.HANDLER,
  payload
});

export const getGeneralNotificationsSuccess = payload => ({
  type: NOTIFICATION.GET_GENERAL_NOTIFICATION.SUCCESS,
  payload
});

export const getGeneralNotificationsFailure = payload => ({
  type: NOTIFICATION.GET_GENERAL_NOTIFICATION.FAILURE,
  payload
});

/**
 * ===== Get private notification actions =====
 */
export const getPrivateNotificationsHandle = payload => ({
  type: NOTIFICATION.GET_PRIVATE_NOTIFICATION.HANDLER,
  payload
});

export const getPrivateNotificationsSuccess = payload => ({
  type: NOTIFICATION.GET_PRIVATE_NOTIFICATION.SUCCESS,
  payload
});

export const getPrivateNotificationsFailure = payload => ({
  type: NOTIFICATION.GET_PRIVATE_NOTIFICATION.FAILURE,
  payload
});

/**
 * ===== Delete notification actions =====
 */
export const getDeleteNotificationHandle = payload => ({
  type: NOTIFICATION.DELETE_NOTIFICATION.HANDLER,
  payload
});

export const getDeleteNotificationSuccess = payload => ({
  type: NOTIFICATION.DELETE_NOTIFICATION.SUCCESS,
  payload
});

export const getDeleteNotificationFailure = payload => ({
  type: NOTIFICATION.DELETE_NOTIFICATION.FAILURE,
  payload
});

/**
 * ===== read notification actions =====
 */
export const getReadNotificationHandle = payload => ({
  type: NOTIFICATION.READ_NOTIFICATION.HANDLER,
  payload
});

export const getReadNotificationSuccess = payload => ({
  type: NOTIFICATION.READ_NOTIFICATION.SUCCESS,
  payload
});

export const getReadNotificationFailure = payload => ({
  type: NOTIFICATION.READ_NOTIFICATION.FAILURE,
  payload
});

/**
 * ===== get notification setting actions =====
 */
export const getNotificationSettingHandle = payload => ({
  type: NOTIFICATION.GET_NOTIFICATION_SETTING.HANDLER,
  payload
});

export const getNotificationSettingSuccess = payload => ({
  type: NOTIFICATION.GET_NOTIFICATION_SETTING.SUCCESS,
  payload
});

export const getNotificationSettingFailure = payload => ({
  type: NOTIFICATION.GET_NOTIFICATION_SETTING.FAILURE,
  payload
});

/**
 * ===== update notification setting actions =====
 */
export const getUpdateNotificationSettingHandle = payload => ({
  type: NOTIFICATION.UPDATE_NOTIFICATION_SETTING.HANDLER,
  payload
});

export const getUpdateNotificationSettingSuccess = payload => ({
  type: NOTIFICATION.UPDATE_NOTIFICATION_SETTING.SUCCESS,
  payload
});

export const getUpdateNotificationSettingFailure = payload => ({
  type: NOTIFICATION.UPDATE_NOTIFICATION_SETTING.FAILURE,
  payload
});

export const saveUpdateNotificationSettingFailure = payload => ({
  type: NOTIFICATION.UPDATE_NOTIFICATION_SETTING.STORE,
  payload
});

/**
 * ===== Notification history  =====
 */
export const getGeneralNotificationHandle = payload => ({
  type: NOTIFICATION.GET_GENERAL_NOTIFICATION_HISTORY.HANDLER,
  payload
});

export const getGeneralNotificationSuccess = payload => ({
  type: NOTIFICATION.GET_GENERAL_NOTIFICATION_HISTORY.SUCCESS,
  payload
});

export const getGeneralNotificationFailure = payload => ({
  type: NOTIFICATION.GET_GENERAL_NOTIFICATION_HISTORY.FAILURE,
  payload
});

/**
 * ===== Change status notification history  =====
 */
export const changeStatusNotificationHistoryHandle = payload => ({
  type: NOTIFICATION.NOTIFICATION_HISTORY_CHANGE_STATUS.HANDLER,
  payload
});

export const changeStatusNotificationHistorySuccess = payload => ({
  type: NOTIFICATION.NOTIFICATION_HISTORY_CHANGE_STATUS.SUCCESS,
  payload
});

export const changeStatusNotificationHistoryFailure = payload => ({
  type: NOTIFICATION.NOTIFICATION_HISTORY_CHANGE_STATUS.FAILURE,
  payload
});

/**
 * ===== Delete notification history  =====
 */
export const deleteNotificationHistoryHandle = payload => ({
  type: NOTIFICATION.DELETE_NOTIFICATION_HISTORY.HANDLER,
  payload
});

export const deleteNotificationHistorySuccess = payload => ({
  type: NOTIFICATION.DELETE_NOTIFICATION_HISTORY.SUCCESS,
  payload
});

export const deleteNotificationHistoryFailure = payload => ({
  type: NOTIFICATION.DELETE_NOTIFICATION_HISTORY.FAILURE,
  payload
});

export const deleteNotificationHistoryClear = () => ({
  type: NOTIFICATION.DELETE_NOTIFICATION_HISTORY.FAILURE
});

export const clearNotification = payload => ({
  type: NOTIFICATION.REMOVE_ALL_NOTIFICATION.CLEAR,
  payload
});

/**
 * ===== Notification history  =====
 */
export const getPersonalNotificationHistoryHandle = payload => ({
  type: NOTIFICATION.GET_PERSONAL_NOTIFICATION_HISTORY.HANDLER,
  payload
});

export const getPersonalNotificationSuccess = payload => ({
  type: NOTIFICATION.GET_PERSONAL_NOTIFICATION_HISTORY.SUCCESS,
  payload
});

export const getPersonalNotificationFailure = payload => ({
  type: NOTIFICATION.GET_PERSONAL_NOTIFICATION_HISTORY.FAILURE,
  payload
});

/**
 * ===== Promotion List  =====
 */
export const getPromotionHandle = payload => ({
  type: NOTIFICATION.GET_PROMOTION.HANDLER,
  payload
});

export const getPromotionSuccess = payload => ({
  type: NOTIFICATION.GET_PROMOTION.SUCCESS,
  payload
});

export const getPromotionFailure = payload => ({
  type: NOTIFICATION.GET_PROMOTION.FAILURE,
  payload
});

export const getPromotionClear = () => ({
  type: NOTIFICATION.GET_PROMOTION.CLEAR
});
