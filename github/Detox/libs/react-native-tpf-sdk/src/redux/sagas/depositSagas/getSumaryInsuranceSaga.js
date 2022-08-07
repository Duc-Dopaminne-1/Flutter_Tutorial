import { call, put } from 'redux-saga/effects';
import { apiGetSummaryRefundInsurance } from '../../../services/api/depositApi';
import { getSummaryInsuranceSuccess } from '../../actions/deposit';

export function* getSumaryInsuranceSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiGetSummaryRefundInsurance, {
      ...params
    });

    if (data.status === 200) {
      yield put(
        getSummaryInsuranceSuccess({
          paidInsuranceCount: data?.data?.result?.paidCount,
          pendingInsuranceCount: data?.data?.result?.pendingCount
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
