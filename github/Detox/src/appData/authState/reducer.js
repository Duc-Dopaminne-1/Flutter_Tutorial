import * as actionTypes from './actionTypes';

export const initialState = {
  hasLoggedInOnce: false,
  accessToken: '',
  accessTokenExpirationDate: '',
  refreshToken: '',
  scope: '',
  idToken: '',
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.UPDATE:
      return {...state, ...action.payload};
    case actionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
