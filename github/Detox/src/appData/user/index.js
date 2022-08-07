import * as actionCreators from './actions';

export const setUser = user => {
  return function (dispatch) {
    dispatch(actionCreators.update(user));
  };
};

export const clearUser = () => {
  return function (dispatch) {
    dispatch(actionCreators.clear());
  };
};
