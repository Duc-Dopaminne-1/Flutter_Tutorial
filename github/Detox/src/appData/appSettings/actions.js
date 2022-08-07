import * as actionTypes from './actionTypes';

export const update = appSettings => ({
  type: actionTypes.UPDATE,
  payload: appSettings,
});

export const clear = () => ({
  type: actionTypes.CLEAR,
  payload: null,
});

export const updateDateCloseIntroduce = date => ({
  type: actionTypes.UPDATE_DATE_CLOSE_INTRODUCE,
  payload: date,
});
