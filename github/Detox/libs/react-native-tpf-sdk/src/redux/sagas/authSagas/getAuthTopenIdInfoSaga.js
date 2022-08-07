import { getAuthTopenIdInfoFailure, getAuthTopenIdInfoSuccess } from '../../actions/auth';
import { call, put } from 'redux-saga/effects';
import { apiGetTopenIdUrl } from '../../../services/api/authApi';

export function* getAuthTopenIdInfoSaga() {
  try {
    const res = yield call(apiGetTopenIdUrl);
    if (res.status !== 200) {
      yield put(getAuthTopenIdInfoFailure(res));
      return;
    }
    let topenIdConfigs = {
      baseUrl: res?.data?.data?.url || '',
      clientAccessTokenUrl: ''
    };

    yield put(getAuthTopenIdInfoSuccess(topenIdConfigs));
  } catch (error) {
    yield put(getAuthTopenIdInfoFailure(error));
  }
}
