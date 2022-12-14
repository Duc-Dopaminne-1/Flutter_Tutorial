import reducer from './reducer';

export const ActionTypes = {
  ADD_LOCAL_NOTIFICATION: 'ADD_LOCAL_NOTIFICATION',
  REMOVE_LOCAL_NOTIFICATION: 'REMOVE_LOCAL_NOTIFICATION',
  CLEAR_LOCAL_NOTIFICATIONS: 'CLEAR_LOCAL_NOTIFICATIONS',
  ADD_LOCAL_NOTIFICATION_FAILED: 'ADD_LOCAL_NOTIFICATION_FAILED',
  REMOVE_LOCAL_NOTIFICATION_FAILED: 'REMOVE_LOCAL_NOTIFICATION_FAILED',
  CLEAR_LOCAL_NOTIFICATIONS_FAILED: 'CLEAR_LOCAL_NOTIFICATIONS_FAILED',
  REQUEST_ADD_LOCAL_NOTIFICATION: 'REQUEST_ADD_LOCAL_NOTIFICATION',
  REQUEST_REMOVE_LOCAL_NOTIFICATION: 'REQUEST_REMOVE_LOCAL_NOTIFICATION',
};

export interface ILocalNotificationState {
  total: number;
  notifications: any[];
}

export interface IActionNotification {
  type: string;
  payload: any;
}

export { reducer };
