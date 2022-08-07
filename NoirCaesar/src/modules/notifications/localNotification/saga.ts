import { ActionTypes } from './index';
import { put, takeLatest } from 'redux-saga/effects';
import uuidv4 from 'uuid/v4';

function* addNotification(actions: any) {
  try {
    const notification = actions.payload;
    const notificationInfo = {
      id: notification.id ? notification.id : uuidv4(),
      code: notification.code ? notification.code : '',
      type: notification.type ? notification.type : 'error',
      message: notification.message ? notification.message : '',
      title: notification.title ? notification.title : '',
    };
    yield put({ type: ActionTypes.ADD_LOCAL_NOTIFICATION, payload: notificationInfo });
  } catch (e) {
    yield put({ type: ActionTypes.ADD_LOCAL_NOTIFICATION_FAILED, payload: e });
  }
}

function* removeNotification(actions: any) {
  try {
    yield put({ type: ActionTypes.REMOVE_LOCAL_NOTIFICATION, payload: actions.payload.id });
  } catch (e) {
    yield put({ type: ActionTypes.REMOVE_LOCAL_NOTIFICATION_FAILED, payload: e });
  }
}

export default function* localNotificationSaga() {
  yield takeLatest(ActionTypes.REQUEST_ADD_LOCAL_NOTIFICATION, addNotification);
  yield takeLatest(ActionTypes.REQUEST_REMOVE_LOCAL_NOTIFICATION, removeNotification);
}
