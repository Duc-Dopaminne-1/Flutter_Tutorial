import {
  getSubscriptionTopenersSuccess,
  getSubscriptionTopenersFailure
} from '../../actions/member';
import { put, call } from 'redux-saga/effects';
import { apiGetSubscriptionTopeners } from '../../../services/api/memberApi';

export function* getSubscriptionTopenersSaga(obj) {
  try {
    const data = yield call(apiGetSubscriptionTopeners);
    if (data.status === 200) {
      yield put(
        getSubscriptionTopenersSuccess({
          subscriptionTopeners: data.data.result
        })
      );
    } else {
      yield put(getSubscriptionTopenersFailure(data));
    }
  } catch (error) {
    yield put(getSubscriptionTopenersFailure(error));
  }
}
