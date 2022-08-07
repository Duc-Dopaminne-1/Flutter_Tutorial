import {
  getListInsuranceResponsesFailure,
  getListInsuranceResponsesSuccess
} from '../../actions/insurance';
import { call, put } from 'redux-saga/effects';
import { apiGetListResponses } from '../../../services/api/insuranceApi';

export function* getInsuranceListResponsesSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const { id } = params || {};
    const data = yield call(apiGetListResponses, id);
    if (data.status === 200) {
      yield put(getListInsuranceResponsesSuccess(data?.data?.result));
      yield callback(null, data);
    } else {
      yield put(getListInsuranceResponsesFailure());
      yield callback(data, null);
    }
  } catch (error) {
    yield put(getListInsuranceResponsesFailure());
    yield callback(error, null);
  }
}
