import { getPolicySubscriptionSuccess, getPolicySubscriptionFailure } from '../../actions/member';
import { put, call } from 'redux-saga/effects';
import { apiGetPolicySubscription } from '../../../services/api/memberApi';

export function* getPolicySubscriptionSaga(obj) {
  try {
    const data = yield call(apiGetPolicySubscription);
    if (data.status === 200) {
      yield put(
        getPolicySubscriptionSuccess({
          policySubscription: data.data.result
        })
      );
    } else {
      yield put(getPolicySubscriptionFailure(data));
    }
  } catch (error) {
    yield put(getPolicySubscriptionFailure(error));
  }
}
