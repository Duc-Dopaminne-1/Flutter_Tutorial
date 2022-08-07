import axios from 'axios';
import { handleErrorMessage } from '../helpers/handleError';
import { store } from '../redux/store/configureStore';
import { MEMBER_TYPE } from '../global/member_type';
import { TpfSdkClient } from '../../index';
import AppConfigs from '../configs/appConfigs';

const REQUEST_TIMEOUT = 60000;

const instance = axios.create();
instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.interceptors.request.use(
  async config => {
    const token = store?.getState()?.auth?.accessToken;
    const authMemberId = store?.getState()?.auth?.memberId;
    const authRole = store?.getState()?.auth?.role;
    const memberId = authMemberId > -1 ? authMemberId : -1;
    const isTopener = authRole === MEMBER_TYPE.Topener ? true : false;
    config.headers.memberId = memberId;
    config.headers.isTopener = isTopener;
    config.headers.AuthorSdk = AppConfigs.AUTHOR_SDK;
    if (token) {
      config.headers.authorization = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    return handleErrorMessage(error);
  }
);

// interceptor to handle refresh token

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

instance.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.message === 'Network Error') {
      return handleErrorMessage({}, 'Network Error');
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.authorization = 'Bearer ' + token;
            return instance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      return new Promise(async (resolve, reject) => {
        const newToken = await TpfSdkClient.eventHandlers?.onRequestAccessToken();

        if (newToken) {
          store.getState().auth.accessToken = newToken;
          instance.defaults.headers.common.authorization = 'Bearer ' + newToken;
          originalRequest.headers.authorization = 'Bearer ' + newToken;
          setTimeout(() => {
            processQueue(null, newToken);
          }, 100);
          resolve(instance(originalRequest));
        }
        reject('ERROR TOKEN');
      }).then(() => {
        isRefreshing = false;
      });
    }

    return handleErrorMessage(error);
  }
);

export default class APIUtils {
  static get(uri, params, headers) {
    return new Promise((resolve, reject) =>
      instance
        .get(uri, {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            ...headers
          },
          timeout: REQUEST_TIMEOUT,
          params
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(handleErrorMessage(err));
        })
    );
  }

  static getWithoutAcceptText(uri, params, headers) {
    return new Promise((resolve, reject) =>
      instance
        .get(uri, {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            ...headers
          },
          timeout: REQUEST_TIMEOUT,
          params
        })
        .then(response => {
          //  const { data } = response;
          resolve(response);
        })
        .catch(err => {
          reject(handleErrorMessage(err));
        })
    );
  }

  static post(uri, postData, headers) {
    return new Promise((resolve, reject) => {
      instance
        .post(uri, postData, {
          timeout: REQUEST_TIMEOUT,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(handleErrorMessage(err));
        });
    });
  }

  static delete(uri, deleteBody, headers) {
    return new Promise((resolve, reject) => {
      instance
        .delete(uri, {
          timeout: REQUEST_TIMEOUT,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          data: deleteBody
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(handleErrorMessage(err));
        });
    });
  }

  static postFormData(uri, postData, headers) {
    return new Promise((resolve, reject) => {
      instance
        .post(uri, postData, {
          timeout: REQUEST_TIMEOUT,
          headers: {
            'Content-Type': 'multipart/form-data',
            ...headers
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(handleErrorMessage(err));
        });
    });
  }

  static put(uri, updateData, headers) {
    return new Promise((resolve, reject) =>
      instance
        .put(uri, updateData, {
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          timeout: REQUEST_TIMEOUT
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(handleErrorMessage(err));
        })
    );
  }

  static getMultiple(listGetRequest) {
    return new Promise((resolve, reject) => {
      axios
        .all(listGetRequest)
        .then(
          axios.spread((...responses) => {
            resolve(responses);
          })
        )
        .catch(errors => {
          reject(handleErrorMessage(errors));
        });
    });
  }
}
