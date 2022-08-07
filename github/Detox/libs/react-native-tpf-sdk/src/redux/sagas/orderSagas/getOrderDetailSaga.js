import { getOrderDetailFailure, getOrderDetailSuccess } from '../../actions/order';
import { call, put } from 'redux-saga/effects';
import { apiGetOrderDetail } from '../../../services/api/orderApi';

export function* getOrderDetailSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(apiGetOrderDetail, params);
    if (data.status === 200) {
      yield put(
        getOrderDetailSuccess({
          item: data.data.result
        })
      );
    } else {
      yield put(getOrderDetailFailure(data.response));
    }
  } catch (error) {
    yield put(getOrderDetailFailure(error));
  }
}
