import {useEffect, useReducer} from 'react';

//initial state
const initState = {loading: false, apiFunction: null};

//action types
const START_API = 'START_API';
const STOP_LOADING = 'STOP_LOADING';

//action creators
const startApiAction = apiFunc => {
  return {type: START_API, payload: apiFunc};
};

const stopLoadingAction = () => {
  return {type: STOP_LOADING};
};

//reducer
const reducer = (state, action) => {
  switch (action.type) {
    case START_API:
      return {loading: true, apiFunction: action.payload};
    case STOP_LOADING:
      return {...state, loading: false};
    default:
      return state;
  }
};

//Custom hooks
const useApiCall = ({onError, onSuccess}) => {
  const [{loading, apiFunction}, dispatch] = useReducer(reducer, initState);

  //bound actions to dispatch
  const startApi = apiFunc => {
    dispatch(startApiAction(apiFunc));
  };
  const stopLoading = () => {
    dispatch(stopLoadingAction());
  };

  //main hook content
  useEffect(() => {
    if (!loading) {
      return;
    }
    stopLoading(); // avoid call api multiple time

    const callApi = async () => {
      if (!apiFunction) {
        onError({error: 'Invalid params'});
        return;
      }

      const response = await apiFunction();
      if (response.isSuccess) {
        onSuccess(response.data);
      } else {
        onError(response.data);
      }
    };

    callApi();

    return () => {
      //clean up
    };
  });

  return {loading, startApi};
};

export {useApiCall};
