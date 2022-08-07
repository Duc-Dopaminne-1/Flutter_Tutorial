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
  IActionUploadCollection,
  IActionResetPassword,
  IActionUploadVideoOrAudio,
  IActionListCollection,
  IActionGetPersonTypes,
} from './index';
import { call, takeLatest, put, takeEvery } from 'redux-saga/effects';
import {
  saveUser,
  updateToken,
  getSaveListBook,
  getSaveLoadMoreListCollection,
  getSaveListVideo,
  getSaveLoadMoreListVideo,
  getSaveListAudio,
  getSaveLoadMoreListAudio,
  saveListPersonTypes,
} from './actions';
import NavigationActionsService from '@src/navigation/navigation';
import { isNetworkAvailable } from '../network/actions';
import { CategoryCollectionEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user';

function* getCurrentUser(action: IActionGetCurrentUser) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(AuthServices.getCurrentUser);
  if (!error) {
    yield put(saveUser({ user: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail();
  }
}

function* getPersonTypes(action: IActionGetPersonTypes) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(AuthServices.getPersonTypes);
  if (!error) {
    yield put(saveListPersonTypes(result));
    onSuccess && onSuccess();
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
  const { result, error } = yield call(AuthServices.updateProfile, data);
  if (!error) {
    yield put(saveUser({ user: result }));
    onSuccess && onSuccess(result);
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
  NavigationActionsService.showLoading();
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

function* signup(action: IActionSignUp) {
  const { body, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
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
  NavigationActionsService.showLoading();
  try {
    const response = yield call(AuthServices.logout);
    onSuccess && onSuccess(response);
  } catch (error) {
    onFail && onFail(error);
  }
}

function* getAuthToken() {
  try {
    yield call(AuthServices.getAuthToken);
  } catch (error) {
    console.log(error);
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
    const { error } = yield call(AuthServices.isAuthenticated);
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
  NavigationActionsService.showLoading();
  const { error } = yield call(AuthServices.resetPassword, email);
  if (!error) {
    onSuccess && onSuccess();
  } else {
    onFail && onFail(error);
  }
}

function* uploadCollection(action: IActionUploadCollection) {
  const { file, presignedPost, callback, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { error, result } = yield call(AuthServices.uploadCollection, file, presignedPost, callback);
  if (!error) {
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* uploadVideoOrAudio(action: IActionUploadVideoOrAudio) {
  const { data, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { error, result } = yield call(AuthServices.uploadVideoOrAudio, data);
  if (!error) {
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* listCollection(action: IActionListCollection) {
  const { type, limit, page, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { error, result } = yield call(AuthServices.listCollection, type, page, limit);
  if (!error) {
    switch (type) {
      case CategoryCollectionEnum.Book:
        if (page == 1) {
          yield put(getSaveListBook({ results: result }));
        } else {
          yield put(getSaveLoadMoreListCollection({ results: result }));
        }
        break;
      case CategoryCollectionEnum.Video:
        if (page == 1) {
          yield put(getSaveListVideo({ results: result }));
        } else {
          yield put(getSaveLoadMoreListVideo({ results: result }));
        }
        break;
      case CategoryCollectionEnum.Audio:
        if (page == 1) {
          yield put(getSaveListAudio({ results: result }));
        } else {
          yield put(getSaveLoadMoreListAudio({ results: result }));
        }
        break;
    }
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* authSaga() {
  yield takeLatest(ActionTypes.LOGIN, login);
  yield takeLatest(ActionTypes.SIGN_UP, signup);
  yield takeLatest(ActionTypes.LOG_OUT, logout);
  yield takeLatest(ActionTypes.GET_AUTH_TOKEN, getAuthToken);
  yield takeLatest(ActionTypes.GET_CURRENT_USER, getCurrentUser);
  yield takeLatest(ActionTypes.UPDATE_PROFILE, updateProfile);
  yield takeLatest(ActionTypes.REFRESH_TOKEN, refreshToken);
  yield takeLatest(ActionTypes.IS_AUTHENTICATED, isAuthenticated);
  yield takeLatest(ActionTypes.CHANGE_PASSWORD, changePassword);
  yield takeEvery(ActionTypes.UPLOAD_COLLECTION, uploadCollection);
  yield takeLatest(ActionTypes.RESET_PASSWORD, resetPassword);
  yield takeLatest(ActionTypes.UPLOAD_VIDEO_OR_AUDIO, uploadVideoOrAudio);
  yield takeEvery(ActionTypes.LIST_COLLECTION, listCollection);
  yield takeLatest(ActionTypes.GET_PERSON_TYPES, getPersonTypes);
}

export default authSaga;
