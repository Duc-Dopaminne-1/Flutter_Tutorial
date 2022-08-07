import * as NotificationServices from './service';
import {
  ActionTypes,
  IActionGetBadge,
  IActionUnregisterToken,
  IActionRegisterToken,
  IActionGetNotificationsDetail,
  IActionMarkReadAllNotifications,
} from './index';
import { call, put, takeLatest } from 'redux-saga/effects';
import { saveBadge } from './actions';
import { isNetworkAvailable } from '@src/modules/network/actions';

function* getBadge(action: IActionGetBadge) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { result, error } = yield call(NotificationServices.getBadge);

  if (!error) {
    yield put(saveBadge({ badge: result }));
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* registerToken(action: IActionRegisterToken) {
  const { onSuccess, onFail, param } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { result, error } = yield call(NotificationServices.registerToken, param);

  if (!error) {
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* unregisterToken(action: IActionUnregisterToken) {
  const { onSuccess, onFail, registrationID } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { result, error } = yield call(NotificationServices.unregisterToken, registrationID);

  if (!error) {
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* getNotificationsDetail(action: IActionGetNotificationsDetail) {
  const { onSuccess, onFail, notificationId } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { result, error } = yield call(NotificationServices.getNotificationsDetail, notificationId);

  if (!error) {
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* maskAsReadAll(action: IActionMarkReadAllNotifications) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { result, error } = yield call(NotificationServices.maskAsReadAll);

  if (!error) {
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* notificationSaga() {
  yield takeLatest(ActionTypes.GET_BADGE, getBadge);
  yield takeLatest(ActionTypes.REGISTER_TOKEN, registerToken);
  yield takeLatest(ActionTypes.UNREGISTER_TOKEN, unregisterToken);
  yield takeLatest(ActionTypes.GET_NOTIFICATIONS_DETAIL, getNotificationsDetail);
  yield takeLatest(ActionTypes.MARK_READ_ALL_NOTIFICATIONS, maskAsReadAll);
}

export default notificationSaga;
