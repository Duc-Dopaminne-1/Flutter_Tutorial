import { call, put } from 'redux-saga/effects';
import { apiCancelFinaneDealOrder } from '../../../services/api/credit';
import { deleteFinaneDealOrderSuccess, deleteFinaneDealOrderFailure } from '../../actions/credit';

export function* deleteFinanceDealOrderSaga(obj) {
  try {
    const { action, orderId } = obj.payload;
    const params = { orderId };
    const data = yield call(apiCancelFinaneDealOrder, params);
    if (data.status === 200) {
      yield put(
        deleteFinaneDealOrderSuccess({
          action
        })
      );
    } else {
      yield put(deleteFinaneDealOrderFailure(data?.data?.error));
    }
  } catch (error) {
    yield put(deleteFinaneDealOrderFailure(error));
  }
}
