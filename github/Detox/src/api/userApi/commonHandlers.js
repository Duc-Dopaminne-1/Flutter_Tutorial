/* eslint-disable no-underscore-dangle */

import {getRefreshToken} from '../../appData/authState/selectors';
import {store} from '../../appData/store/store';
import Configs from '../../configs';
import logService from '../../service/logService';
import {
  handleUnAuthorizedRequest,
  isGetTokenUrl,
  refreshTokens,
  storeTokenResponse,
} from '../authApi';
import restfulApi from '../restful/restfulApi';

function changeRequestConfig(requestConfig) {
  return requestConfig;
}

function changeResponse(response) {
  return response;
}

function onErrorRequest(error) {
  return Promise.reject(error);
}

function onErrorResponseRestfulApi(error, restfulApiInstance) {
  const originalRequest = error.config;

  if (error.response.status === 401 && isGetTokenUrl(originalRequest.url)) {
    //refresh failed => to login screen
    handleUnAuthorizedRequest();
    return;
  }

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const state = store.getState();
    const refreshToken = getRefreshToken(state);
    refreshTokens(refreshToken)
      .then(async response => {
        storeTokenResponse(response);
        return restfulApiInstance(originalRequest);
      })
      .catch(err => {
        if (err) {
          logService.log('refreshTokens error===', err);
        }
        handleUnAuthorizedRequest();
      });
  }
  return Promise.reject(error);
}

async function refreshTokenAction(refreshToken) {
  try {
    const tokenResponse = await refreshTokens(refreshToken);
    if (!tokenResponse.isSuccess) {
      handleUnAuthorizedRequest();
      return;
    }
    // Store the new tokens for your auth link
    const response = await storeTokenResponse(tokenResponse);
    return response;
  } catch (err) {
    logService.log('refreshTokenAction error', err);
    handleUnAuthorizedRequest();
  }
}

const createRestfulApi = (customConfigs = {}) => {
  let restfulApiInstance = null;

  const onErrorResponse = error => {
    return onErrorResponseRestfulApi(error, restfulApiInstance);
  };

  restfulApiInstance = restfulApi(
    {
      baseURL: Configs.rest.BASE_URL,
      ...customConfigs,
    },
    {changeRequestConfig, changeResponse, onErrorRequest, onErrorResponse},
  );

  return restfulApiInstance;
};

export {changeRequestConfig, changeResponse, createRestfulApi, onErrorRequest, refreshTokenAction};
