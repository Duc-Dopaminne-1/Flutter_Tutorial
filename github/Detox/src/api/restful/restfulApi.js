import Axios from 'axios';

import {logRestful} from '../../service/logService';

const API_TIMEOUT = 30000; //30s

const changeRequestConfig = requestConfig => {
  logRestful(requestConfig.url, requestConfig);
  return requestConfig;
};

const changeResponse = response => {
  // logService.log('response', response);
  return response;
};

const onErrorRequest = error => {
  // logService.log('onErrorRequest', error);
  return Promise.reject(error);
};

const onErrorResponse = error => {
  // logService.log('onErrorResponse', error);
  return Promise.reject(error);
};

const restfulApi = (
  {baseURL, headers = {}, timeout = API_TIMEOUT},
  middleWare = {changeRequestConfig, changeResponse, onErrorRequest, onErrorResponse},
) => {
  const instance = Axios.create({
    baseURL,
    timeout,
    headers,
  });

  if (middleWare.changeRequestConfig) {
    instance.interceptors.request.use(middleWare.changeRequestConfig, async error => {
      // logService.log('changeRequestConfig error', error);
      if (onErrorRequest) {
        return onErrorRequest(error);
      }
      return Promise.reject(error);
    });
  }

  if (middleWare.changeResponse) {
    instance.interceptors.response.use(middleWare.changeResponse, async error => {
      // logService.log('changeResponse error', error);
      if (onErrorResponse) {
        return onErrorResponse(error);
      }
      return Promise.reject(error);
    });
  }

  return instance;
};

export default restfulApi;
