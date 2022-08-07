import { call, put } from 'redux-saga/effects';
import { apiGetAllglobalConfig } from '../../../services/api/cashoutApi';
import { getAllGlobalCongifFailure, getAllGlobalCongifSuccess } from '../../actions/cashout';

export function* getAllGlobalConfigSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(apiGetAllglobalConfig, params);
    if (data.status === 200) {
      yield put(
        getAllGlobalCongifSuccess({
          ...data.data.result,
          isSuccessDetail: true
        })
      );
    } else {
      yield put(getAllGlobalCongifFailure(data));
    }
  } catch (error) {
    yield put(getAllGlobalCongifFailure(error));
  }
}
