import { call, put } from 'redux-saga/effects';
import {
  apiGetCreateDealOrderForm,
  apiGetFinanceDealOrderForm
} from '../../../services/api/credit';
import {
  getCreateDealOrderFormFailure,
  getCreateDealOrderFormSuccess,
  getFinanceDealOrderFormFailure,
  getFinanceDealOrderFormSuccess
} from '../../actions/credit';

export function* getFinanceDealOrderFormSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(apiGetFinanceDealOrderForm, params);
    if (data.status === 200) {
      yield put(
        getFinanceDealOrderFormSuccess({
          ...data.data.result
        })
      );
    } else {
      yield put(getFinanceDealOrderFormFailure(data.response));
    }
  } catch (error) {
    yield put(getFinanceDealOrderFormFailure(error));
  }
}

export function* getCreateDealOrderFormSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(apiGetCreateDealOrderForm, params);
    if (data.status === 200) {
      yield put(
        getCreateDealOrderFormSuccess({
          ...data.data.result
        })
      );
    } else {
      yield put(getCreateDealOrderFormFailure(data.response));
    }
  } catch (error) {
    yield put(getCreateDealOrderFormFailure(error));
  }
}
