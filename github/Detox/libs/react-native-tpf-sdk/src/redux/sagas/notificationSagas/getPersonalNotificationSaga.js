import {
  getPersonalNotificationFailure,
  getPersonalNotificationSuccess
} from '../../actions/notification';
import { call, put } from 'redux-saga/effects';
import { apiGetAllNotificationHistory } from '../../../services/api/notificationApi';
import { LIMIT_PAGE } from '../../../global/app';

export function* getPersonalNotificationSaga(obj) {
  const { MemberId, SkipCount, Language } = obj.payload;
  try {
    const params = {
      Language,
      MaxResultCount: LIMIT_PAGE,
      SkipCount: SkipCount || 0,
      memberId: MemberId,
      TypeFilter: 1
    };

    const data = yield call(apiGetAllNotificationHistory, params);

    if (data.status === 200) {
      yield put(
        getPersonalNotificationSuccess({
          data: data.data.result,
          isLoadMore: SkipCount > 0
        })
      );
    } else {
      yield put(getPersonalNotificationFailure(data));
    }
  } catch (error) {
    yield put(getPersonalNotificationFailure(error));
  }
}
