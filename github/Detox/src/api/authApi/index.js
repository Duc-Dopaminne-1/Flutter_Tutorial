import qs from 'qs';

import {clearAuthState, setAuthState} from '../../appData/authState';
import {
  getAccessToken,
  getRefreshToken,
} from '../../appData/authState/selectors';
import {store} from '../../appData/store';
import * as userActions from '../../appData/user/actions';
import Configs from '../../configs';
import {removeExternalUserId} from '../../pushNotification/OneSignalPush';
import {resetRootNavigatorToScreen} from '../../screens/navigate';
import ScreenIds from '../../screens/ScreenIds';
import logService from '../../service/logService';
import {parseUserData} from '../../service/userData';
import {getNowTimeStamp} from '../../utils/TimerCommon';
import ValidateInput from '../../utils/ValidateInput';
import {getCommonApiHeaders} from '..';
import {parseResponseData} from '../restful/parseResponseData';
import {parseResponseError} from '../restful/parseResponseError';
import restfulApi from '../restful/restfulApi';
import apiConfig from './apiConfig';

const endPoints = {
  //sign up flow
  signUp: '/register-topener', //create account and retrieve the access tokens in exchange of email/password
  confirmOtp: '/confirm-phone-verification-token',
  postMobilePhone: '/send-phone-verification-token',

  //login flow
  token: apiConfig.token,
  refresh: apiConfig.refresh,
  logout: apiConfig.logout,
  deactivateToken: '/deactive-token',
  deactiveSessionToken: '/deactive-session-token',

  //forgot password flow
  forgotPassword: '/forgot-password-send-phone-verification-token',
  forgotPasswordConfirmOtp: '/phone-confirm-return-object',
  resetPassword: '/reset-password',
  changePassword: '/change-password',
  editMyAccount: '/edit-my-account',

  //First login:
  loginHistory: '/login-history',
};

const ACCEPT_JSON = {Accept: 'application/json'};

const GET_TOKEN_URL = apiConfig.baseURL + endPoints.token;
const isGetTokenUrl = url => {
  return url && url === GET_TOKEN_URL;
};

