import { getOrderTotalRecordFailure, getOrderTotalRecordSuccess } from '../../actions/order';
import { call, put } from 'redux-saga/effects';
import { apiGetTotalOrderSummary } from '../../../services/api/orderApi';

export function* getOrderTotalRecordSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(apiGetTotalOrderSummary, params);

    if (data.status === 200) {
      yield put(
        getOrderTotalRecordSuccess({
          ...data.data.result
        })
      );
    } else {
      yield put(getOrderTotalRecordFailure(data.response));
    }
  } catch (error) {
    yield put(getOrderTotalRecordFailure(error));
  }
}
