import {
  getPersonalKpiStatusSummaryFailure,
  getPersonalKpiStatusSummarySuccess
} from '../../actions/kpi';
import { call, put } from 'redux-saga/effects';
import { apiGetPersonalKpiStatusSummary } from '../../../services/api/kpiApi';

export function* getPersonalKpiSumarySaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetPersonalKpiStatusSummary, params);

    if (data.status === 200) {
      yield put(
        getPersonalKpiStatusSummarySuccess({
          data: data.data.result
        })
      );

      return;
    }

    yield put(getPersonalKpiStatusSummaryFailure(data));
  } catch (error) {
    yield put(getPersonalKpiStatusSummaryFailure(error));
  }
}
