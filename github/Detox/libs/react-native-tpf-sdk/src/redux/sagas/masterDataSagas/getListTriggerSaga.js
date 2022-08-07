import { call, put } from 'redux-saga/effects';
import { apiGetListTrigger } from '../../../services/api/masterDataApi';
import { getListTriggerFailure, getListTriggerSuccess } from '../../actions/masterData';

export function* getListTriggerSaga(action) {
  const { success, failure, params } = action?.payload;
  try {
    const data = yield call(apiGetListTrigger, params);
    if (data.status === 200) {
      yield put(getListTriggerSuccess(data.data.result));
      success?.(data.data.result);
      return;
    } else {
      yield put(getListTriggerFailure(data));
      failure?.(data);
    }
  } catch (error) {
    yield put(getListTriggerFailure(error));
    failure?.(error);
  }
}
