import * as AuthServices from './service';
import {
  ActionTypes,
  IActionLogin,
  IActionLogout,
  IActionGetCurrentUser,
  IActionRefreshToken,
  IActionIsAuthenticated,
  IActionUpdateProfile,
  IActionChangePassword,
  IActionSignUp,
  IActionResetPassword,
  IActionLoginGoogle,
  IActionLoginFacebook,
  IActionConfirmOTPPayload,
  IActionConfirmOTP,
  IActionLoginApple,
  IActionUploadImage
} from './index';
import { call, takeLatest, put, takeEvery } from 'redux-saga/effects';
import {
  saveUser,
  updateToken,
} from './actions';
import NavigationActionsService from '@src/navigation/navigation';
import { isNetworkAvailable } from '../network/actions';
import { ONBOARDING, ONBOARDING_TENANT } from '@src/constants/screenKeys';
import { getListCompany } from '../Company/actions';
import { isManagerApp } from '@src/utils';
import AsyncStorage from '@react-native-community/async-storage';
import { unregisterToken } from '../notifications/notification/actions';

function* getCurrentUser(action: IActionGetCurrentUser) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: user, error } = yield call(AuthServices.getCurrentUser);
  if (user) {
    console.log('CurrentUser: ', user);
    yield put(saveUser(user));
    yield put(getListCompany(
      {
        onFail,
        onSuccess: (data) => {
          let isInvited = false;
          if (isManagerApp()) {
            isInvited = data.results.length > 0 ? true : false;
          } else {
            isInvited = user.default_property ? true : false;
          }
          onSuccess && onSuccess({ ...user, isInvited: isInvited });
        }
      }
    ));
  } else if (onFail) {
    onFail && onFail();
  }
}

function* updateProfile(action: IActionUpdateProfile) {
  const { data, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result: response, error } = yield call(AuthServices.updateProfile, data);
  if (!error) {
    yield getCurrentUser({
      type: ActionTypes.GET_CURRENT_USER,
      payload: {
        onSuccess,
        onFail: onFail,
      },
    });
  } else {
    onFail && onFail(error);
  }
}

function* login(action: IActionLogin) {
  const { email, password, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { error } = yield call(AuthServices.login, email, password);
  if (!error) {
    yield getCurrentUser({
      type: ActionTypes.GET_CURRENT_USER,
      payload: {
        onSuccess: onSuccess,
        onFail: onFail,
      },
    });
  } else if (onFail) {
    onFail(error);
  }
}

function* loginWithGoogle(action: IActionLoginGoogle) {
  const { onFail, accessToken, onSuccess } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(AuthServices.loginWithGoogle, accessToken);
  if (!error) {
    yield getCurrentUser({
      type: ActionTypes.GET_CURRENT_USER,
      payload: {
        onSuccess,
        onFail: onFail,
      },
    });
  } else {
    onFail && onFail(error);
  }
}

function* loginWithFacebook(action: IActionLoginFacebook) {
  const { onFail, accessToken, onSuccess } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(AuthServices.loginWithFacebook, accessToken);
  if (!error) {
    yield getCurrentUser({
      type: ActionTypes.GET_CURRENT_USER,
      payload: {
        onSuccess,
        onFail: onFail,
      },
    });
  } else {
    onFail && onFail(error);
  }
}

function* loginWithApple(action: IActionLoginApple) {
  const { data, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(AuthServices.loginWithApple, data);
  if (!error) {
    yield getCurrentUser({
      type: ActionTypes.GET_CURRENT_USER,
      payload: {
        onSuccess,
        onFail: onFail
      }
    });
  } else {
    onFail && onFail(error);
  }
}

function* signup(action: IActionSignUp) {
  const { body, onSuccess, onFail } = action.payload;
  const { error } = yield call(AuthServices.register, body);
  if (!error) {
    yield login({
      type: ActionTypes.LOGIN,
      payload: {
        email: body.email,
        password: body.password1,
        onFail,
        onSuccess,
      },
    });
  } else if (onFail) {
    onFail(error);
  }
}

function* logout(action: IActionLogout) {
  const { onSuccess, onFail } = action.payload;
  try {
    const fcmToken = yield call(AsyncStorage.getItem, 'fcmToken');
    yield call(AsyncStorage.removeItem, 'fcmToken');
    yield put(unregisterToken({
      registrationID: fcmToken ? fcmToken : ""
    }
    ));
    const response = yield call(AuthServices.logout);
    onSuccess && onSuccess(response);
    if (isManagerApp()) {
      NavigationActionsService.setRoot(ONBOARDING);
    } else {
      NavigationActionsService.setRoot(ONBOARDING_TENANT);
    }
  } catch (error) {
    onFail && onFail(error);
  }
}

function* refreshToken(action: IActionRefreshToken) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { error } = yield call(AuthServices.refreshToken);
  if (!error) {
    yield put(updateToken());
    onSuccess && onSuccess();
  } else {
    onFail && onFail(error);
  }
}

function* isAuthenticated(action: IActionIsAuthenticated) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  try {
    const status = yield call(AuthServices.isAuthenticated);
    if (!status) {
      onFail && onFail();
      return;
    }
    yield getCurrentUser({
      type: ActionTypes.GET_CURRENT_USER,
      payload: {
        onSuccess,
        onFail: onFail,
      },
    });
  } catch (error) {
    onFail && onFail(error);
  }
}

function* changePassword(action: IActionChangePassword) {
  const { newPassword, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { error } = yield call(AuthServices.updatePassword, newPassword);
  if (!error) {
    yield put(updateToken());
    onSuccess && onSuccess();
  } else {
    onFail && onFail(error);
  }
}

function* resetPassword(action: IActionResetPassword) {
  const { email, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { error } = yield call(AuthServices.resetPassword, email);
  if (!error) {
    onSuccess && onSuccess();
  } else {
    onFail && onFail(error);
  }
}

function* confirmOTP(action: IActionConfirmOTP) {
  const { email, newPassword, otp, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { error } = yield call(AuthServices.confirmOTP, email, otp, newPassword);
  if (!error) {
    onSuccess && onSuccess();
  } else {
    onFail && onFail(error);
  }
}

function* uploadImage(action: IActionUploadImage) {
  const { data, progress, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { error, result } = yield call(AuthServices.uploadImage, data, progress);
  if (!error) {
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* authSaga() {
  yield takeLatest(ActionTypes.LOGIN, login);
  yield takeLatest(ActionTypes.SIGN_UP, signup);
  yield takeLatest(ActionTypes.LOG_OUT, logout);
  yield takeLatest(ActionTypes.GET_CURRENT_USER, getCurrentUser);
  yield takeLatest(ActionTypes.UPDATE_PROFILE, updateProfile);
  yield takeLatest(ActionTypes.REFRESH_TOKEN, refreshToken);
  yield takeLatest(ActionTypes.IS_AUTHENTICATED, isAuthenticated);
  yield takeLatest(ActionTypes.CHANGE_PASSWORD, changePassword);
  yield takeLatest(ActionTypes.RESET_PASSWORD, resetPassword);
  yield takeLatest(ActionTypes.LOGIN_GOOGLE, loginWithGoogle);
  yield takeLatest(ActionTypes.LOGIN_FACEBOOK, loginWithFacebook);
  yield takeLatest(ActionTypes.OTP_VERIFY, confirmOTP);
  yield takeEvery(ActionTypes.UPLOAD_IMAGE, uploadImage);
  yield takeLatest(ActionTypes.LOGIN_APPLE, loginWithApple);
}

export default authSaga;
