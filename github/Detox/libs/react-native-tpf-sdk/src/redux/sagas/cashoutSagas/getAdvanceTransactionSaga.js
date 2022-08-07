import { call, put } from 'redux-saga/effects';
import { apiGetAdvanceTransactionHistory } from '../../../services/api/cashoutApi';
import { getAdvanceTransactionFailure, getAdvanceTransactionSuccess } from '../../actions/cashout';

export function* getAdvanceTransactionSaga(obj) {
  const { params } = obj?.payload || {};
  try {
    const data = yield call(apiGetAdvanceTransactionHistory, params);
    if (data.status === 200) {
      yield put(
        getAdvanceTransactionSuccess({
          items: data?.data?.result?.items,
          isEndList: data?.data?.result?.transaction?.length < params?.maxResultCount,
          skipCount: params?.skipCount || 0
        })
      );
    } else {
      yield put(getAdvanceTransactionFailure(data));
    }
  } catch (error) {
    yield put(getAdvanceTransactionFailure(error));
  }
}
