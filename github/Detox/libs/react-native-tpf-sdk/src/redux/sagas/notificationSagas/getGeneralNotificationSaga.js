import {
  getGeneralNotificationFailure,
  getGeneralNotificationSuccess
} from '../../actions/notification';
import { call, put } from 'redux-saga/effects';
import { apiGetAllNotificationHistory } from '../../../services/api/notificationApi';
import { LIMIT_PAGE } from '../../../global/app';

export function* getGeneralNotificationSaga(obj) {
  const { MemberId, SkipCount } = obj.payload;
  try {
    const params = {
      Language: 'vi',
      MaxResultCount: LIMIT_PAGE,
      SkipCount: SkipCount || 0,
      memberId: MemberId,
      TypeFilter: 2
    };

    const data = yield call(apiGetAllNotificationHistory, params);

    if (data.status === 200) {
      yield put(
        getGeneralNotificationSuccess({
          data: data.data.result,
          isLoadMore: SkipCount > 0
        })
      );
    } else {
      yield put(getGeneralNotificationFailure(data));
    }
  } catch (error) {
    yield put(getGeneralNotificationFailure(error));
  }
}
