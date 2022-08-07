import * as types from '../constants/actionTypes';
import { ILocalNotificationState } from '../index';

interface ActionNotification {
  type: string;
  payload: any;
}
const initialState: ILocalNotificationState = {
  total: 0,
  notifications: [],
};
export const reducer = (state: ILocalNotificationState = initialState, action: ActionNotification) => {
  switch (action.type) {
    case types.Notifications.ADD_LOCAL_NOTIFICATION:
      return {
        ...state,
        total: state.total + 1,
        notifications: [...state.notifications, action.payload],
      };
    case types.Notifications.REMOVE_LOCAL_NOTIFICATION:
      const index = state.notifications.findIndex((notification: any) => notification.id === action.payload.id);
      return {
        ...state,
        total: state.total - 1,
        notifications: [...state.notifications.slice(0, index), ...state.notifications.slice(index + 1)],
      };
    default: {
      return state;
    }
  }
};
