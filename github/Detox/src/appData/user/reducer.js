import * as actionTypes from './actionTypes';

export const initialState = {
  id: '',
  pushNotificationid: '',
  username: '',
  isFirstLogin: false,
  role: '',
  email: '',
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.UPDATE:
      return {...state, ...action.payload};
    case actionTypes.SET_FIRST_LOGIN:
      return {...state, ...action.payload};
    case actionTypes.UPDATE_ROLE:
      return {...state, ...action.payload};
    case actionTypes.CLEAR:
      return initialState;
    case actionTypes.UPDATE_PUSH_NOTIFICATION_ID:
      return {...state, ...action.payload};
    default:
      return state;
  }
};
