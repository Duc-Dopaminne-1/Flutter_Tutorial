import { check } from 'react-native-permissions';
import { takeLatest, call, put } from 'redux-saga/effects';
import {
  ActionTypes,
  IActionGetListVisitor,
  IActionGetListFacilities,
  IActionCreateFacility,
  IActionDeleteFacility,
  IActionUpdateFacility,
  IActionCheckInOutVisitor,
  IActionCreateVisitor,
  IActionGetListDelivery,
  IActionCheckShippedDelivery,
  IActionCreateDelivery,
} from './index';
import { isNetworkAvailable } from '../network/actions';
import * as FrontDeskServices from './service';
import {
  saveListVisitors,
  saveListFacilities,
  loadMoreFacilities,
  loadMoreVisitors,
  saveListDelivery,
  loadMoreListDelivery,
} from './actions';
import { FrontDesk } from '@reup/reup-api-sdk/libs/api';
import { LimitGetAll } from '@src/constants/vars';

function* getListFacilities(action: IActionGetListFacilities) {
  const { onSuccess, onFail, id, page, limit, params, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(FrontDeskServices.getListFacilities, id, page, limit, params);
  if (!error) {
    if (isSave) {
      if (page === 1) {
        yield put(saveListFacilities({ results: value }));
      } else {
        yield put(loadMoreFacilities({ results: value }));
      }
    }
    console.log('======= list facilities: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* createFacility(action: IActionCreateFacility) {
  const { onSuccess, onFail, companyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { value, error } = yield call(FrontDeskServices.createFacility, companyId, params);
  if (!error) {
    console.log('======= create Facility: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* deleteFacility(action: IActionDeleteFacility) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { value, error } = yield call(FrontDeskServices.deleteFacility, companyId, id);
  if (!error) {
    console.log('======= delete Facility: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* updateFacility(action: IActionUpdateFacility) {
  const { onSuccess, onFail, companyId, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(FrontDeskServices.updateFacility, companyId, id, params);
  if (!error) {
    console.log('======= update Facility: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListVisitor(action: IActionGetListVisitor) {
  const { onSuccess, onFail, id, page, limit, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(FrontDeskServices.getListVisitor, id, page, limit, params);
  if (!error) {
    if (page === 1) {
      yield put(saveListVisitors({ results: value }));
    } else {
      yield put(loadMoreVisitors({ results: value }));
    }
    console.log('======= getListVisitor: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* checkInOutVisitor(action: IActionCheckInOutVisitor) {
  const { onSuccess, onFail, companyId, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(FrontDeskServices.checkInOut, companyId, id, params);
  if (!error) {
    console.log('======= checkInOutVisitor: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* createVisitor(action: IActionCreateVisitor) {
  const { onSuccess, onFail, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { value, error } = yield call(FrontDeskServices.createVisitor, id, params);
  if (!error) {
    console.log('======= create Visitor: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListDelivery(action: IActionGetListDelivery) {
  const { onSuccess, onFail, id, page = 1, limit = LimitGetAll, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(FrontDeskServices.getListDelivery, id, page, limit, params);
  console.log('======= getListDelivery: ', action, error, value);
  if (!error) {
    if (page === 1) {
      yield put(saveListDelivery({ results: value }));
    } else {
      yield put(loadMoreListDelivery({ results: value }));
    }
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* checkShippedDelivery(action: IActionCheckShippedDelivery) {
  const { onSuccess, onFail, from, to } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(FrontDeskServices.checkShippedDelivery, from, to);
  console.log('======= check shipped Delivery: ', action, value, error);
  if (!error) {
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* createDelivery(action: IActionCreateDelivery) {
  const { onSuccess, onFail, companyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { value, error } = yield call(FrontDeskServices.createDelivery, companyId, params);
  if (!error) {
    console.log('======= create Delivery: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* frontDeskSaga() {
  yield takeLatest(ActionTypes.GET_LIST_FACILITIES, getListFacilities);
  yield takeLatest(ActionTypes.CREATE_FACILITY, createFacility);
  yield takeLatest(ActionTypes.DELETE_FACILITY, deleteFacility);
  yield takeLatest(ActionTypes.UPDATE_FACILITY, updateFacility);
  yield takeLatest(ActionTypes.GET_LIST_VISITOR, getListVisitor);
  yield takeLatest(ActionTypes.CHECK_IN_OUT_VISITOR, checkInOutVisitor);
  yield takeLatest(ActionTypes.CREATE_VISITOR, createVisitor);
  yield takeLatest(ActionTypes.GET_LIST_DELIVERY, getListDelivery);
  yield takeLatest(ActionTypes.CHECK_SHIPPED_DELIVERY, checkShippedDelivery);
  yield takeLatest(ActionTypes.CREATE_DELIVERY, createDelivery);
}

export default frontDeskSaga;
