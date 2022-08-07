import { call, put } from 'redux-saga/effects';
import { apiAddReferralCode } from '../../../services/api/authApi';
import { addReferralCodeFailure, addReferralCodeSuccess } from '../../actions/auth';

export function* addReferralSagas({ payload, success, failure }) {
  try {
    const params = payload;
    const res = yield call(apiAddReferralCode, params);

    if (res.status !== 200) {
      yield put(addReferralCodeFailure(res));
      failure && failure({ ...params, ...res });
      return;
    }

    yield put(addReferralCodeSuccess(res.data));
    success && success(res.data);
  } catch (error) {
    yield put(addReferralCodeFailure(error));
  }
}
