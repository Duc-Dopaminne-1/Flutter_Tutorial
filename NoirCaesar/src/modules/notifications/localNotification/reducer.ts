import { ActionTypes, ILocalNotificationState, IActionNotification } from './index';

const initialState: ILocalNotificationState = {
  total: 0,
  notifications: [],
};

const reducer = (state: ILocalNotificationState = initialState, action: IActionNotification) => {
  switch (action.type) {
    case ActionTypes.ADD_LOCAL_NOTIFICATION:
      return {
        ...state,
        total: state.total + 1,
        notifications: [...state.notifications, action.payload],
      };
    case ActionTypes.REMOVE_LOCAL_NOTIFICATION:
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

export default reducer;
