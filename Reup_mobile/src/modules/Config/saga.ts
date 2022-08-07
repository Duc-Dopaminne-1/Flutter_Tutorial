import * as ConfigServices from './service';
import {
  ActionTypes, IActionListCountry, IActionGetListState, IActionGetIDType, IActionGetListBlock, IActionGetListFloor,
} from './index';

import { call, takeLatest, put, takeEvery } from 'redux-saga/effects';
import {
  saveCountry, saveIDType, saveListBlock, saveListFloor,
} from './actions';
import { isNetworkAvailable } from '../network/actions';
import { LimitGetAll } from '@src/constants/vars';

function* getListCountry(action: IActionListCountry) {
  const { onSuccess, onFail, page = 1, limit = LimitGetAll } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(ConfigServices.getListCountry, page, limit);
  if (response) {
    yield put(saveCountry({ results: response }));
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getListState(action: IActionGetListState) {
  const { onSuccess, onFail, countryId, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(ConfigServices.getListState, countryId, page, limit);
  if (!error) {
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getIDType(action: IActionGetIDType) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(ConfigServices.getIDType);
  if (response) {
    yield put(saveIDType(response));
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getListBlock(action: IActionGetListBlock) {
  const { onSuccess, onFail, property_id, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(ConfigServices.getListBlock, property_id, page, limit);
  if (!error) {
    if (page === 1) {
      yield put(saveListBlock({ results: response }));
    }
    console.log('======= list Block: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListFloor(action: IActionGetListFloor) {
  const { onSuccess, onFail, property_id, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(ConfigServices.getListFloor, property_id, page, limit);
  if (!error) {
    if (page === 1) {
      yield put(saveListFloor({ results: response }));
    }
    console.log('======= list Floor: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail(error);
  }
}

function* configSaga() {
  yield takeLatest(ActionTypes.GET_COUNTRIES, getListCountry);
  yield takeLatest(ActionTypes.GET_LIST_STATE, getListState);
  yield takeLatest(ActionTypes.GET_ID_TYPE, getIDType);
  yield takeLatest(ActionTypes.GET_BLOCK, getListBlock);
  yield takeLatest(ActionTypes.GET_FLOOR, getListFloor);
}

export default configSaga;
