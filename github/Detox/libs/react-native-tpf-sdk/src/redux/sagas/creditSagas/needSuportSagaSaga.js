import { call, put } from 'redux-saga/effects';
import { apiNeedSupport } from '../../../services/api/credit';
import { needSupportFailure, needSupportSuccess } from '../../actions/credit';

export function* needSupportSaga(obj) {
  const { callback = () => {}, params, action } = obj.payload || {};
  try {
    const data = yield call(apiNeedSupport, params);
    if (data.status === 200) {
      yield put(needSupportSuccess({ isNeedSupport: true, action: action }));
      yield callback(null, data);
    } else {
      yield put(needSupportFailure());
      yield callback(data, null);
    }
  } catch (error) {
    yield put(needSupportFailure());
    yield callback(error, null);
  }
}
