import { ActionTypes } from '@modules/notifications';
import notificationReducer from '../notification/reducer';
export interface INotificationState {
  loading: boolean;
  updating: boolean;
  deleting: boolean;
}
export interface NotificationState {
  [id: string]: INotificationState;
}
export interface GetNotificationPayload {
  id: string;
}

// ==============ACTIONS======================
export interface ActionGetNotifications {
  type: ActionTypes.GET_NOTIFICATIONS;
  payload: GetNotificationPayload;
}
export interface ActionGetNotificationsSuccess {
  type: ActionTypes.GET_NOTIFICATIONS_SUCCESS;
  payload: GetNotificationPayload;
}

export type INotificationAction = ActionGetNotificationsSuccess | ActionGetNotifications;

const reducer = (state: any, action: any) => ({
  notifications: notificationReducer(state.notifications, action),
});

export { reducer };
