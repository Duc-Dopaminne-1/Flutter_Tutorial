import * as types from '../constants/actionTypes';

export function addNotification(payload: any) {
  return {
    type: types.Notifications.ADD_LOCAL_NOTIFICATION,
    payload,
  };
}

export function removeNotification(payload: any) {
  return {
    type: types.Notifications.REMOVE_LOCAL_NOTIFICATION,
    payload,
  };
}
