import { getPersonalKpiDetailFailure, getPersonalKpiDetailSuccess } from '../../actions/kpi';
import { getPersonalKpiDetail } from '../../../services/api/kpiApi';
import { call, put } from 'redux-saga/effects';

export function* getPersonalKpDetailSaga(obj) {
  const { payload } = obj;
  try {
    const data = yield call(getPersonalKpiDetail, payload);
    if (data.status === 200) {
      yield put(getPersonalKpiDetailSuccess(data.data.result));
    } else {
      yield put(getPersonalKpiDetailFailure(data.data));
    }
  } catch (error) {
    yield put(getPersonalKpiDetailFailure(error));
  }
}
