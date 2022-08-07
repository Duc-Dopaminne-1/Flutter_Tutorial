import { NOTIFICATION } from '../../actionsType';
import { takeLatest } from 'redux-saga/effects';
import { changeStatusNotificationHistorySaga } from './changeStatusNotificationHistorySaga';
import { deleteNotificationHistorySaga } from './deleteNotificationHistorySaga';
import { getGeneralNotificationSaga } from './getGeneralNotificationSaga';
import { getNotificationSettingSaga } from './getNotificationSettingSaga';
import { getPersonalNotificationSaga } from './getPersonalNotificationSaga';
import { getPromotionSaga } from './getPromotionSaga';
import { updateNotificationSettingSaga } from './updateNotificationSettingSaga';

export default function* notificationSaga() {
  yield takeLatest(
    NOTIFICATION.GET_GENERAL_NOTIFICATION_HISTORY.HANDLER,
    getGeneralNotificationSaga
  );
  yield takeLatest(
    NOTIFICATION.NOTIFICATION_HISTORY_CHANGE_STATUS.HANDLER,
    changeStatusNotificationHistorySaga
  );
  yield takeLatest(NOTIFICATION.DELETE_NOTIFICATION_HISTORY.HANDLER, deleteNotificationHistorySaga);
  yield takeLatest(
    NOTIFICATION.GET_PERSONAL_NOTIFICATION_HISTORY.HANDLER,
    getPersonalNotificationSaga
  );
  yield takeLatest(NOTIFICATION.GET_NOTIFICATION_SETTING.HANDLER, getNotificationSettingSaga);
  yield takeLatest(NOTIFICATION.UPDATE_NOTIFICATION_SETTING.HANDLER, updateNotificationSettingSaga);
  yield takeLatest(NOTIFICATION.GET_PROMOTION.HANDLER, getPromotionSaga);
}
