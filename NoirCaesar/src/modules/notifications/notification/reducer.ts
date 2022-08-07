import { ActionTypes, INotificationState, IActionNotifications } from './index';
import { CommonActionType } from '@src/modules/base';

const initialState: INotificationState = {
  badge: 0,
};

const reducer = (state: INotificationState = initialState, action: IActionNotifications) => {
  switch (action.type) {
    case ActionTypes.SAVE_BADGE:
      return {
        ...state,
        badge: action.payload.badge,
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
