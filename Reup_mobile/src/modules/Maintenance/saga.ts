import * as MaintenanceRequest from './service';
import {
  ActionTypes,
  IActionGetListMaintenanceRequest,
  IActionGetListRecurringTask,
  IActionGetListMaintenanceCategory,
  IActionUpdateMaintenanceCategory,
  IActionGetGeneral,
  IActionGetListStatusMaintenanceRequest,
  IActionUpdateRecurringTask,
  IActionCreateTask,
  IActionDeleteRequest,
  IActionChangeStatusRequest,
  IActionCreateRequest,
  IActionGetResidentRequestGeneral, IActionGetListStatusResidentRequest, IActionGetListResidentRequest, IActionGetListResidentCategory, IActionCreateResidentRequest, IActionAssigneeMaintenanceRequest
} from './index';
import { call, takeLatest, put } from 'redux-saga/effects';
import {
  saveListMaintenanceRequest,
  loadMoreListMaintenanceRequest,
  saveListStatusMaintenanceRequest,
  loadMoreListStatusMaintenanceRequest,
  saveGeneral,
  saveListMaintenanceCategory,
  loadmoreListMaintenanceCategory,
  getListRecurringTask as refreshRecurringTasks,
} from '@modules/Maintenance/actions';
import { saveRecurringTasks, loadMoreRecurringTasks } from '@modules/Maintenance/actions';
import { isNetworkAvailable } from '../network/actions';
import { LimitLoadMore } from '@src/constants/vars';

