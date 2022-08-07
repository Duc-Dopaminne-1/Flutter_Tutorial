import { getPaymentResultSuccess, getPaymentResultFailure } from '../../../redux/actions/payment';
import { call, put } from 'redux-saga/effects';
import { apiGetPaymentResult } from '../../../services/api/payment';

export function* getPaymentResultSaga(obj) {
  try {
    const param = { ...obj.payload };
    const data = yield call(apiGetPaymentResult, param);

    if (data.status === 200) {
      yield put(getPaymentResultSuccess(data.data.result));
    } else {
      yield put(getPaymentResultFailure(data));
    }
  } catch (error) {
    yield put(getPaymentResultFailure(error));
  }
}
