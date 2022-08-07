import { call, put } from 'redux-saga/effects';
import { apiUpdateOrderStatus } from '../../../services/api/orderApi';
import {
  updateExtraServiceOrderStatusFailure,
  updateExtraServiceOrderStatusSuccess
} from '../../actions/extraService';

export function* updateOrderStatusSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(apiUpdateOrderStatus, params);
    if (data.status === 200) {
      yield put(
        updateExtraServiceOrderStatusSuccess({
          isSuccess: true,
          ...data?.data?.result,
          status: obj.payload?.status
        })
      );
    } else {
      yield put(
        updateExtraServiceOrderStatusFailure({
          ...data.response,
          isError: true
        })
      );
    }
  } catch (error) {
    yield put(updateExtraServiceOrderStatusFailure(error));
  }
}
