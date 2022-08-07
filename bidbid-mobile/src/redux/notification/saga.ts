import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  ActionDeleteOne,
  ActionGetNotification,
  ActionReadAll,
  ActionReadOne,
  ActionSetFCMToken,
  ActionSetNotificationSetting,
  ActionTypes,
} from './index';
import * as NotificationServices from './service';
import {
  getNotification,
  getNotificationSetting,
  getTotalUnRead,
  initNotification,
  loadMoreNotification,
  resetNotification,
  saveNotificationSetting,
  setTotalUnRead,
} from '@/redux/notification/actions';
import NotificationsService from '@/shared/notification';
import { MessageInit } from '@/redux/messages/reducer';

function* setFCMToken(action: ActionSetFCMToken) {
  const { onSuccess, onFail, token, os } = action.payload;
  try {
    const { error, result } = yield call(NotificationServices.setFCMToken, { token, os });
    if (!error && result) {
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* getNotifications(action: ActionGetNotification) {
  const { onSuccess, onFail, page, isRefresh } = action.payload;
  try {
    const { error, result } = yield call(NotificationServices.getNotification, { page });
    if (!error && result) {
      if (isRefresh) {
        yield put(initNotification({ data: result.items }));
      } else {
        yield put(loadMoreNotification({ data: result.items, page: result.items.length === 0 ? page - 1 : page }));
      }
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* getTotalUnReads(action: ActionGetNotification) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(NotificationServices.getTotalUnRead);
    if (!error) {
      yield put(setTotalUnRead({ unread: result }));
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* readAll(action: ActionReadAll) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(NotificationServices.readAll);
    if (!error && result) {
      yield put(getNotification({ page: 1, isRefresh: true }));
      yield put(getTotalUnRead({}));
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* readOne(action: ActionReadOne) {
  const { onSuccess, onFail, id } = action.payload;
  try {
    const { error, result } = yield call(NotificationServices.readOne, { id });
    if (!error && result) {
      yield put(getNotification({ page: 1, isRefresh: true }));
      yield put(getTotalUnRead({}));
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* deleteOne(action: ActionDeleteOne) {
  const { onSuccess, onFail, id } = action.payload;
  try {
    const { error, result } = yield call(NotificationServices.deleteOne, { id });
    if (!error && result) {
      yield put(getTotalUnRead({}));
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* getNotificationSettingSaga() {
  try {
    const { error, result } = yield call(NotificationServices.getNotificationSetting);
    if (!error && result) {
      yield put(
        saveNotificationSetting({
          data: result,
        }),
      );
    }
  } catch (err) {}
}

function* setNotificationSetting(action: ActionSetNotificationSetting) {
  const { onFail, type, value } = action.payload;
  try {
    const { error, result } = yield call(NotificationServices.setNotificationSetting, { type, value });
    if (!error && result) {
      // onSuccess && onSuccess();
      yield put(getNotificationSetting());
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* deleteAllNotification(action: ActionSetNotificationSetting) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(NotificationServices.deleteAllNotification);
    if (!error && result) {
      const unreadChat = yield select((state: MessageInit) => state.message.totalUnread);
      NotificationsService.setBadge(unreadChat);
      yield put(resetNotification());
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* authSaga() {
  yield takeLatest(ActionTypes.SET_FCM_TOKEN, setFCMToken);
  yield takeLatest(ActionTypes.GET_NOTIFICATION, getNotifications);
  yield takeLatest(ActionTypes.GET_TOTAL_UNREAD, getTotalUnReads);
  yield takeLatest(ActionTypes.READ_ALL, readAll);
  yield takeLatest(ActionTypes.READ_ONE, readOne);
  yield takeLatest(ActionTypes.DELETE_ONE, deleteOne);
  yield takeLatest(ActionTypes.GET_NOTIFICATION_SETTING, getNotificationSettingSaga);
  yield takeLatest(ActionTypes.SET_NOTIFICATION_SETTING, setNotificationSetting);
  yield takeLatest(ActionTypes.DELETE_ALL_NOTIFICATION, deleteAllNotification);
}

export default authSaga;
