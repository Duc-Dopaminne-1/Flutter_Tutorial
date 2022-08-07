import * as PaymentServices from './service';
import {
  ActionTypes,
  IActionGetShippingMethodList,
  IActionGetCountries,
  IActionAddPromoCode,
  IActionCheckOut,
  IActionGetListOrder,
  IActionAddCreditCard,
  IActionGetOrderDetail,
} from './index';
import { isNetworkAvailable } from '../network/actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { saveShippingMethodList, saveCountries, saveListOrder, saveOrder, loadMoreListOrder } from './actions';

function* getShippingMethodList(action: IActionGetShippingMethodList) {
  const { onSuccess, onFail, data } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(PaymentServices.getShippingMethodList, data);
  if (!error) {
    yield put(saveShippingMethodList({ results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getCountries(action: IActionGetCountries) {
  const { onSuccess, onFail, name } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(PaymentServices.getCountries, name);
  if (!error) {
    yield put(saveCountries({ results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* addPromoCode(action: IActionAddPromoCode) {
  const { onSuccess, onFail, promoCode } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(PaymentServices.addPromoCode, promoCode);
  if (!error) {
    yield put(saveCountries({ results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* checkOut(action: IActionCheckOut) {
  const { onSuccess, onFail, data } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(PaymentServices.checkOut, data);
  if (!error) {
    yield put(saveOrder({ result: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getOrderDetail(action: IActionGetOrderDetail) {
  const { onSuccess, onFail, order_id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(PaymentServices.getOrderDetail, order_id);
  if (!error) {
    yield put(saveOrder({ result: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getListOrder(action: IActionGetListOrder) {
  const { onSuccess, onFail, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(PaymentServices.getListOrder, page, limit);
  if (!error) {
    if (page == 1) {
      yield put(saveListOrder({ orderList: result }));
    } else {
      yield put(loadMoreListOrder({ orderList: result }));
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* addCreditCard(action: IActionAddCreditCard) {
  const { onSuccess, onFail, token } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(PaymentServices.addCreditCard, token);
  if (!error) {
    yield put(saveListOrder({ orderList: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* paymentSaga() {
  yield takeLatest(ActionTypes.GET_SHIPPING_METHOD_LIST, getShippingMethodList);
  yield takeLatest(ActionTypes.GET_COUNTRIES, getCountries);
  yield takeLatest(ActionTypes.ADD_PROMO_CODE, addPromoCode);
  yield takeLatest(ActionTypes.CHECK_OUT, checkOut);
  yield takeLatest(ActionTypes.GET_ORDER_DETAIL, getOrderDetail);
  yield takeLatest(ActionTypes.GET_LIST_ORDER, getListOrder);
  yield takeLatest(ActionTypes.ADD_CARD, addCreditCard);
}

export default paymentSaga;
