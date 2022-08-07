import { call, put } from 'redux-saga/effects';
import { apiCreateDepositPaymentTransaction } from '../../../services/api/cashoutApi';
import { SYSTEM_ERROR } from '../../../constants/errors';
import { getShowAlertError } from '../../../redux/actions/system';

export function* createDepositPaymentTransactionSaga(action) {
  const { orderId, memberId, callback } = action.payload;
  try {
    const params = {
      orderId,
      memberId
    };
    const res = yield call(apiCreateDepositPaymentTransaction, params);
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
