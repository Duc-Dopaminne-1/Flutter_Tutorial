import * as LibraryService from './service';
import { isNetworkAvailable } from '../network/actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  ActionTypes,
  IActionAddFavorite,
  IActionGetListFavorites,
  IActionGetListPurchase,
} from './index';
import { loadMoreListFavorites, loadMoreListPurchased, saveListFavorites, saveListPurchased } from './actions';

function* addFavorite(action: IActionAddFavorite) {
  const { onSuccess, onFail, id, type } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(LibraryService.addFavorite, id, type);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getListFavorites(action: IActionGetListFavorites) {
  const { onSuccess, onFail, name, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(LibraryService.getListFavorites, name, page, limit);
  if (!error) {
    onSuccess && onSuccess(result);
    if (page == 1) {
      yield put(saveListFavorites({ favorites: result }))
    }
    else {
      yield put(loadMoreListFavorites({ favorites: result }));
    }
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getListPurchase(action: IActionGetListPurchase) {
  const { onSuccess, onFail, name, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(LibraryService.getListPurchase, name, page, limit);
  if (!error) {
    onSuccess && onSuccess(result);
    if (page == 1) {
      yield put(saveListPurchased({ purchased: result }))
    }
    else {
      yield put(loadMoreListPurchased({ purchased: result }));
    }
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* cartSaga() {
  yield takeLatest(ActionTypes.ADD_FAVORITE, addFavorite);
  yield takeLatest(ActionTypes.GET_LIST_FAVORITES, getListFavorites);
  yield takeLatest(ActionTypes.GET_LIST_PURCHASE, getListPurchase);
}

export default cartSaga;
