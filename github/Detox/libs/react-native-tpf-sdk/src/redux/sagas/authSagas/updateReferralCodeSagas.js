import { call, put } from 'redux-saga/effects';
import { apiUpdateReferralCode } from '../../../services/api/authApi';
import { updateReferralCodeFailure, updateReferralCodeSuccess } from '../../actions/auth';

export function* updateReferralCodeSagas({ payload, success, failure }) {
  try {
    const params = payload;
    const res = yield call(apiUpdateReferralCode, params);

    if (res.status !== 200) {
      yield put(updateReferralCodeFailure(res));
      failure && failure({ ...params, ...res });
      return;
    }

    yield put(updateReferralCodeSuccess(res.data));
    success && success(res.data);
  } catch (error) {
    yield put(updateReferralCodeFailure(error));
  }
}
