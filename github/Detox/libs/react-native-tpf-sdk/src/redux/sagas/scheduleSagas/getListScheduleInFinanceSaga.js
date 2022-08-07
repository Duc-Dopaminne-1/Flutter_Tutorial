import { call, put, select } from 'redux-saga/effects';
import { LIMIT_PAGE } from '../../../global/app';
import { apiGetListSchedule } from '../../../services/api/scheduleApi';
import {
  getListInFinanceScheduleFailure,
  getListInFinanceScheduleSuccess
} from '../../actions/schedule';
import { parseScheduleList } from '../../parses/schedule';

export function* getListScheduleInFinanceSaga(obj) {
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
        getListInFinanceScheduleSuccess({
          items: dataParse,
          totalCount: data.data.result.totalCount
        })
      );
    } else {
      yield put(getListInFinanceScheduleFailure(data));
    }
  } catch (error) {
    yield put(getListInFinanceScheduleFailure(error));
  }
}
