import { ActionTypes, INotificationsAction } from '../index';

export interface INotificationInfo {
  badge: number;
}

const initialState: INotificationInfo = {
  badge: 0
};

export const reducer = (state: INotificationInfo = initialState, action: INotificationsAction) => {
  switch (action.type) {
    case ActionTypes.GET_BADGE_SUCCESS:
      return {
        ...state,
        badge: action.payload.badge
      };
    case ActionTypes.MARK_READ_ALL_NOTIFICATION_SUCCESS:
      return {
        ...state,
        badge: 0
      };
    default:
      return state;
  }
};
