import {translate} from 'i18n-js';
import {useEffect, useReducer} from 'react';

import Message from '../../assets/localize/message/Message';

//initial state
const initState = {loading: false, apiOptions: {}, data: {}, error: {}};

//action types
const START_API = 'START_API';
const STOP_LOADING = 'STOP_LOADING';
const UPDATE_DATA = 'UPDATE_DATA';
const UPDATE_ERROR = 'UPDATE_ERROR';

//action creators
const startApiAction = options => {
  return {type: START_API, payload: options};
};

const stopLoadingAction = () => {
  return {type: STOP_LOADING};
};

const updateData = responseData => {
  return {type: UPDATE_DATA, payload: responseData};
};

const updateError = errorData => {
  return {type: UPDATE_ERROR, payload: errorData};
};

//reducer
const reducer = (state, action) => {
  switch (action.type) {
    case START_API:
      return {
        loading: true,
        apiOptions: action.payload,
      };
    case STOP_LOADING:
      return {...state, loading: false};
    case UPDATE_DATA:
      return {...state, data: action.payload};
    default:
      return state;
  }
};

//Custom hooks
const useApiLazyQuery = ({apiFunction, queryOptions, onError, onSuccess}) => {
  const [{loading, apiOptions, data, error}, dispatch] = useReducer(reducer, {
    ...initState,
    apiOptions: queryOptions,
  });

  //bound actions to dispatch
  const startApi = newQueryOptions => {
    const options = newQueryOptions || apiOptions;

    dispatch(startApiAction(options));
  };
  const stopLoading = () => {
    dispatch(stopLoadingAction());
  };
  const updateResponseData = responseData => {
    dispatch(updateData(responseData));
  };
  const updateResponseError = errorData => {
    dispatch(updateError(errorData));
  };

  //main hook content
  useEffect(() => {
    if (!loading) {
      return;
    }
    stopLoading(); // avoid call api multiple time

    const callApi = async () => {
      if (!apiFunction) {
        onError && onError({message: translate(Message.NTW_UNKNOWN_ERROR)});
        updateResponseError({error: 'Invalid params'});

        return;
      }

      const response = await apiFunction(apiOptions);
      if (response.isSuccess) {
        updateResponseData(response.data);
        onSuccess && onSuccess(response.data);
      } else {
        updateResponseError(response.data);
        onError && onError(response.data);
      }
    };

    callApi();

    return () => {
      //clean up
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return [startApi, {data, error, loading}];
};

export {useApiLazyQuery};
