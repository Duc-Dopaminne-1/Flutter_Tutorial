import { call, put } from 'redux-saga/effects';
import { apiGetGroupByTopener } from '../../../services/api/groupTopener';
import { getGroupByTopenerFailure, getGroupByTopenerSuccess } from '../../actions/groupTopener';

export function* getGroupByTopenerSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetGroupByTopener, params);

    if (data.status === 200) {
      yield put(
        getGroupByTopenerSuccess({
          data: data.data.result
        })
      );
    } else {
      yield put(getGroupByTopenerFailure(data));
    }
  } catch (error) {
    yield put(getGroupByTopenerFailure(error));
  }
}
