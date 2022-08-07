import * as actionTypes from './actionTypes';

export const update = authState => ({
  type: actionTypes.UPDATE,
  payload: authState,
});

export const clear = () => ({
  type: actionTypes.CLEAR,
});
