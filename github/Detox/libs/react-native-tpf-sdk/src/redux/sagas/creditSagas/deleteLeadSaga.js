import { call, put } from 'redux-saga/effects';
import { apiDeleteLeadForm } from '../../../services/api/leadApi';
import { deleteDealformFailure, deteleDealFormSuccess } from '../../actions/credit';

export function* deleteDealSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiDeleteLeadForm, params);

    if (data.status === 200) {
      yield put(deteleDealFormSuccess());
    } else {
      yield put(deleteDealformFailure());
    }
  } catch (error) {
    yield put(deleteDealformFailure());
  }
}
