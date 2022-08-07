import { getMemberProfileSuccess, getMemberProfileFailure } from '../../actions/member';
import { put, call } from 'redux-saga/effects';
import { apiGetMemberProfile } from '../../../services/api/memberApi';

export function* getMemberProfileSaga(obj) {
  try {
    const params = { memberId: obj.payload.Id };
    const data = yield call(apiGetMemberProfile, params);
    if (data.status === 200) {
      yield put(
        getMemberProfileSuccess({
          memberProfile: data.data.result
        })
      );
    } else {
      yield put(getMemberProfileFailure(data));
    }
  } catch (error) {
    yield put(getMemberProfileFailure(error));
  }
}
