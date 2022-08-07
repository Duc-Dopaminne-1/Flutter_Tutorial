import { call, takeLatest, put } from 'redux-saga/effects';
import { isNetworkAvailable } from '../network/actions';
import {
  ActionTypes,
  IActionGetListIAPProduct,
  IActionGetListIAPSubscription,
  IActionGetActivePlan,
  IActionBuyCoins,
  IActionRequestSubscription,
} from './index';
import * as IAPService from './service';
import { saveActivePlan, saveListIAPProduct, saveListIAPSubscription, getActivePlan } from './actions';

function* getListIAPProduct(action: IActionGetListIAPProduct) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(IAPService.getListIAPProduct);
  if (!error) {
    yield put(saveListIAPProduct({ products: response }));
    onSuccess && onSuccess(response);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* getListIAPSubscription(action: IActionGetListIAPSubscription) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(IAPService.getListIAPSubscription);
  if (!error) {
    yield put(saveListIAPSubscription({ subscriptions: response }));
    onSuccess && onSuccess(response);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* doGetActivePlan(action: IActionGetActivePlan) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(IAPService.doGetActivePlan);
  if (!error) {
    yield put(saveActivePlan({ activePlan: response }));
    onSuccess && onSuccess(response);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* buyCoins(action: IActionBuyCoins) {
  const { onSuccess, onFail, data } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(IAPService.buyCoins, data);
  if (!error) {
    onSuccess && onSuccess(response);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* requestSubscription(action: IActionRequestSubscription) {
  const { onSuccess, onFail, data } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(IAPService.requestSubscription, data);
  if (!error) {
    yield put(getActivePlan({}));
    onSuccess && onSuccess(response);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* iapSaga() {
  yield takeLatest(ActionTypes.GET_LIST_IAP_PRODUCT, getListIAPProduct);
  yield takeLatest(ActionTypes.GET_LIST_IAP_SUBSCRIPTION, getListIAPSubscription);
  yield takeLatest(ActionTypes.GET_ACTIVE_PLAN, doGetActivePlan);
  yield takeLatest(ActionTypes.BUY_COINS, buyCoins);
  yield takeLatest(ActionTypes.REQUEST_SUBSCRIPTION, requestSubscription);
}

export default iapSaga;