const restfulApiInstance = restfulApi({
  baseURL: apiConfig.baseURL,
  headers: {
    ...getCommonApiHeaders(),
    ...ACCEPT_JSON,
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

async function postMobilePhone(mobilePhone) {
  try {
    const normalizedPhone = ValidateInput.normalizePhoneNumber(mobilePhone);
    const body = {PhoneNumber: normalizedPhone};
    const results = await restfulApiInstance.post(
      endPoints.postMobilePhone,
      body,
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function signUpApi(body) {
  try {
    const results = await restfulApiInstance.post(endPoints.signUp, body);
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function signUp(accountInfo) {
  let userName = '';
  try {
    const tokensResult = await signUpApi(accountInfo);
    if (!tokensResult || !tokensResult.isSuccess) {
      return tokensResult;
    }

    const data = tokensResult.data?.data ?? {};
    userName = data.userName;
  } catch (error) {
    return parseResponseError(error);
  }

  try {
    const tokensResponse = await getTokens(userName, accountInfo.password);
    return tokensResponse;
  } catch (error) {
    //return parseResponseError(error);
    // error when trying to auto login => return back to login screen
    handleUnAuthorizedRequest();
  }
}

async function confirmOtp(phoneNumber, otp) {
  try {
    const normalizedPhone = ValidateInput.normalizePhoneNumber(phoneNumber);

    const body = {
      PhoneNumber: normalizedPhone,
      Code: otp,
    };
    const results = await restfulApiInstance.post(endPoints.confirmOtp, body);
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

//******* Login with password flow *******//
const GRANT_TYPE = {
  PASSWORD: 'password',
  REFRESH_TOKEN: 'refresh_token',
};

const SCOPE =
  'IdentityServerApi graphql-gateway personal communication master-data transaction sale post support-request content offline_access subscription contact-trading image file partners social-network contract document crawler payment support-service c2c-contact-trading';

const PASSWORD_FLOW_DATA = {
  grant_type: GRANT_TYPE.PASSWORD,
  client_id: Configs.oidc.OIDC_CLIENT_ID,
  client_secret: Configs.oidc.OIDC_CLIENT_SECRET,
  scope: SCOPE,
};

const PASSWORD_FLOW_CONFIGS = {
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
};

function getQuery(data) {
  let query = '';
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      const aQuery = `${key}=${value}`;
      if (query) {
        query = `${query}&&${aQuery}`;
      } else {
        query = aQuery;
      }
    }
  }

  return query;
}

async function getTokens(username, password) {
  //handle inputs
  const data = {
    ...PASSWORD_FLOW_DATA,
    username,
    password,
  };
  const query = qs.stringify(data);
  try {
    const results = await restfulApiInstance.post(
      endPoints.token,
      query,
      PASSWORD_FLOW_CONFIGS,
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function getTokensAutoLogin(username, acrValues) {
  //handle inputs
  const data = {
    ...PASSWORD_FLOW_DATA,
    username,
    acr_values: acrValues,
  };
  const query = getQuery(data);
  try {
    const results = await restfulApiInstance.post(
      endPoints.token,
      query,
      PASSWORD_FLOW_CONFIGS,
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function refreshTokens(refreshToken) {
  //handle inputs
  const data = {
    ...PASSWORD_FLOW_DATA,
    grant_type: GRANT_TYPE.REFRESH_TOKEN,
    refresh_token: refreshToken,
  };
  const query = getQuery(data);

  try {
    const results = await restfulApiInstance.post(
      endPoints.refresh,
      query,
      PASSWORD_FLOW_CONFIGS,
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function login(username, password) {
  try {
    const response = await getTokens(username, password);
    return response;
  } catch (error) {
    return parseResponseError(error);
  }
}

async function logout() {
  try {
    await revokeRefreshToken();
  } catch (error) {
    logService.log('revokeRefreshToken=============error', error);
  }

  try {
    await deActivateAccessToken();
  } catch (error) {
    logService.log('deActivateAccessToken=============error', error);
  }
}

async function revokeRefreshToken() {
  //handle inputs
  const state = store.getState();
  const refreshToken = getRefreshToken(state);
  const data = {
    client_id: Configs.oidc.OIDC_CLIENT_ID,
    client_secret: Configs.oidc.OIDC_CLIENT_SECRET,
    token: refreshToken,
  };
  const query = getQuery(data);
  const config = {
    headers: {
      ...getCommonApiHeaders(),
      'Content-Type': 'application/x-www-form-urlencoded',
      token_type_hint: 'refresh_token',
    },
  };
  try {
    const results = await restfulApiInstance.post(
      endPoints.logout,
      query,
      config,
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function deActivateAccessToken() {
  // handle inputs
  const state = store.getState();
  const accessToken = getAccessToken(state);
  if (!accessToken) {
    //ignore if we have no access token
    return;
  }

  const config = {
    headers: {
      ...getCommonApiHeaders(),
      ...ACCEPT_JSON,
      authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const results = await restfulApiInstance.post(
      endPoints.deactivateToken,
      {},
      config,
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function deactiveSessionToken(token: String) {
  const config = {
    ...getCommonApiHeaders(),
  };
  const data = {
    TokenDeactiveUser: token,
    PlatformType: 1,
  };
  try {
    const result = await restfulApiInstance.post(
      endPoints.deactiveSessionToken,
      data,
      config,
    );
    return parseResponseData(result);
  } catch (error) {
    parseResponseError(error);
  }
}

//****** Forgot password flow *********//
async function forgotPassword(phoneNumber, tokenCaptcha) {
  try {
    const normalizedPhone = ValidateInput.normalizePhoneNumber(phoneNumber);
    const body = {
      clientId: Configs.oidc.OIDC_CLIENT_ID,
      PhoneNumber: normalizedPhone,
      tokenCaptcha: tokenCaptcha,
    };
    const results = await restfulApiInstance.post(
      endPoints.forgotPassword,
      body,
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function forgotPasswordConfirmOtp(phoneNumber, otp) {
  try {
    const normalizedPhone = ValidateInput.normalizePhoneNumber(phoneNumber);

    const body = {
      clientId: Configs.oidc.OIDC_CLIENT_ID,
      PhoneNumber: normalizedPhone,
      Code: otp,
    };
    const results = await restfulApiInstance.post(
      endPoints.forgotPasswordConfirmOtp,
      body,
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function resetPassword(username, phoneNumber, newPassword, otpKey) {
  try {
    const normalizedPhone = ValidateInput.normalizePhoneNumber(phoneNumber);
    const body = {
      Username: username,
      PhoneNumber: normalizedPhone,
      NewPassword: newPassword,
      ConfirmPassword: newPassword,
      OtpKey: otpKey,
    };
    const results = await restfulApiInstance.post(
      endPoints.resetPassword,
      body,
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function changePassword(oldPassword, newPassword) {
  const state = store.getState();
  const accessToken = getAccessToken(state);

  const headers = {
    ...getCommonApiHeaders(),
    ...ACCEPT_JSON,
    authorization: `Bearer ${accessToken}`,
  };

  try {
    const body = {
      OldPassword: oldPassword,
      NewPassword: newPassword,
      ConfirmPassword: newPassword,
    };
    const results = await restfulApiInstance.post(
      endPoints.changePassword,
      body,
      {headers},
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

async function editMyAccount(bodyData) {
  try {
    const state = store.getState();
    const accessToken = getAccessToken(state);
    const config = {
      headers: {
        ...getCommonApiHeaders(),
        ...ACCEPT_JSON,
        authorization: `Bearer ${accessToken}`,
      },
    };
    const results = await restfulApiInstance.post(
      endPoints.editMyAccount,
      bodyData,
      config,
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

function handleUnAuthorizedRequest() {
  try {
    const pushNotificationId = store.getState().user?.pushNotificationId;
    removeExternalUserId(pushNotificationId);
    logout();
    resetRootNavigatorToScreen(ScreenIds.MainStack);
    store.dispatch(clearAuthState());
  } catch (error) {
    logService.log('error===', error);
  }
}

const storeTokenResponse = async response => {
  if (!response) {
    return;
  }
  const {authState, user} = parseUserData(response.data);
  await store.dispatch(setAuthState(authState));
  store.dispatch(userActions.update({...user}));
  return {authState, user};
};

async function updateLoginHistory() {
  try {
    const state = store.getState();
    const accessToken = getAccessToken(state);
    const config = {
      headers: {
        ...getCommonApiHeaders(),
        ...ACCEPT_JSON,
        authorization: `Bearer ${accessToken}`,
      },
    };
    const bodyData = {
      IsFirstLogin: false,
      LastLoginDatetime: getNowTimeStamp(),
    };
    const results = await restfulApiInstance.post(
      endPoints.loginHistory,
      bodyData,
      config,
    );
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  }
}

export {
  changePassword,
  confirmOtp,
  deActivateAccessToken,
  deactiveSessionToken,
  editMyAccount,
  forgotPassword,
  forgotPasswordConfirmOtp,
  getTokensAutoLogin,
  handleUnAuthorizedRequest,
  isGetTokenUrl,
  login,
  logout,
  postMobilePhone,
  refreshTokens,
  resetPassword,
  signUp,
  storeTokenResponse,
  updateLoginHistory,
};
