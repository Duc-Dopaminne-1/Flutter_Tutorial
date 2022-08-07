import { call, put } from 'redux-saga/effects';
import { apiUpdateStatusLead } from '../../../services/api/leadApi';
import { updateStatusLeadFailure, updateStatusLeadSuccess } from '../../actions/lead';

export function* updateStatusLeadSaga(obj) {
  const { callback = () => {} } = obj.payload || {};

  try {
    const { params } = obj.payload || {};
    const data = yield call(apiUpdateStatusLead, params);
    if (data.status === 200) {
      yield put(updateStatusLeadSuccess({ success: true }));
      callback?.(null, data);
    } else {
      yield put(updateStatusLeadFailure(data));
      callback?.(data, null);
    }
  } catch (error) {
    yield put(updateStatusLeadFailure(error));
  }
}
