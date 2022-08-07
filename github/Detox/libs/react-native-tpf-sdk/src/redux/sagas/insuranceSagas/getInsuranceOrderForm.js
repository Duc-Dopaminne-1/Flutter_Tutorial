import {
  getInsuranceOrderFormFailure,
  getInsuranceOrderFormForCreateFailure,
  getInsuranceOrderFormForCreateSuccess,
  getInsuranceOrderFormForEditFailure,
  getInsuranceOrderFormForEditSuccess,
  getInsuranceOrderFormSuccess
} from '../../actions/insurance';
import { call, put } from 'redux-saga/effects';
import {
  apiGetInsuranceOrderFormForCreate,
  apiGetInsuranceOrderFormForEdit,
  getInsuranceOrderForm
} from '../../../services/api/insuranceApi';

export function* getInsuranceOrderFormSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(getInsuranceOrderForm, params);
    if (data.status === 200) {
      yield put(getInsuranceOrderFormSuccess({ ...data.data.result, isSuccess: true }));
    } else {
      yield put(getInsuranceOrderFormFailure(data.response));
    }
  } catch (error) {
    yield put(getInsuranceOrderFormFailure(error));
  }
}

export function* getInsuranceOrderFormForCreateSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(apiGetInsuranceOrderFormForCreate, params);

    if (data?.status === 200) {
      yield put(getInsuranceOrderFormForCreateSuccess({ ...data.data.result, isSuccess: true }));
    } else {
      yield put(getInsuranceOrderFormForCreateFailure(data.response));
    }
  } catch (error) {
    yield put(getInsuranceOrderFormForCreateFailure(error));
  }
}

export function* getInsuranceOrderFormForEditSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(apiGetInsuranceOrderFormForEdit, params);

    if (data.status === 200) {
      yield put(getInsuranceOrderFormForEditSuccess({ ...data.data.result, isSuccess: true }));
    } else {
      yield put(getInsuranceOrderFormForEditFailure(data.response));
    }
  } catch (error) {
    yield put(getInsuranceOrderFormForEditFailure(error));
  }
}
