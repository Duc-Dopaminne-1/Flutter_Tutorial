import { getTopenIDProfileFailure, getTopenIDProfileSuccess } from '../../actions/member';
import { parseTopenIdProfile } from '../../parses/topenId';
import { put, call, select } from 'redux-saga/effects';
import { apiGetTopenId } from '../../../services/api/memberApi';

export function* getTopenIdProfileSaga() {
  try {
    const topenId = yield select(state => state.auth.topenId);
    const data = yield call(apiGetTopenId, topenId);

    if (data.status === 200) {
      const dataParse = parseTopenIdProfile(data?.data);
      yield put(getTopenIDProfileSuccess(dataParse));
    } else {
      yield put(getTopenIDProfileFailure(data));
    }
  } catch (error) {
    yield put(getTopenIDProfileFailure(error));
  }
}
