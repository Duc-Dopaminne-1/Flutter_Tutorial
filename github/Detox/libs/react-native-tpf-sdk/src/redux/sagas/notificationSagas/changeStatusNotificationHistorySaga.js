import {
  changeStatusNotificationHistoryFailure,
  changeStatusNotificationHistorySuccess,
  getGeneralNotificationHandle,
  getPersonalNotificationHistoryHandle,
  getPromotionHandle
} from '../../actions/notification';
import { call, put } from 'redux-saga/effects';
import { apiChangeStatusNotificationHistory } from '../../../services/api/notificationApi';
import { store } from '../../store/configureStore';

export function* changeStatusNotificationHistorySaga(obj) {
  const {
    memberId,
    isChangeAll = false,
    idNotification,
    item,
    typeFilter,
    isPromotion
  } = obj.payload;
  const lang = store.getState()?.setting?.lang || '';

  try {
    const params = {
      memberId: memberId,
      isChangeAll,
      idNotification,
      TypeFilter: typeFilter
    };

    const data = yield call(apiChangeStatusNotificationHistory, params);

    if (data.status === 200) {
      if (!isChangeAll) {
        yield put(
          changeStatusNotificationHistorySuccess({
            data: data.data.result,
            action: 'success',
            item,
            idNotification
          })
        );
      } else {
        yield put(
          getGeneralNotificationHandle({
            MemberId: memberId,
            Language: lang,
            SkipCount: 0,
            TypeFilter: 2 // -> General Notifications
          })
        );
        yield put(
          getPersonalNotificationHistoryHandle({
            MemberId: memberId,
            Language: lang,
            SkipCount: 0,
            TypeFilter: 1 // -> General Notifications
          })
        );
        yield put(
          changeStatusNotificationHistorySuccess({
            data: data.data.result,
            action: 'success',
            isChangeAll
          })
        );
      }
      if (isPromotion) {
        yield put(getPromotionHandle({ memberId }));
      }
    } else {
      yield put(changeStatusNotificationHistoryFailure(data));
    }
  } catch (error) {
    yield put(changeStatusNotificationHistoryFailure(error));
  }
}
