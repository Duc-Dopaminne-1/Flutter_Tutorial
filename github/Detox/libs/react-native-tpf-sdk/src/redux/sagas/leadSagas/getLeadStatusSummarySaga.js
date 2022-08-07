import { call, put } from 'redux-saga/effects';
import { apiGetLeadStatusSummary } from '../../../services/api/leadApi';
import { getLeadStatusSummaryFailure, getLeadStatusSummarySuccess } from '../../actions/lead';

export function* getLeadStatusSummarySaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetLeadStatusSummary, params);

    if (data.status === 200) {
      yield put(
        getLeadStatusSummarySuccess({
          data: data.data.result
        })
      );

      return;
    }

    yield put(getLeadStatusSummaryFailure(data));
  } catch (error) {
    yield put(getLeadStatusSummaryFailure(error));
  }
}
