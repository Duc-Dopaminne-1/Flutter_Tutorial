import { call, put, select } from 'redux-saga/effects';
import { apiGetPasswordPattern } from '../../../services/api/authApi';
import { getPasswordPatternFailure, getPasswordPatternSuccess } from '../../actions/auth';

export function* getPasswordPatternSaga() {
  try {
    const { lang } = select(state => state.setting);
    const res = yield call(apiGetPasswordPattern, { lang });
    if (res?.data?.status === 'SUCCESS') {
      yield put(getPasswordPatternSuccess(res?.data?.data));
    } else yield put(getPasswordPatternFailure(res));
  } catch (error) {
    yield put(getPasswordPatternFailure(error));
  }
}
