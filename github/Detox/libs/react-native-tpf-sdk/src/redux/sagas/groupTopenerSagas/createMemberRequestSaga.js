import { call, put } from 'redux-saga/effects';
import { apiCreateMemberRequest } from '../../../services/api/groupTopener';
import { createMemberRequestFailure, createMemberRequestSuccess } from '../../actions/groupTopener';

export function* createMemberRequestSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiCreateMemberRequest, params);
    if (data.status === 200) {
      yield put(
        createMemberRequestSuccess({
          data: data.data.result
        })
      );
      yield callback(null, data);
    } else {
      yield put(createMemberRequestFailure(data));
      yield callback(data, null);
    }
  } catch (error) {
    yield put(createMemberRequestFailure(error));
    yield callback(error, null);
  }
}
