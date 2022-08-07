import { call, put, takeLatest } from 'redux-saga/effects';
import { inited, loadedData, tryAuthDone } from './actions';
import { AppActionType } from '@models/app';
import initService from '@services/init';
import loadService from '@services/appLoad';

function* init() {
  const data = yield call(initService);
  yield put(inited(data));
}

function* load() {
  const data = yield call(loadService);
  yield put(loadedData(data));
}

function* tryAuth() {
  yield put(tryAuthDone());
}

function* appSaga() {
  yield takeLatest(AppActionType.INIT, init);
  yield takeLatest(AppActionType.LOAD_DATA, load);
  yield takeLatest(AppActionType.TRY_AUTH, tryAuth);
}

export default appSaga;
