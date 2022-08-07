import { call, put } from 'redux-saga/effects';
import { apiGetScheduleDetail } from '../../../services/api/scheduleApi';
import { getScheduleDetailSuccess } from '../../actions/schedule';
import { parseScheduleItem } from '../../parses/schedule';

export function* getScheduleDetailSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiGetScheduleDetail, params);
    if (data.status === 200) {
      const dataParse = parseScheduleItem(data.data.result);
      yield put(getScheduleDetailSuccess(dataParse));
      yield callback(null, dataParse);
    } else {
      yield callback(data, null);
    }
  } catch (error) {
    yield callback(error, null);
  }
}
