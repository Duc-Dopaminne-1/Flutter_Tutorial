import { call, put } from 'redux-saga/effects';
import { apiGetTopenId } from '../../../services/api/authApi';
import { getTopenIdFailure, getTopenIdSuccess } from '../../actions/auth';

export function* checkMemberTopenIdSaga(obj) {
  const { success, failure } = obj;
  try {
    const res = yield call(apiGetTopenId);
    if (res?.data?.status === 'SUCCESS') {
      yield put(getTopenIdSuccess(res?.data?.data));
      success?.(res?.data?.data);
    } else {
      yield put(getTopenIdFailure(res));
      failure?.(res);
    }
  } catch (error) {
    failure?.({ code: 'user_invalid', message: error.message });
    yield put(getTopenIdFailure());
  }
}
