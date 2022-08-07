import {
  getNotificationSettingFailure,
  getNotificationSettingSuccess
} from '../../actions/notification';
import { call, put } from 'redux-saga/effects';
import { apiNotificationSetting } from '../../../services/api/notificationApi';

export function* getNotificationSettingSaga(obj) {
  try {
    const params = {
      memberId: obj.payload.MemberId
    };

    const data = yield call(apiNotificationSetting, params);

    if (data.status === 200) {
      yield put(
        getNotificationSettingSuccess({
          notificationSetting: data.data.result
        })
      );
    } else {
      yield put(getNotificationSettingFailure(data));
    }
  } catch (error) {
    yield put(getNotificationSettingFailure(error));
  }
}
