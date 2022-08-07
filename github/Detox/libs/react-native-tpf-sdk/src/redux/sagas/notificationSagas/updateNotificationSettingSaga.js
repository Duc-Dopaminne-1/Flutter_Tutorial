import {
  getUpdateNotificationSettingFailure,
  getUpdateNotificationSettingSuccess
} from '../../actions/notification';
import { call, put } from 'redux-saga/effects';
import { apiUpdateNotificationSetting } from '../../../services/api/notificationApi';

export function* updateNotificationSettingSaga(obj) {
  const {
    memberId,
    pushNotification,
    smsNotification,
    emailNotification,
    transactionNotification,
    rankNotification,
    supportNotification,
    cmsNotification,
    promotionNotification
  } = obj.payload;
  try {
    const params = {
      memberId: memberId,
      pushNotification: pushNotification,
      smsNotification: smsNotification,
      emailNotification: emailNotification,
      transactionNotification: transactionNotification,
      rankNotification: rankNotification,
      supportNotification: supportNotification,
      cmsNotification: cmsNotification,
      promotionNotification: promotionNotification
    };

    const data = yield call(apiUpdateNotificationSetting, params);
    if (data.status === 200) {
      yield put(getUpdateNotificationSettingSuccess(data.data));
    } else {
      yield put(getUpdateNotificationSettingFailure(data));
    }
  } catch (error) {
    yield put(getUpdateNotificationSettingFailure(error));
  }
}
