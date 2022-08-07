import {LazyQueryHookOptions} from '@apollo/client';
import get from 'lodash/get';
import {useContext, useEffect, useState} from 'react';

import {AppContext} from "../../appData/appContext/appContext";
import {callAfterInteraction} from '../../screens/commonHooks';
import logService from '../../service/logService';
import {parseGraphqlError} from './parseGraphqlError';

type Options = {
  showSpinner: false,
  graphqlApiLazy: any,
  dataField: string,
  queryOptions: LazyQueryHookOptions,
};

type ResultOptions = {
  onError: () => {},
  onSuccess: () => {},
};

const useGraphqlApiLazy = ({
  showSpinner = false,
  graphqlApiLazy,
  dataField,
  queryOptions,
  onError,
  onSuccess,
}: Options & ResultOptions) => {
  const {showAppSpinner, showErrorAlert} = useContext(AppContext);
  const [executeQuery, {data, loading, error, called}] = graphqlApiLazy(queryOptions);
  function callFunctionWithSpinner(func, spinnerValue) {
    if (showSpinner) {
      showAppSpinner(spinnerValue);
      callAfterInteraction(() => {
        func && func();
      });
    } else {
      func && func();
    }
  }

  useEffect(() => {
    if (error) {
      callFunctionWithSpinner(() => {
        handleErrorFromGraphql(error, onError, onDefaultErrorHandler);
      }, false);
      return;
    }

    //parse response data
    if (data) {
      callFunctionWithSpinner(() => {
        // extract data and return to callback
        let responseData = data;
        if (dataField) {
          responseData = get(data, dataField, []);
        }

        // parse error in response data
        const errorHandled = handleErrorFromResponse(responseData, onError, onDefaultErrorHandler);
        if (errorHandled) {
          return;
        }

        onSuccess && onSuccess(responseData);
      }, false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, data]);

  const startApi = (newQueryOptions: LazyQueryHookOptions) => {
    callFunctionWithSpinner(() => {
      executeQuery(newQueryOptions);
    }, true);
  };

  function onDefaultErrorHandler(message) {
    callAfterInteraction(() => showErrorAlert(message));
  }

  return {startApi, loading, called, data: data?.[dataField]};
};

const useMutationGraphql = (options: Options) => {
  const [onSuccess, setOnSuccess] = useState();
  const [onError, setOnError] = useState();

  const {
    startApi: startApiFn,
    loading,
    called,
  } = useGraphqlApiLazy({
    ...options,
    ...(onSuccess ? {onSuccess} : null),
    ...(onError ? {onError} : null),
  });

  return {
    startApi: (newQueryOptions: LazyQueryHookOptions, successFn: () => {}, errorFn: () => {}) => {
      successFn && setOnSuccess(() => successFn);
      errorFn && setOnError(() => errorFn);
      startApiFn(newQueryOptions);
    },
    loading,
    called,
  };
};

// handle error from graphql error
function handleErrorFromGraphql(graphqlError, onErrorHandler, defaultErrorHandler) {
  if (graphqlError) {
    const message = parseGraphqlError(graphqlError);
    logService.log('useGraphqlApiLazy graphqlError====', graphqlError);

    if (onErrorHandler) {
      onErrorHandler({
        message,
        errorMessage: message,
        graphqlError,
      });
    } else {
      defaultErrorHandler(message);
    }
    return true; // error appeared and already handled
  }

  return false; // no error
}

// handle error from response
// return true: error appeared and handled
// return false: no error
function handleErrorFromResponse(response, onErrorHandler, defaultErrorHandler) {
  if (!response) {
    return false; // no error
  }

  //parse error in response data
  const errorMessage = response.errorMessage || response.errorCode || response.errorMessageCode;
  if (errorMessage) {
    logService.log('useGraphqlApiLazy errorMessage====', errorMessage);
    if (onErrorHandler) {
      onErrorHandler({
        message: errorMessage,
        errorMessage: response?.errorMessage,
        errorCode: response?.errorCode,
        errorMessageCode: response?.errorMessageCode,
        errorResponse: response,
      });
    } else {
      defaultErrorHandler && defaultErrorHandler(errorMessage);
    }
    return true; // error handled
  }
  return false; // no error
}

export {useGraphqlApiLazy, useMutationGraphql};
