import { deleteOrderFailure, deleteOrderSuccess } from '../../actions/order';
import { call, put } from 'redux-saga/effects';
import { apiDeleteInsuranceOrder } from '../../../services/api/orderApi';

export function* deleteOrderSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(apiDeleteInsuranceOrder, params);
    if (data.status === 200) {
      yield put(deleteOrderSuccess(data.data));
    } else {
      yield put(deleteOrderFailure(data.response));
    }
  } catch (error) {
    yield put(deleteOrderFailure(error));
  }
}
