import { getProfileSuccess, getProfileFailure } from '../../actions/member';
import { put, call } from 'redux-saga/effects';
import { apiGetProfile } from '../../../services/api/memberApi';

export function* getProfileSaga(obj) {
  try {
    const params = { memberId: obj.payload.memberId };
    const data = yield call(apiGetProfile, params);
    if (data.status === 200) {
      yield put(
        getProfileSuccess({
          profile: data.data.result
        })
      );
    } else {
      yield put(getProfileFailure(data));
    }
  } catch (error) {
    yield put(getProfileFailure(error));
  }
}