function* getListMaintenanceRequest(action: IActionGetListMaintenanceRequest) {
  const { companyId, page, q, limit, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(MaintenanceRequest.getListMaintenanceRequest, companyId, page, limit, q);
  if (!error) {
    if (page === 1) {
      yield put(saveListMaintenanceRequest({ results: response }));
    } else {
      yield put(loadMoreListMaintenanceRequest({ results: response }));
    }
    console.log('======= listMaintenanceRequest: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getListResidentRequest(action: IActionGetListResidentRequest) {
  const { property_id, page, q, limit, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(MaintenanceRequest.getListResidentRequest, property_id, page, limit, q);
  if (!error) {
    if (page === 1) {
      yield put(saveListMaintenanceRequest({ results: response }));
    } else {
      yield put(loadMoreListMaintenanceRequest({ results: response }));
    }
    console.log('======= List Resident Request: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getListStatusMaintenanceRequest(action: IActionGetListStatusMaintenanceRequest) {
  const { companyId, page, q, limit, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(MaintenanceRequest.getListMaintenanceRequest, companyId, page, limit, q);
  if (!error) {
    if (page === 1) {
      yield put(saveListStatusMaintenanceRequest({ results: response }));
    } else {
      yield put(loadMoreListStatusMaintenanceRequest({ results: response }));
    }
    console.log('======= listStatusMaintenanceRequest: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListStatusResidentRequest(action: IActionGetListStatusResidentRequest) {
  const { property_id, page, q, limit, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(MaintenanceRequest.getListResidentRequest, property_id, page, limit, q);
  if (!error) {
    if (page === 1) {
      yield put(saveListStatusMaintenanceRequest({ results: response }));
    } else {
      yield put(loadMoreListStatusMaintenanceRequest({ results: response }));
    }
    console.log('======= List Status Resident Request: ', response);
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListMaintenanceCategory(action: IActionGetListMaintenanceCategory) {
  const { onSuccess, onFail, companyId, page, limit, params, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(MaintenanceRequest.getListMaintenanceCategory, companyId, page, limit, params);
  if (!error) {
    if (isSave) {
      if (page == 1) {
        yield put(saveListMaintenanceCategory({ results: value }));
      } else {
        yield put(loadmoreListMaintenanceCategory({ results: value }));
      }
    }
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getListResidentCategory(action: IActionGetListResidentCategory) {
  const { onSuccess, onFail, propertyId, page, limit, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(MaintenanceRequest.getListResidentCategory, propertyId, page, limit);
  if (!error) {
    if (isSave) {
      if (page == 1) {
        yield put(saveListMaintenanceCategory({ results: value }));
      } else {
        yield put(loadmoreListMaintenanceCategory({ results: value }));
      }
    }
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* createTaskRequest(action: IActionCreateTask) {
  const { companyId, params, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(MaintenanceRequest.createTaskRequest, companyId, params);
  if (!error) {
    console.log('======= createTaskRequest value: ', value);
    yield getListRecurringTask({
      type: ActionTypes.GET_LIST_RECURRING_TASK,
      payload: {
        companyId,
        page: 1,
        onSuccess: () => onSuccess && onSuccess(value),
        onFail: onFail,
      },
    });
  } else if (onFail) {
    onFail(error);
  }
}

function* getGeneral(action: IActionGetGeneral) {
  const { companyId, params, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(MaintenanceRequest.getGeneral, companyId, params);
  if (!error) {
    console.log('======= general: ', value);
    yield put(saveGeneral({ results: value }));
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getResidentRequestGeneral(action: IActionGetResidentRequestGeneral) {
  const { property_id, params, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(MaintenanceRequest.getResidentRequestGeneral, property_id, params);
  if (!error) {
    console.log('======= Resident Request General: ', value);
    yield put(saveGeneral({ results: value }));
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* createMaintenanceCategory(action: IActionGetListMaintenanceCategory) {
  const { onSuccess, onFail, companyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(MaintenanceRequest.createMaintenanceCategory, companyId, params);
  if (!error) {
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* updateMaintenanceCategory(action: IActionUpdateMaintenanceCategory) {
  const { onSuccess, onFail, companyId, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(MaintenanceRequest.updateMaintenanceCategory, companyId, id, params);
  if (!error) {
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* deleteMaintenanceCategory(action: IActionUpdateMaintenanceCategory) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(MaintenanceRequest.deleteMaintenanceCategory, companyId, id);
  if (!error) {
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListRecurringTask(action: IActionGetListRecurringTask) {
  const {
    companyId,
    page = 1,
    limit = LimitLoadMore,
    params = {
      active: false,
      search: '',
    },
    onSuccess,
    onFail,
  } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(MaintenanceRequest.getListRecurringTask, companyId, page, limit, params);
  console.log('======= list recurring task: ', value, error, action);
  if (!error) {
    if (page === 1) {
      yield put(saveRecurringTasks({ results: value }));
    } else {
      yield put(loadMoreRecurringTasks({ results: value }));
    }
    onSuccess && onSuccess(value);
  } else {
    onFail && onFail(error);
  }
}

function* updateRecurringTask(action: IActionUpdateRecurringTask) {
  const { companyId, id, onSuccess, onFail, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(MaintenanceRequest.updateRecurringTask, companyId, id, params);
  console.log('======= update recurring task: ', value, error);
  if (!error) {
    onSuccess && onSuccess(value);
  } else {
    onFail && onFail(error);
  }
}

function* deleteRequest(action: IActionDeleteRequest) {
  const { onSuccess, onFail, id, companyId } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(MaintenanceRequest.deleteRequest, companyId, id);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* changeStatusRequest(action: IActionChangeStatusRequest) {
  const { onSuccess, onFail, companyId, propertyId, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(MaintenanceRequest.changeStatusRequest, companyId, propertyId, id, params);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* createRequest(action: IActionCreateRequest) {
  const { onSuccess, onFail, companyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(MaintenanceRequest.createRequest, companyId, params);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* createResidentRequest(action: IActionCreateResidentRequest) {
  const { onSuccess, onFail, propertyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(MaintenanceRequest.createResidentRequest, propertyId, params);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* assigneeMaintenanceRequest(action: IActionAssigneeMaintenanceRequest) {
  const { onSuccess, onFail, companyId, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(MaintenanceRequest.assigneeMaintenanceRequest, companyId, id, params);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

export default function* maintenanceSaga() {
  yield takeLatest(ActionTypes.GET_LIST_MAINTENANCE_REQUEST, getListMaintenanceRequest);
  yield takeLatest(ActionTypes.GET_LIST_MAINTENANCE_CATEGORY, getListMaintenanceCategory);
  yield takeLatest(ActionTypes.CREATE_MAINTENANCE_CATEGORY, createMaintenanceCategory);
  yield takeLatest(ActionTypes.GET_LIST_STATUS_MAINTENANCE_REQUEST, getListStatusMaintenanceRequest);
  yield takeLatest(ActionTypes.GET_GENERAL, getGeneral);
  yield takeLatest(ActionTypes.UPDATE_MAINTENANCE_CATEGORY, updateMaintenanceCategory);
  yield takeLatest(ActionTypes.CREATE_TASK, createTaskRequest);
  yield takeLatest(ActionTypes.GET_LIST_RECURRING_TASK, getListRecurringTask);
  yield takeLatest(ActionTypes.DELETE_MAINTENANCE_CATEGORY, deleteMaintenanceCategory);
  yield takeLatest(ActionTypes.UPDATE_RECURRING_TASK, updateRecurringTask);
  yield takeLatest(ActionTypes.DELETE_REQUEST, deleteRequest);
  yield takeLatest(ActionTypes.CHANGE_STATUS_REQUEST, changeStatusRequest);
  yield takeLatest(ActionTypes.CREATE_REQUEST, createRequest);
  yield takeLatest(ActionTypes.GET_RESIDENT_GENERAL, getResidentRequestGeneral);
  yield takeLatest(ActionTypes.GET_LIST_RESIDENT_REQUEST, getListResidentRequest);
  yield takeLatest(ActionTypes.GET_LIST_STATUS_RESIDENT_REQUEST, getListStatusResidentRequest);
  yield takeLatest(ActionTypes.GET_LIST_RESIDENT_CATEGORY, getListResidentCategory);
  yield takeLatest(ActionTypes.CREATE_RESIDENT_REQUEST, createResidentRequest);
  yield takeLatest(ActionTypes.ASSIGNEE_MAINTENANCE_REQUEST, assigneeMaintenanceRequest);
}
