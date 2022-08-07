import * as Service from './service';
import { call, takeLatest, put, takeEvery } from 'redux-saga/effects';
import { isNetworkAvailable } from '../network/actions';
import { LimitLoadMore } from '@src/constants/vars';
import {
  ActionTypes,
  IActionGetListShoppingProduct,
  IActionGetListProductCategory,
  IActionCreateProductCategory,
  IActionUpdateProductCategory,
  IActionDeleteProductCategory,
  IActionChangeStatusShoppingProduct,
  IActionCreateResidentShoppingProduct,
  IActionGetListResidentProductCategory,
  IActionGetMyShopProductList,
  IActionRemoveMyShopProduct,
  IActionUpdateShoppingProduct,
} from './index';
import {
  saveListProductCategory,
  loadmoreListProductCategory,
  saveListShoppingProduct,
  loadMoreShoppingProduct,
  saveListRelativeProduct,
  loadMoreRelativeProduct,
  loadmoreMyShopProductList,
  saveMyShopProductList,
} from './action';

function* getListShoppingProduct(action: IActionGetListShoppingProduct) {
  const { onSuccess, onFail, id, page, limit = LimitLoadMore, params, isSave = true, isRelative = false } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.getListShoppingProduct, id, page, limit, params);
  console.log('=========== List Shopping Product: ', action, response, error);
  if (!error) {
    if (isRelative) {
      if (isSave) {
        if (page == 1) {
          yield put(saveListRelativeProduct({ results: response }));
        } else {
          yield put(loadMoreRelativeProduct({ results: response }));
        }
      }
    } else {
      if (isSave) {
        if (page == 1) {
          yield put(saveListShoppingProduct({ results: response }));
        } else {
          yield put(loadMoreShoppingProduct({ results: response }));
        }
      }
    }
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* getListProductCategory(action: IActionGetListProductCategory) {
  const { onSuccess, onFail, id, page, limit = LimitLoadMore, params, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.getListProductCategory, id, page, limit, params);
  if (!error) {
    if (isSave) {
      if (page == 1) {
        yield put(saveListProductCategory({ results: value }));
      } else {
        yield put(loadmoreListProductCategory({ results: value }));
      }
    }
    console.log('=========== List Product Category: ', value);
    onSuccess && onSuccess(value);
  } else {
    onFail && onFail(error);
  }
}

function* createProductCategory(action: IActionCreateProductCategory) {
  const { onSuccess, onFail, companyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.createProductCategory, companyId, params);
  if (!error) {
    onSuccess && onSuccess(value);
  } else {
    onFail && onFail(error);
  }
}

function* updateProductCategory(action: IActionUpdateProductCategory) {
  const { onSuccess, onFail, companyId, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.updateProductCategory, companyId, id, params);
  if (!error) {
    onSuccess && onSuccess(value);
  } else {
    onFail && onFail(error);
  }
}

function* deleteProductCategory(action: IActionDeleteProductCategory) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.deleteProductCategory, companyId, id);
  if (!error) {
    onSuccess && onSuccess(value);
  } else {
    onFail && onFail(error);
  }
}

function* changeStatusShoppingProduct(action: IActionChangeStatusShoppingProduct) {
  const { onSuccess, onFail, companyId, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.changeStatusShoppingProduct, companyId, id, params);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* createResidentShoppingProduct(action: IActionCreateResidentShoppingProduct) {
  const { onSuccess, onFail, propertyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.createResidentShoppingProduct, propertyId, params);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* getListResidentProductCategory(action: IActionGetListResidentProductCategory) {
  const { onSuccess, onFail, propertyId, page, limit, q } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.getListResidentProductCategory, propertyId, page, limit, q);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* getMyShopProductList(action: IActionGetMyShopProductList) {
  const { onSuccess, onFail, id, page, limit = LimitLoadMore, params, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { value: response, error } = yield call(Service.getMyShopProductList, id, page, limit, params);
  if (!error) {
    if (isSave) {
      if (page == 1) {
        yield put(saveMyShopProductList({ results: response }));
      } else {
        yield put(loadmoreMyShopProductList({ results: response }));
      }
    }
    console.log('=========== List My Shopping Product: ', response);
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* removeMyShopProduct(action: IActionRemoveMyShopProduct) {
  const { onSuccess, onFail, propertyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.removeMyShopProduct, propertyId, id);
  if (!error) {
    console.log('=========== removed My Shopping Product: ', response);
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* updateShoppingProduct(action: IActionUpdateShoppingProduct) {
  const { onSuccess, onFail, propertyId, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.updateShoppingProduct, propertyId, id, params);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

export default function* saga() {
  yield takeLatest(ActionTypes.GET_LIST_SHOPPING_PRODUCT, getListShoppingProduct);
  yield takeLatest(ActionTypes.GET_LIST_PRODUCT_CATEGORY, getListProductCategory);
  yield takeLatest(ActionTypes.CREATE_PRODUCT_CATEGORY, createProductCategory);
  yield takeLatest(ActionTypes.UPDATE_PRODUCT_CATEGORY, updateProductCategory);
  yield takeLatest(ActionTypes.DELETE_PRODUCT_CATEGORY, deleteProductCategory);
  yield takeLatest(ActionTypes.CHANGE_STATUS_SHOPPING_PRODUCT, changeStatusShoppingProduct);
  yield takeLatest(ActionTypes.CREATE_RESIDENT_SHOPPING_PRODUCT, createResidentShoppingProduct);
  yield takeLatest(ActionTypes.GET_LIST_RESIDENT_PRODUCT_CATEGORY, getListResidentProductCategory);
  yield takeLatest(ActionTypes.GET_LIST_MY_PRODUCT, getMyShopProductList);
  yield takeEvery(ActionTypes.REMOVE_MY_SHOP_PRODUCT, removeMyShopProduct);
  yield takeLatest(ActionTypes.UPDATE_SHOPPING_PRODUCT, updateShoppingProduct);
}
