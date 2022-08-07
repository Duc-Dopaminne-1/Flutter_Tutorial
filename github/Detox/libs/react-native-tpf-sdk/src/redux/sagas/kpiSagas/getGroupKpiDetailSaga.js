import { getGroupKpiDetailFailure, getGroupKpiDetailSuccess } from '../../actions/kpi';
import { getGroupKpiDetail } from '../../../services/api/kpiApi';
import { call, put } from 'redux-saga/effects';

export function* getGroupKpiDetailSaga(obj) {
  const { payload } = obj;
  try {
    const data = yield call(getGroupKpiDetail, payload);
    if (data.status === 200) {
      yield put(getGroupKpiDetailSuccess(data.data.result));
    } else {
      yield put(getGroupKpiDetailFailure(data.data));
    }
  } catch (error) {
    yield put(getGroupKpiDetailFailure(error));
  }
}
