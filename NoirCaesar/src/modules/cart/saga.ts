import * as CartService from './service';
import { isNetworkAvailable } from '../network/actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  ActionTypes,
  IActionGetListCart,
  IActionGetListProducts,
  IActionGetProductDetail,
  IActionAddToCart,
  IActionUpdateCartQuantity,
  IActionRemoveCartItem,
  IActionDeleteCart,
} from './index';
import { updateListProducts, updateProductDetail, updateListCart, loadMoreListProducts } from './actions';

function* getCartList(action: IActionGetListCart) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(CartService.getListCart);
  if (!error) {
    yield put(updateListCart({ listCart: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* addToCart(action: IActionAddToCart) {
  const { onSuccess, onFail, product_url, quantity } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(CartService.addToCart, product_url, quantity);
  if (!error) {
    yield put(updateListCart({ listCart: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* updateCartQuantity(action: IActionUpdateCartQuantity) {
  const { onSuccess, onFail, line_url, quantity } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(CartService.updateQuantity, line_url, quantity);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* removeCartItem(action: IActionRemoveCartItem) {
  const { onSuccess, onFail, line_url } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(CartService.removeCartItem, line_url);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* deleteCart(action: IActionDeleteCart) {
  const { onSuccess, onFail, basket_id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(CartService.deleteCart, basket_id);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getProductsList(action: IActionGetListProducts) {
  const { onSuccess, onFail, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(CartService.getListProducts, page, limit);
  if (!error) {
    if (page == 1) {
      yield put(updateListProducts({ products: result }));
    } else {
      yield put(loadMoreListProducts({ products: result }))
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getProductDetail(action: IActionGetProductDetail) {
  const { onSuccess, onFail, product_id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(CartService.getProductDetail, product_id);
  if (!error) {
    yield put(updateProductDetail({ product_detail: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* cartSaga() {
  yield takeLatest(ActionTypes.ADD_TO_CART, addToCart);
  yield takeLatest(ActionTypes.UPDATE_QUANTITY, updateCartQuantity);
  yield takeLatest(ActionTypes.REMOVE_CART_ITEM, removeCartItem);
  yield takeLatest(ActionTypes.DELETE_CART, deleteCart);
  yield takeLatest(ActionTypes.GET_LIST_CART, getCartList);
  yield takeLatest(ActionTypes.GET_LIST_PRODUCTS, getProductsList);
  yield takeLatest(ActionTypes.GET_PRODUCT_DETAIL, getProductDetail);
}

export default cartSaga;
