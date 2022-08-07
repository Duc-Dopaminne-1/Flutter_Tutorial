import {
  ActionTypes,
  IActionGetListCompany,
  IActionCreateCompany,
  IActionGetListPosition,
  IActionCreatePosition,
  IActionUpdatePosition,
  IActionDeletePosition,
  IActionGetListStaff,
  IActionGetListProperty,
  IActionCreateProperty,
  IActionDetailProperty,
  IActionDeleteProperty,
  IActionUpdateProperty,
  IActionCountStaff,
  IActionCountResident,
  IActionGetListPropertyType,
  IActionGetListApartment,
  IActionInviteStaff,
  IActionGetMyListCountry,
  IActionCreateApartment,
  IActionRemoveStaff,
  IActionGetListTenant,
  IActionTransferApartment,
  IActionRemoveTenant,
  IActionGetListDocument,
  IActionDetailApartment,
  IActionGetListMyProperty,
  IActionGetUserPermissions
  // IActionGetListTenant
} from './index';
import { isNetworkAvailable } from '../network/actions';
import * as CompanyServices from './service';
import { call, takeLatest, put, takeEvery } from 'redux-saga/effects';
import {
  saveListCompany,
  saveListPosition,
  saveListStaff,
  loadMoreListPosition,
  loadMoreListStaff,
  saveListProperty,
  loadMoreListProperty,
  saveCountListStaff,
  saveCountListResident,
  saveListPropertyType,
  saveListApartment,
  loadMoreListApartment,
  saveMyListCountry,
  saveListTenant,
  loadMoreListTenant,
  getListApartment as refreshListApartment,
  countListResident,
  saveDocuments,
  loadMoreDocument,
  saveListMyProperty,
} from './actions';

