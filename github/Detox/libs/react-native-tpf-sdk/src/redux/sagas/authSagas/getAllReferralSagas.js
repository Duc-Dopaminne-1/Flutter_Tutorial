import { call, put } from 'redux-saga/effects';
import { apiGetAllReferral } from '../../../services/api/authApi';
import { getAllReferralFailure, getAllReferralSuccess } from '../../actions/auth';

export function* getAllReferralSagas({ payload, success, failure }) {
  try {
    const params = payload;
    const res = yield call(apiGetAllReferral, params);

    if (res.status !== 200) {
      yield put(getAllReferralFailure(res));
      failure && failure({ ...params, ...res });
      return;
    }

    yield put(getAllReferralSuccess(res.data));
    success && success(res.data);
  } catch (error) {
    yield put(getAllReferralFailure(error));
  }
}
