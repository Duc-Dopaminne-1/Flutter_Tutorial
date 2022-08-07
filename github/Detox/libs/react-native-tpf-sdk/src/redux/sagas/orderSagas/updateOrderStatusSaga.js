import { updateOrderStatusFailure, updateOrderStatusSuccess } from '../../actions/order';
import { call, put } from 'redux-saga/effects';
import { apiUpdateOrderStatus } from '../../../services/api/orderApi';

export function* updateOrderStatusSaga(obj) {
  const { callback = () => {} } = obj.payload || {};
  try {
    const { params } = obj.payload || {};

    const data = yield call(apiUpdateOrderStatus, params);
    if (data.status === 200) {
      yield put(
        updateOrderStatusSuccess({
          isSuccess: true,
          ...data?.data?.result,
          status: obj.payload?.status
        })
      );
      yield callback(null, data);
    } else {
      yield put(updateOrderStatusFailure({ ...data.response, isError: true }));
      yield callback(data, null);
    }
  } catch (error) {
    yield put(updateOrderStatusFailure(error));
  }
}
