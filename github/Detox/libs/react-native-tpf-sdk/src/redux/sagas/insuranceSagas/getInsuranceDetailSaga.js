import { getInsuranceDetailFailure, getInsuranceDetailSuccess } from '../../actions/insurance';
import { call, put } from 'redux-saga/effects';
import { getInsuranceDetail } from '../../../services/api/insuranceApi';

export function* getInsuranceDetailSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(getInsuranceDetail, params);
    if (data.status === 200) {
      yield put(getInsuranceDetailSuccess(data.data.result));
    } else {
      yield put(getInsuranceDetailFailure(data.response));
    }
  } catch (error) {
    yield put(getInsuranceDetailFailure(error));
  }
}
