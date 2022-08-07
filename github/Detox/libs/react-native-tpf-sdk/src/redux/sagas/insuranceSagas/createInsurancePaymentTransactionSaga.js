import { call, put } from 'redux-saga/effects';
import { SYSTEM_ERROR } from '../../../constants/errors';
import { getShowAlertError } from '../../../redux/actions/system';
import { apiCreateInsurancePaymentTransaction } from '../../../services/api/insuranceApi';

export function* createInsurancePaymentTransactionSaga(action) {
  const { orderId, memberId, callback } = action.payload;
  try {
    const params = {
      orderId,
      memberId
    };
    const res = yield call(apiCreateInsurancePaymentTransaction, params);
    if (res.status === 200) {
      callback?.(res?.data?.result);
      return;
    }
    yield put(getShowAlertError(SYSTEM_ERROR));
    callback?.(null);
  } catch (error) {
    yield put(getShowAlertError(SYSTEM_ERROR));
    callback?.(null);
  }
}
