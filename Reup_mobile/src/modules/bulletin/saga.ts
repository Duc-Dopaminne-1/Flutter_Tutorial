import {
  IActionGetListNotification,
  ActionTypes,
  IActionDenyNotification,
  IActionApproveNotification,
  IActionGetListForLease,
  IActionGetListForSale,
  IActionCreatePostForSale,
  IActionCreatePostForLease,
  IActionActiveForLease,
  IActionDeclineForLease,
  IActionActiveForSale,
  IActionDeclineForSale,
  IActionNewMonthlyBill,
  IActionGetListMonthlyBill,
  IActionApproveMonthlyBill,
  IActionEditMonthlyBill,
  IActionDeleteMonthlyBill,
  IActionCheckoutMonthlyBill,
  IActionCreateNotification,
} from './index';
import { LimitLoadMore, LimitGetAll } from '@src/constants/vars';
import { isNetworkAvailable } from '../network/actions';
import * as Service from './service';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import {
  saveNotifications,
  loadMoreNotifications,
  saveListForLease,
  loadMoreListForLease,
  saveListForSale,
  loadMoreListForSale,
  saveMonthlyBills,
  loadMoreMonthlyBills,
} from './actions';

function* getListNotification(action: IActionGetListNotification) {
  const { id = '', page = 1, limit = LimitLoadMore, params = {}, onFail, onSuccess } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.getListNotification, id, page, limit, params);
  console.log('---- list notification', error, value, action);
  if (!error) {
    if (page === 1) {
      yield put(saveNotifications({ results: value }));
    } else {
      yield put(loadMoreNotifications({ results: value }));
    }
    onSuccess && onSuccess(value);
  } else {
    onFail && onFail(error);
  }
}

function* denyNotification(action: IActionDenyNotification) {
  const { companyId = '', notificationId = '', onFail, onSuccess } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.denyNotification, companyId, notificationId);
  console.log('---- deny notification', error, value, action);
  if (!error) {
    onSuccess && onSuccess(value);
  } else {
    onFail && onFail(error);
  }
}

function* approveNotification(action: IActionApproveNotification) {
  const { companyId = '', notificationId = '', onFail, onSuccess } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.approveNotification, companyId, notificationId);
  console.log('---- approve notification', error, value, action);
  if (!error) {
    onSuccess && onSuccess(value);
  } else {
    onFail && onFail(error);
  }
}

