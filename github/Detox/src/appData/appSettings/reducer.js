import * as actionTypes from './actionTypes';

export const initialState = {
  language: 'vi',
  onboardingVersionViewed: '',
  dateCloseIntroduce: null,
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.UPDATE:
      return {...state, ...action.payload};
    case actionTypes.UPDATE_DATE_CLOSE_INTRODUCE:
      return {...state, dateCloseIntroduce: action.payload};
    case actionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
