import {useReducer} from 'react';

const reducer = (prevState, updater) => {
  if (typeof updater === 'function') {
    return {...prevState, ...updater(prevState)};
  }
  return {...prevState, ...updater};
};

const useMergeState = (initialState = {}) => useReducer(reducer, initialState);

export default useMergeState;
