export const getGeneralNotificationsSelector = state => state.notification.generalNotification;

export const getPrivateNotificationsSelector = state => state.notification.privateNotification;

export const getTotalCountNotificationsSelector = state => state.notification.totalNotifications;

export const getDeleteSuccessSelector = state => state.notification.deleteSuccess;

export const getReceivedNotificationSelector = state => state.notification.received;

export const getSaveSettingNotificationSelector = state => state.notification.settingNotification;

export const getTotalGeneralNotificationsSelector = state =>
  state.notification.totalGeneralNotificationsfications;

export const getTotalPrivateNotificationsSelector = state =>
  state.notification.totalPrivateNotifications;

export const getTotalUnreadNotificationsSelector = state =>
  state.notification.totalGeneralUnread + state.notification.totalPrivateUnread;
