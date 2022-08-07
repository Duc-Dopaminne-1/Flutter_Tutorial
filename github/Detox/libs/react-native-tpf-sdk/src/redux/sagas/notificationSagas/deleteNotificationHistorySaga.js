import {
  deleteNotificationHistoryFailure,
  deleteNotificationHistorySuccess,
  getAllNotificationHistoryHandle
} from '../../actions/notification';
import { call, put } from 'redux-saga/effects';
import { apiDeleteNotificationHistory } from '../../../services/api/notificationApi';

export function* deleteNotificationHistorySaga(obj) {
  const { memberId, removeList, isDeleteAll = false, typeFilter } = obj.payload;
  try {
    const tempId = removeList.reduce(
      (accumulator, currentValue) => [...accumulator, currentValue?.id],
      []
    );

    const params = {
      memberId,
      id: tempId,
      isDeleteAll,
      typeFilter
    };
    const data = yield call(apiDeleteNotificationHistory, params);

    if (data.status === 200) {
      yield put(
        deleteNotificationHistorySuccess({
          data: data.data.result,
          isError: false,
          isSuccess: true
        })
      );
      yield put(
        getAllNotificationHistoryHandle({
          MemberId: memberId,
          Language: 'vi',
          SkipCount: 0,
          MaxResultCount: 10
        })
      );
    } else {
      yield put(
        deleteNotificationHistoryFailure({
          ...data?.response,
          isError: true,
          isSuccess: false
        })
      );
    }
  } catch (error) {
    yield put(deleteNotificationHistoryFailure(error));
  }
}
