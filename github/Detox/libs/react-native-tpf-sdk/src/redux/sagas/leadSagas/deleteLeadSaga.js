import { deleteLeadFailure, deleteLeadSuccess } from '../../actions/lead';
import { call, put } from 'redux-saga/effects';
import { apiDeleteLead } from '../../../services/api/leadApi';

export function* deleteLeadSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiDeleteLead, params);
    if (data.status === 200) {
      yield put(deleteLeadSuccess({ success: true }));
    } else {
      yield put(deleteLeadFailure({ error: true, ...data }));
    }
  } catch (error) {
    yield put(deleteLeadFailure(error));
  }
}
