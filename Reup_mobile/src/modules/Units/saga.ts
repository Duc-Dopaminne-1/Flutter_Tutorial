
import { IActionGetMembers, IActionGetPets, IActionGetVehicles, ActionTypes, IActionDeleteMember, IActionInvitations, IActionCreateMember, IActionUpdateMember, IActionAddPet, IActionAddVehicle, IActionUnitListMe, IActionDeletePetPayload, IActionRemovePet, IActionRemoveVehicle, } from './index';
import { isNetworkAvailable } from '../network/actions';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as Service from './service';
import { saveMembers, saveVehicles, savePets, loadMoreMembers, loadMoreVehicles, loadMorePets, saveUnitListMe, loadMoreUnitListMe } from './actions';
import { RootState } from '@src/types/types';
import { countListResident } from '../Company/actions';
import { LimitGetAll } from '@src/constants/vars';
import { isManagerApp } from '@src/utils';

function* getMembers(action: IActionGetMembers) {
  const { onFail, onSuccess, unitId, page = 1, limit = LimitGetAll } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.getMembers, unitId, page, limit);
  if (response) {
    if (page == 1) {
      yield put(saveMembers({ result: response }));
    } else {
      yield put(loadMoreMembers({ result: response }));
    }
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getVehicles(action: IActionGetVehicles) {
  const { onFail, onSuccess, unitId, page = 1, limit = LimitGetAll } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.getVehicles, unitId, page, limit);
  if (response) {
    if (page == 1) {
      yield put(saveVehicles({ result: response }));
    } else {
      yield put(loadMoreVehicles({ result: response }));
    }
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* addVehicle(action: IActionAddVehicle) {
  const { onFail, onSuccess, unitId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.addVehicle, unitId, params);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* removeVehicle(action: IActionRemoveVehicle) {
  const { onFail, onSuccess, unitId, vehicleId } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.removeVehicle, unitId, vehicleId);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}


function* getPets(action: IActionGetPets) {
  const { onFail, onSuccess, unitId, page = 1, limit = LimitGetAll } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.getPets, unitId, page, limit);
  if (response) {
    if (page == 1) {
      yield put(savePets({ result: response }));
    } else {
      yield put(loadMorePets({ result: response }));
    }
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* addPet(action: IActionAddPet) {
  const { onFail, onSuccess, unitId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.addPet, unitId, params);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* removePet(action: IActionRemovePet) {
  const { onFail, onSuccess, unitId, petId } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.removePet, unitId, petId);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* invitations(action: IActionInvitations) {
  const { onFail, onSuccess, unitId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.invitations, unitId, params);
  if (!error) {
    yield getMembers({
      type: ActionTypes.GET_MEMBERS,
      payload: {
        unitId,
        page: 1,
        onSuccess: () => onSuccess && onSuccess(response),
        onFail: onFail,
      },
    });
    if (isManagerApp()) {
      const companyId = yield select((state: RootState) => state.auth.userData ? state.auth.userData.default_company.id : '');
      yield put(countListResident({ companyId: companyId }));
    }
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* deleteMember(action: IActionDeleteMember) {
  const { onFail, onSuccess, unitId, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { value, error } = yield call(Service.deleteMember, unitId, id);
  if (!error) {
    yield getMembers({
      type: ActionTypes.GET_MEMBERS,
      payload: {
        unitId,
        page: 1,
        onSuccess: () => onSuccess && onSuccess(value),
        onFail: onFail,
      },
    });
    if (isManagerApp()) {
      const companyId = yield select((state: RootState) => state.auth.userData ? state.auth.userData.default_company.id : '');
      yield put(countListResident({ companyId: companyId }));
    }
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* updateMember(action: IActionUpdateMember) {
  const { onFail, onSuccess, unitId, id, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { value, error } = yield call(Service.updateMember, unitId, id, params);

  if (!error) {
    yield getMembers({
      type: ActionTypes.GET_MEMBERS,
      payload: {
        unitId,
        page: 1,
        onSuccess: () => onSuccess && onSuccess(value),
        onFail: onFail,
      },
    });
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* createMember(action: IActionCreateMember) {
  const { onSuccess, onFail, unitId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { value, error } = yield call(Service.createMember, unitId, params);
  if (!error) {
    yield getMembers({
      type: ActionTypes.GET_MEMBERS,
      payload: {
        unitId,
        page: 1,
        onSuccess: () => onSuccess && onSuccess(value),
        onFail: onFail,
      },
    });
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getUnitListMe(action: IActionUnitListMe) {
  const { onSuccess, onFail, page, limit, isSave = true, query } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { value: response, error } = yield call(Service.getUnitListMe, page, limit, query);
  if (!error) {
    if (isSave) {
      if (page == 1) {
        yield put(saveUnitListMe({ result: response }));
      } else {
        yield put(loadMoreUnitListMe({ result: response }));
      }
    }
    onSuccess && onSuccess(response);
  } else if (onFail) {
    onFail && onFail(error);
  }

}

function* unitSaga() {
  yield takeLatest(ActionTypes.GET_MEMBERS, getMembers);
  yield takeLatest(ActionTypes.GET_VEHICLES, getVehicles);
  yield takeLatest(ActionTypes.ADD_VEHICLE, addVehicle);
  yield takeLatest(ActionTypes.REMOVE_VEHICLE, removeVehicle);
  yield takeLatest(ActionTypes.GET_PETS, getPets);
  yield takeLatest(ActionTypes.ADD_PET, addPet);
  yield takeLatest(ActionTypes.REMOVE_PET, removePet);
  yield takeLatest(ActionTypes.INVITATIONS, invitations);
  yield takeLatest(ActionTypes.DELETE_MEMBER, deleteMember);
  yield takeLatest(ActionTypes.CREATE_MEMBER, createMember);
  yield takeLatest(ActionTypes.UPDATE_MEMBER, updateMember);
  yield takeLatest(ActionTypes.GET_LIST_UNIT_ME, getUnitListMe);
}

export default unitSaga;
