import { combineReducers } from 'redux';
import { reducer as localNotificationReducer } from './localNotification/reducer';
import notificationReducer from './notification/reducer';
import { reducer as notificationReducerInfo } from './notification/reducerInfo';

export const reducerNotification = combineReducers({
  localNotification: localNotificationReducer,
  notification: notificationReducer,
  notificationInfo: notificationReducerInfo,
});
