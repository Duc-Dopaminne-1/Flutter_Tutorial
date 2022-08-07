import { postRenewalTopenerSuccess, postRenewalTopenerFailure } from '../../actions/member';
import { put, call } from 'redux-saga/effects';
import { apiPostRenewalTopener } from '../../../services/api/memberApi';

export function* postRenewalTopenerSaga(obj) {
  try {
    const params = { id: obj.payload.Id };
    const data = yield call(apiPostRenewalTopener, params);
    if (data.status === 200) {
      yield put(
        postRenewalTopenerSuccess({
          renewalTopenerResult: data.data.result
        })
      );
    } else {
      yield put(postRenewalTopenerFailure(data));
    }
  } catch (error) {
    yield put(postRenewalTopenerFailure(error));
  }
}