function* getListCompany(action: IActionGetListCompany) {
  const { onSuccess, onFail, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.getListCompany, page, limit);
  if (!error) {
    yield put(saveListCompany({ results: value }));
    console.log('======= getListCompany: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* createCompany(action: IActionCreateCompany) {
  const { onSuccess, onFail, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.createCompany, params);
  if (!error) {
    yield getListCompany({
      type: ActionTypes.GET_LIST_COMPANY,
      payload: {
        onSuccess: () => onSuccess && onSuccess(value),
        onFail: onFail,
      },
    });
    console.log('======= createCompany: ', value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListPosition(action: IActionGetListPosition) {
  const { onSuccess, onFail, companyId, page, limit, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.getListPosition, companyId, page, limit, params);
  if (!error) {
    if (page === 1) {
      yield put(saveListPosition({ results: value }));
    } else {
      yield put(loadMoreListPosition({ results: value }));
    }
    console.log('======= listPosition: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* createPosition(action: IActionCreatePosition) {
  const { onSuccess, onFail, companyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.createNewPosition, companyId, params);
  if (!error) {
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* updatePosition(action: IActionUpdatePosition) {
  const { onSuccess, onFail, companyId, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.updatePosition, companyId, id, params);
  if (!error) {
    onSuccess && onSuccess(value);
    console.log('======= updatePosition: ', value);
  } else if (onFail) {
    onFail(error);
  }
}

function* deletePosition(action: IActionDeletePosition) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.deletePosition, companyId, id);
  if (!error) {
    onSuccess && onSuccess(value);
    console.log('======= deletePosition: ', value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListStaff(action: IActionGetListStaff) {
  const { onSuccess, onFail, id, page, limit, params, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.getListStaff, id, page, limit, params);
  if (!error) {
    if (isSave) {
      if (page === 1) {
        yield put(saveListStaff({ results: value }));
      } else {
        yield put(loadMoreListStaff({ results: value }));
      }
    }
    console.log('======= listStaff: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* removeStaff(action: IActionRemoveStaff) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.removeStaff, companyId, id);
  if (!error) {
    onSuccess && onSuccess(value);
    yield staffCount({
      type: ActionTypes.COUNT_LIST_STAFF,
      payload: {
        companyId,
      },
    });
    console.log('======= remove staff: ', value);
  } else if (onFail) {
    onFail(error);
  }
}

function* staffCount(action: IActionCountStaff) {
  const { onSuccess, onFail, companyId, params, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.staffCount, companyId, params);
  if (!error) {
    if (isSave) {
      yield put(saveCountListStaff({ count: value }));
    }
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* residentCount(action: IActionCountResident) {
  const { onSuccess, onFail, companyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.residentCount, companyId, params);
  if (!error) {
    yield put(saveCountListResident({ count: value }));
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListProperty(action: IActionGetListProperty) {
  const { onSuccess, onFail, companyId, page, limit, params, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.getListProperty, companyId, page, limit, params);
  if (!error) {
    if (isSave) {
      if (page === 1) {
        yield put(saveListProperty({ results: value }));
      } else {
        yield put(loadMoreListProperty({ results: value }));
      }
    }
    console.log('======= list Property: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* createProperty(action: IActionCreateProperty) {
  const { onSuccess, onFail, companyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.createProperty, companyId, params);
  if (!error) {
    onSuccess && onSuccess(value);
    console.log('======= create propperty: ', value);
  } else if (onFail) {
    onFail(error);
  }
}

function* detailProperty(action: IActionDetailProperty) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.detailProperty, companyId, id);
  if (!error) {
    console.log('======= detail propperty: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* updateProperty(action: IActionUpdateProperty) {
  const { onSuccess, onFail, companyId, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.updateProperty, companyId, id, params);
  if (!error) {
    onSuccess && onSuccess(value);
    console.log('======= update propperty: ', value);
  } else if (onFail) {
    onFail(error);
  }
}

function* deleteProperty(action: IActionDeleteProperty) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.deleteProperty, companyId, id);
  if (!error) {
    onSuccess && onSuccess(value);
    console.log('======= delete propperty: ', value);
  } else if (onFail) {
    onFail(error);
  }
}

function* inviteStaff(action: IActionInviteStaff) {
  const { onSuccess, onFail, companyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.inviteStaff, companyId, params);
  if (!error) {
    onSuccess && onSuccess(value);
    yield staffCount({
      type: ActionTypes.COUNT_LIST_STAFF,
      payload: {
        companyId,
      },
    });
    console.log('======= invite staff: ', value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListPropertyType(action: IActionGetListPropertyType) {
  const { onSuccess, onFail } = action.payload;

  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.getListPropertyType);
  if (!error) {
    yield put(saveListPropertyType({ results: value }));
    console.log('======= list propperty type: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListApartment(action: IActionGetListApartment) {
  const { onSuccess, onFail, companyId, page, limit, q, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.getListApartment, companyId, page, limit, q);
  if (!error) {
    if (isSave) {
      if (page === 1) {
        yield put(saveListApartment({ results: value }));
      } else {
        yield put(loadMoreListApartment({ results: value }));
      }
    }
    console.log('======= listApartment: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* detailApartment(action: IActionDetailApartment) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.detailApartment, companyId, id);
  if (!error) {
    console.log('======= detail apartment: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* createApartment(action: IActionCreateApartment) {
  const { onSuccess, onFail, companyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { value, error } = yield call(CompanyServices.createApartment, companyId, params);
  if (!error) {
    console.log('======= create Apartment: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getMyListCountry(action: IActionGetMyListCountry) {
  const { onSuccess, onFail, companyId, page, limit } = action.payload;

  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(CompanyServices.getMyListCountry, companyId, page, limit);
  if (!error) {
    yield put(saveMyListCountry({ results: response }));
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getListTenant(action: IActionGetListTenant) {
  const { onSuccess, onFail, companyId, page, limit, params, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.getListTenant, companyId, page, limit, params);
  if (!error) {
    if (isSave) {
      if (page === 1) {
        yield put(saveListTenant({ results: value }));
      } else {
        yield put(loadMoreListTenant({ results: value }));
      }
    }
    console.log('======= list tenant: ', value);
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* transferApartment(action: IActionTransferApartment) {
  const { onSuccess, onFail, companyId, unitFromId, unitToId } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.transferApartment, companyId, unitFromId, unitToId);
  if (value) {
    console.log('======= transfer Apartment', value, error);
    onSuccess && onSuccess(value);
    yield put(countListResident({ companyId: companyId }));
  } else {
    onFail && onFail(error ?? '');
  }
}

function* removeTenant(action: IActionRemoveTenant) {
  const { onSuccess, onFail, companyId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.removeTenant, companyId, id);
  if (!error) {
    onSuccess && onSuccess(value);
    yield put(countListResident({ companyId: companyId }));
    console.log('======= remove tenant: ', value);
  } else if (onFail) {
    onFail(error);
  }
}

function* getListDocument(action: IActionGetListDocument) {
  const { onSuccess, onFail, id, page, limit, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.getListDocument, id, page, limit, params);
  console.log('======= list document: ', value, error, action);
  if (!error) {
    if (page === 1) {
      yield put(saveDocuments({ result: value }));
    } else {
      yield put(loadMoreDocument({ result: value }));
    }
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getListMyProperty(action: IActionGetListMyProperty) {
  const { onSuccess, onFail, page, limit, isSave = true } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value, error } = yield call(CompanyServices.getListMyProperty, page, limit);
  console.log('======= list my property: ', value, error, action);
  if (!error) {
    if (isSave) {
      yield put(saveListMyProperty({ results: value }));
    }
    onSuccess && onSuccess(value);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getUserPermissions(action: IActionGetUserPermissions) {
  const { onSuccess, onFail, companyId } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(CompanyServices.getUserPermissions, companyId);
  if (!error) {
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* companySaga() {
  yield takeLatest(ActionTypes.GET_LIST_COMPANY, getListCompany);
  yield takeLatest(ActionTypes.CREATE_COMPANY, createCompany);
  yield takeLatest(ActionTypes.GET_LIST_POSITION, getListPosition);
  yield takeLatest(ActionTypes.CREATE_POSITION, createPosition);
  yield takeLatest(ActionTypes.UPDATE_POSITION, updatePosition);
  yield takeLatest(ActionTypes.DELETE_POSITION, deletePosition);
  yield takeLatest(ActionTypes.GET_LIST_STAFF, getListStaff);
  yield takeLatest(ActionTypes.COUNT_LIST_STAFF, staffCount);
  yield takeLatest(ActionTypes.COUNT_LIST_RESIDENT, residentCount);
  yield takeLatest(ActionTypes.GET_LIST_PROPERTY, getListProperty);
  yield takeLatest(ActionTypes.CREATE_PROPERTY, createProperty);
  yield takeLatest(ActionTypes.DETAIL_PROPERTY, detailProperty);
  yield takeLatest(ActionTypes.UPDATE_PROPERTY, updateProperty);
  yield takeLatest(ActionTypes.DELETE_PROPERTY, deleteProperty);
  yield takeLatest(ActionTypes.GET_LIST_PROPERTY_TYPE, getListPropertyType);
  yield takeLatest(ActionTypes.GET_LIST_APARTMENT, getListApartment);
  yield takeLatest(ActionTypes.CREATE_APARTMENT, createApartment);
  yield takeLatest(ActionTypes.DETAIL_APARTMENT, detailApartment);
  yield takeEvery(ActionTypes.GET_MY_COUNTRIES, getMyListCountry);
  yield takeLatest(ActionTypes.REMOVE_STAFF, removeStaff);
  yield takeLatest(ActionTypes.INVITE_STAFF, inviteStaff);
  yield takeLatest(ActionTypes.GET_LIST_TENANT, getListTenant);
  yield takeLatest(ActionTypes.TRANSFER_APARTMENT, transferApartment);
  yield takeLatest(ActionTypes.REMOVE_TENANT, removeTenant);
  yield takeLatest(ActionTypes.GET_LIST_DOCUMENT, getListDocument);
  yield takeLatest(ActionTypes.GET_MY_PROPERTY, getListMyProperty);
  yield takeLatest(ActionTypes.GET_USER_PERMISSIONS, getUserPermissions);
}

export default companySaga;
