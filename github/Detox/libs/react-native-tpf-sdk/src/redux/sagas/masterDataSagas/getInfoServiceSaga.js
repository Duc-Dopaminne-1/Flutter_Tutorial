import { call, put } from 'redux-saga/effects';
import { apiGetInfoService } from '../../../services/api/masterDataApi';
import { getInfoServiceFailure, getInfoServiceSuccess } from '../../actions/masterData';

export function* getInfoServiceSaga() {
  try {
    const data = yield call(apiGetInfoService);
    if (data.status === 200) {
      yield put(getInfoServiceSuccess(data.data.result));
      return;
    } else {
      yield put(getInfoServiceFailure(data));
    }
  } catch (error) {
    yield put(getInfoServiceFailure(error));
    failure?.(error);
  }
}
