import * as NotificationsAction from './actions';
import * as Services from './service';
import {
  ActionTypes,
  IArchiveAllNotificationAction,
  IArchiveNotificationAction,
  IGetBadgeAction,
  IMarkReadAllNotificationAction,
  IReadNotificationAction,
  UnregisterTokenAction,
} from '../index';
import { call, put, takeLatest } from 'redux-saga/effects';
import { removeItem } from '@src/modules/list/actions';
import AsyncStorage from '@react-native-community/async-storage';
import NotificationsService from '../service';
function* readNotification(action: IReadNotificationAction) {
  try {
    const { error } = yield call(Services.readNotification, action.payload.ids);

    if (error) {
      return error;
    }
    yield put(
      NotificationsAction.markReadNotificationSuccess({
        id: action.payload.ids[0],
      }),
    );
    const result = yield call(Services.getBadge);
    if (result.error) {
      return error;
    }
    yield put(
      NotificationsAction.getBadgeSuccess({
        badge: result.data,
      }),
    );
    return action.payload.callBack(result.data);
  } catch (error) {
    return error;
  }
}

function* archiveNotification(action: IArchiveNotificationAction) {
  try {
    const { error } = yield call(Services.archiveNotification, action.payload.ids);
    if (error) {
      return error;
    }
    yield put(
      removeItem({
        listName: 'notifications',
        id: action.payload.ids[0],
      }),
    );
    const result = yield call(Services.getBadge);
    if (result.error) {
      return error;
    }
    yield put(
      NotificationsAction.getBadgeSuccess({
        badge: result.data,
      }),
    );
    return action.payload.callBack(result.data);
  } catch (error) {
    return error;
  }
}

function* getBadge(action: IGetBadgeAction) {
  const { data, error } = yield call(Services.getBadge);
  if (error) {
    return error;
  }
  yield put(
    NotificationsAction.getBadgeSuccess({
      badge: data,
    }),
  );
  return action.payload.callBack(data);
}

function* markReadAllNotification(action: IMarkReadAllNotificationAction) {
  try {
    const { data, error } = yield call(Services.markReadAllNotification);
    if (error) {
      return error;
    }
    NotificationsService.clearBadge();
    yield put(NotificationsAction.markReadAllNotificationSuccess({
      badge: 0
    }));
    return action.payload.callBack();
  } catch (error) {
    return error;
  }
}

function* archiveAllNotification(action: IArchiveAllNotificationAction) {
  try {
    const { error } = yield call(Services.archiveAllNotification);
    if (error) {
      return error;
    }
    return action.payload.callBack();
  } catch (error) {
    return error;
  }
}

function* registerToken(action: any) {
  const { data, error } = yield call(Services.registerToken, action.payload);
  return { data, error };
}

function* unregisterToken(action: UnregisterTokenAction) {
  const { registrationID, callBackSuccess, callBackFailure } = action.payload;
  const { error } = yield call(Services.unregisterToken, registrationID);
  yield call(AsyncStorage.removeItem, 'fcmToken');
  if (!error) {
    callBackSuccess && callBackSuccess();
  } else {
    callBackFailure && callBackFailure();
  }
}

export default function* notificationSaga() {
  yield takeLatest(ActionTypes.READ_NOTIFICATION, readNotification);
  yield takeLatest(ActionTypes.ARCHIVE_NOTIFICATION, archiveNotification);
  yield takeLatest(ActionTypes.GET_BADGE, getBadge);
  yield takeLatest(ActionTypes.MARK_READ_ALL_NOTIFICATION, markReadAllNotification);
  yield takeLatest(ActionTypes.ARCHIVE_ALL_NOTIFICATION, archiveAllNotification);
  yield takeLatest(ActionTypes.REGISTER_TOKEN, registerToken);
  yield takeLatest(ActionTypes.UNREGISTER_TOKEN, unregisterToken);
}
