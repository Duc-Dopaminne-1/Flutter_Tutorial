import { call, put } from 'redux-saga/effects';
import { apiGetContactDetail } from '../../../services/api/contactApi';
import { getContactDetailFailure, getContactDetailSuccess } from '../../actions/contact';

export function* getContactDetailSaga(obj) {
  try {
    const params = obj.payload;
    const data = yield call(apiGetContactDetail, params);
    if (data.status === 200) {
      yield put(
        getContactDetailSuccess({
          detail: data.data.result
        })
      );
    } else {
      yield put(getContactDetailFailure(data));
    }
  } catch (error) {
    yield put(getContactDetailFailure(error));
  }
}
