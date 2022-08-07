import { call, put } from 'redux-saga/effects';
import { apiGetListResponsesSaga } from '../../../services/api/credit';
import { getListResponsesHandle, getListResponsesSuccess } from '../../actions/credit';

export function* getListResponsesSaga(obj) {
  try {
    const params = obj.payload;
    const data = yield call(apiGetListResponsesSaga, params);
    if (data.status === 200) {
      yield put(
        getListResponsesSuccess({
          data: data.data.result
        })
      );
    } else {
      yield put(getListResponsesHandle(data));
    }
  } catch (error) {
    yield put(getListResponsesHandle(error));
  }
}
