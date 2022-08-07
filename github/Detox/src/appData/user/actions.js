import * as actionTypes from './actionTypes';

export const update = user => ({
  type: actionTypes.UPDATE,
  payload: user,
});

export const clear = () => ({
  type: actionTypes.CLEAR,
});

export const setFirstLogin = isFirstLogin => ({
  type: actionTypes.SET_FIRST_LOGIN,
  payload: {isFirstLogin},
});

export const updateRole = role => ({
  type: actionTypes.UPDATE_ROLE,
  payload: {role},
});

export const updatePushNotificationId = pushNotificationId => ({
  type: actionTypes.UPDATE_PUSH_NOTIFICATION_ID,
  payload: {pushNotificationId},
});
