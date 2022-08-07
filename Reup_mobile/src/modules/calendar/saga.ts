import * as Services from './service';
import { isNetworkAvailable } from '../network/actions';
import {
  IActionGetListEvent,
  IActionCreateEvent,
  IActionDetailEvent,
  IActionUpdateEvent,
  IActionRemoveEvent,
  IActionChangeStatusEvent,
  ActionTypes,
  IActionCreateEventTenant,
} from './index';
import { LimitLoadMore } from '@src/constants/vars';
import { saveListEvent, loadMoreListEvent } from './actions';
import { call, takeLatest, put, takeEvery } from 'redux-saga/effects';

function* getListEvent(action: IActionGetListEvent) {
  const { onSuccess, onFail, page, limit = LimitLoadMore, q, propertyId, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { value: response, error } = yield call(Services.getListEvent, page, limit, q, propertyId);
  if (!error) {
    if (isSave) {
      if (page === 1) {
        yield put(saveListEvent({ results: response }));
      } else {
        yield put(loadMoreListEvent({ results: response }));
      }
    }
    console.log('======= list Event: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail(error);
  }
}

function* createEvent(action: IActionCreateEvent) {
  const { onSuccess, onFail, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Services.createEvent, params);
  if (!error) {
    console.log('======= Create Event: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail(error);
  }
}

function* detailEvent(action: IActionDetailEvent) {
  const { onSuccess, onFail, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Services.detailEvent, id);
  if (!error) {
    console.log('======= Detail Event: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail(error);
  }
}

function* updateEvent(action: IActionUpdateEvent) {
  const { onSuccess, onFail, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Services.updateEvent, id, params);
  if (!error) {
    console.log('======= Update Event: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail(error);
  }
}

function* removeEvent(action: IActionRemoveEvent) {
  const { onSuccess, onFail, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Services.removeEvent, id);
  if (!error) {
    console.log('======= Remove Event: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail(error);
  }
}

function* changeStatusEvent(action: IActionChangeStatusEvent) {
  const { onSuccess, onFail, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Services.changeStatusEvent, id, params);
  if (!error) {
    console.log('======= Change Status Event: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail(error);
  }
}

function* createEventTenant(action: IActionCreateEventTenant) {
  const { onSuccess, onFail, propertyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Services.createEventTenant, propertyId, params);
  if (!error) {
    console.log('======= Create Event Tenant: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail(error);
  }
}

function* saga() {
  yield takeLatest(ActionTypes.GET_LIST_EVENT, getListEvent);
  yield takeLatest(ActionTypes.CREATE_EVENT, createEvent);
  yield takeLatest(ActionTypes.DETAIL_EVENT, detailEvent);
  yield takeLatest(ActionTypes.UPDATE_EVENT, updateEvent);
  yield takeLatest(ActionTypes.REMOVE_EVENT, removeEvent);
  yield takeLatest(ActionTypes.CHANGE_STATUS_EVENT, changeStatusEvent);
  yield takeLatest(ActionTypes.CREATE_EVENT_TENANT, createEventTenant);
}

export default saga;
