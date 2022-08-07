import { ActionTypes, INotificationsAction, INotificationsState, NotificationsState } from '../index';

const initialState = {};

const notificationReducer = (state: INotificationsState, action: INotificationsAction): INotificationsState => {
  switch (action.type) {
    case ActionTypes.MARK_READ_NOTIFICATION_SUCCESS:
      return {
        ...state,
        read: true,
      };
    case ActionTypes.ARCHIVE_NOTIFICATION_SUCCESS:
      return {
        ...state,
      };
    default:
      return state;
  }
};

const reducer = (state: NotificationsState = initialState, action: INotificationsAction): NotificationsState => {
  switch (action.type) {
    case ActionTypes.MARK_READ_ALL_NOTIFICATION_SUCCESS:
      return {
        ...Object.keys(state).reduce((prevValue: NotificationsState, id: string) => {
          return {
            ...prevValue,
            [id]: {
              ...state[id],
              read: true,
            },
          };
        }, {}),
      };
    case ActionTypes.MARK_READ_NOTIFICATION_SUCCESS:
    case ActionTypes.ARCHIVE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        [action.payload.id]: notificationReducer(state[action.payload.id], action),
      };
    default:
      return state;
  }
};

export default reducer;
