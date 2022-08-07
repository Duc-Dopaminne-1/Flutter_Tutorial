import { getAllTransactionFailure, getAllTransactionSuccess } from '../../actions/invoice';
import { call, put } from 'redux-saga/effects';
import { apiGetAllTransaction } from '../../../services/api/invoiceApi';

export function* getAllTransactionSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(apiGetAllTransaction, params);
    if (data.status === 200) {
      yield put(
        getAllTransactionSuccess({
          ...data.data.result,
          loadMore: params.skipCount > 0
        })
      );
    } else {
      yield put(getAllTransactionFailure(data));
    }
  } catch (error) {
    yield put(getAllTransactionFailure(error));
  }
}