function* createPostForLease(action: IActionCreatePostForLease) {
  const { onSuccess, onFail, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.createPostForLease, id, params);
  console.log('======= Create Post For Lease: ', action, error, value);
  if (!error) {
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* createPostForSale(action: IActionCreatePostForSale) {
  const { onSuccess, onFail, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.createPostForSale, id, params);
  console.log('======= Create Post For Sale: ', action, error, value);
  if (!error) {
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListForLease(action: IActionGetListForLease) {
  const { onSuccess, onFail, id, page, limit, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.getListForLease, id, page, limit, params);
  console.log('======= list for lease: ', action, value, error);
  if (!error) {
    if (page === 1) {
      yield put(saveListForLease({ results: value }));
    } else {
      yield put(loadMoreListForLease({ results: value }));
    }
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getListForSale(action: IActionGetListForSale) {
  const { onSuccess, onFail, id, page, limit, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.getListForSale, id, page, limit, params);
  console.log('======= list for sale: ', action, value, error);
  if (!error) {
    if (page === 1) {
      yield put(saveListForSale({ results: value }));
    } else {
      yield put(loadMoreListForSale({ results: value }));
    }
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* activeForLease(action: IActionActiveForLease) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.activeForLease, companyId, id);
  if (!error) {
    console.log('======= active for lease: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* declineForLease(action: IActionDeclineForLease) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.declineForLease, companyId, id);
  if (!error) {
    console.log('======= decline for lease: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* activeForSale(action: IActionActiveForSale) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.activeForSale, companyId, id);
  if (!error) {
    console.log('======= active for sale: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* declineForSale(action: IActionDeclineForSale) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.declineForSale, companyId, id);
  if (!error) {
    console.log('======= decline for sale: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* createMonthlyBill(action: IActionNewMonthlyBill) {
  const { onFail, onSuccess, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(Service.newMonthlyBill, params);
  console.log('Create monthly bill', action, response, error);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* getListMonthlyBill(action: IActionGetListMonthlyBill) {
  const { onFail, onSuccess, params, page = 1, limit = LimitGetAll, isSave = true, id = '' } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(Service.getListMonthlyBill, id, page, limit, params);
  console.log('get list monthly bill', action, response, error);
  if (!error) {
    if (isSave) {
      if (page == 1) {
        yield put(saveMonthlyBills({ results: response }));
      } else {
        yield put(loadMoreMonthlyBills({ results: response }));
      }
    }
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* approveMonthlyBill(action: IActionApproveMonthlyBill) {
  const { onFail, onSuccess, params, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(Service.changeStateMonthlyBill, id, params);
  console.log('approve monthly bill', action, response, error);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* editMonthlyBill(action: IActionEditMonthlyBill) {
  const { onFail, onSuccess, params, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(Service.editMonthlyBill, id, params);
  console.log('edit monthly bill', action, response, error);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* deleteMonthlyBill(action: IActionDeleteMonthlyBill) {
  const { onFail, onSuccess, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(Service.deleteMonthlyBill, id);
  console.log('delete monthly bill', action, response, error);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* checkoutMonthlyBill(action: IActionCheckoutMonthlyBill) {
  const { onFail, onSuccess, id, params, propertyId = '' } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(Service.changeStateMonthlyBill, id, params, propertyId);
  console.log('checkout monthly bill', action, response, error);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* createNotification(action: IActionCreateNotification) {
  const { onSuccess, onFail, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(Service.createNewNotification, id, params);
  console.log('======= create notification: ', value, error, action);
  if (!error) {
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* bulletinSage() {
  yield takeLatest(ActionTypes.GET_LIST_NOTIFICATION, getListNotification);
  yield takeLatest(ActionTypes.DENY_NOTIFICATION, denyNotification);
  yield takeLatest(ActionTypes.APPROVE_NOTIFICATION, approveNotification);
  yield takeLatest(ActionTypes.CREATE_POST_FOR_LEASE, createPostForLease);
  yield takeLatest(ActionTypes.CREATE_POST_FOR_SALE, createPostForSale);
  yield takeLatest(ActionTypes.GET_LIST_FOR_LEASE, getListForLease);
  yield takeLatest(ActionTypes.GET_LIST_FOR_SALE, getListForSale);
  yield takeLatest(ActionTypes.ACTIVE_FOR_LEASE, activeForLease);
  yield takeLatest(ActionTypes.DECLINE_FOR_LEASE, declineForLease);
  yield takeLatest(ActionTypes.ACTIVE_FOR_SALE, activeForSale);
  yield takeLatest(ActionTypes.DECLINE_FOR_SALE, declineForSale);
  yield takeLatest(ActionTypes.NEW_MONTHLY_BILL, createMonthlyBill);
  yield takeLatest(ActionTypes.GET_LIST_MONTHLY_BILL, getListMonthlyBill);
  yield takeLatest(ActionTypes.APPROVE_MONTHLY_BILL, approveMonthlyBill);
  yield takeLatest(ActionTypes.EDIT_MONTHLY_BILL, editMonthlyBill);
  yield takeLatest(ActionTypes.DELETE_MONTHLY_BILL, deleteMonthlyBill);
  yield takeEvery(ActionTypes.CHECKOUT_MONTHLY_BILL, checkoutMonthlyBill);
  yield takeLatest(ActionTypes.CREATE_NOTIFICATION, createNotification);
}

export default bulletinSage;
