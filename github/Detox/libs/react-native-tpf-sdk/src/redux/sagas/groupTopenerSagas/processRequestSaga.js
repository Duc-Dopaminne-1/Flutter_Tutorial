import { call, put } from 'redux-saga/effects';
import { apiProcessRequest } from '../../../services/api/groupTopener';
import { processRequestFailure, processRequestSuccess } from '../../actions/groupTopener';

export function* processRequestSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiProcessRequest, params);
    if (data.status === 200) {
      yield put(
        processRequestSuccess({
          data: data.data.result,
          success: data.data.success
        })
      );
      yield callback(null, data);
    } else {
      yield put(processRequestFailure(data));
      yield callback(data, null);
    }
  } catch (error) {
    yield put(processRequestFailure(error));
    yield callback(error, null);
  }
}
