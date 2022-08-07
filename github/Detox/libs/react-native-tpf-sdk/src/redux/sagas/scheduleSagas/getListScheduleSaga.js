import { call, put, select } from 'redux-saga/effects';
import { LIMIT_PAGE } from '../../../global/app';
import { apiGetListSchedule } from '../../../services/api/scheduleApi';
import { getListScheduleFailure, getListScheduleSuccess } from '../../actions/schedule';
import { parseScheduleList } from '../../parses/schedule';

export function* getListScheduleSaga(obj) {
  try {
    const getMemberIdSelector = state => state.auth.memberId;
    const memberId = yield select(getMemberIdSelector);
    const params = {
      memberId: memberId,
      maxResultCount: LIMIT_PAGE,
      SkipCount: 0,
      ...obj.payload
    };
    const data = yield call(apiGetListSchedule, params);
    if (data.status === 200) {
      const listData = data.data.result.items || [];
      const dataParse = parseScheduleList(listData);
      yield put(
        getListScheduleSuccess({
          items: dataParse,
          totalCount: data.data.result.totalCount
        })
      );
    } else {
      yield put(getListScheduleFailure(data));
    }
  } catch (error) {
    yield put(getListScheduleFailure(error));
  }
}
