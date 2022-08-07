import { updateProfileFailure, updateProfileSuccess } from '../../actions/member';
import { put, call } from 'redux-saga/effects';
import { apiUpdateProfile } from '../../../services/api/memberApi';

export function* updateProfileSaga({ payload, success, failure }) {
  const { callback = () => {}, params } = payload || {};
  try {
    const data = yield call(apiUpdateProfile, params);
    if (data.status === 200) {
      yield put(
        updateProfileSuccess({
          profile: params
        })
      );
      yield callback(null, data);
      success && success();
    } else {
      yield put(updateProfileFailure(data));
      yield callback(data, null);
      failure && failure();
    }
  } catch (error) {
    yield put(updateProfileFailure(error));
    yield callback(error, null);
    failure && failure();
  }
}
