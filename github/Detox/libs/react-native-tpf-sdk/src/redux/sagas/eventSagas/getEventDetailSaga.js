import { call, put } from 'redux-saga/effects';
import { apiGetEventDetail } from '../../../services/api/getEventsApi';
import { getEventDetailFailure, getEventDetailSuccess } from '../../actions/event';

export function* getEventDetailSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetEventDetail, params);
    if (data.status === 200) {
      yield put(
        getEventDetailSuccess({
          item: data.data.result
        })
      );
    } else {
      yield put(getEventDetailFailure(data));
    }
  } catch (error) {
    yield put(getEventDetailFailure(error));
  }
}
