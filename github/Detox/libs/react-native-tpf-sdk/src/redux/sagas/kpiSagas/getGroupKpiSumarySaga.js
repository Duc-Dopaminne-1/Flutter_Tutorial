import {
  getGroupKpiStatusSummaryFailure,
  getGroupKpiStatusSummarySuccess
} from '../../actions/kpi';
import { call, put } from 'redux-saga/effects';
import { apiGetGroupKpiStatusSummary } from '../../../services/api/kpiApi';

export function* getGroupKpiSumarySaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetGroupKpiStatusSummary, params);

    if (data.status === 200) {
      yield put(
        getGroupKpiStatusSummarySuccess({
          data: data.data.result
        })
      );

      return;
    }

    yield put(getGroupKpiStatusSummaryFailure(data));
  } catch (error) {
    yield put(getGroupKpiStatusSummaryFailure(error));
  }
}
