import { call, put } from 'redux-saga/effects';
import { apiGetTotalOrderSummary } from '../../../services/api/credit';
import { getTotalRecordFailure, getTotalRecordSuccess } from '../../actions/credit';

export function* getTotalRecordSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(apiGetTotalOrderSummary, params);
    if (data.status === 200) {
      yield put(
        getTotalRecordSuccess({
          ...data.data.result
        })
      );
    } else {
      yield put(getTotalRecordFailure(data.response));
    }
  } catch (error) {
    yield put(getTotalRecordFailure(error));
  }
}
