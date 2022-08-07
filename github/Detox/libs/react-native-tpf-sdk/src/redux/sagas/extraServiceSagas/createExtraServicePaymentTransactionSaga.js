import { call, put } from 'redux-saga/effects';
import { SYSTEM_ERROR } from '../../../constants/errors';
import { getShowAlertError } from '../../../redux/actions/system';
import { apiCreateAddedServicesPaymentTransaction } from '../../../services/api/extraServiceApi';

export function* createExtraServicePaymentTransactionSaga(action) {
  const { orderId, memberId, callback } = action.payload;
  try {
    const params = {
      orderId,
      memberId
    };
    const res = yield call(apiCreateAddedServicesPaymentTransaction, params);
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
