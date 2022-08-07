import { call, put } from 'redux-saga/effects';
import { apiGetSummaryDepositRefundTransaction } from '../../../services/api/depositApi';
import { getSummaryTransactionSuccess } from '../../actions/deposit';

export function* getSumaryTransactionSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiGetSummaryDepositRefundTransaction, {
      ...params
    });

    if (data.status === 200) {
      yield put(
        getSummaryTransactionSuccess({
          paidTransactionCount: data?.data?.result?.paidCount,
          pendingTransactionCount: data?.data?.result?.pendingCount
        })
      );
      yield callback(null, data.data);
    } else {
      yield callback(data, null);
    }
  } catch (error) {
    yield callback(error, null);
  }
}
