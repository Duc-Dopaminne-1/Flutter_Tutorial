import { call, put } from 'redux-saga/effects';
import { apiGetTransactionById } from '../../../services/api/cashoutApi';
import { getTransactionByIdFailure, getTransactionByIdSuccess } from '../../actions/cashout';

export function* getTransactionByIdSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(apiGetTransactionById, params);
    if (data.status === 200) {
      yield put(
        getTransactionByIdSuccess({
          ...data.data.result,
          isSuccessDetail: true
        })
      );
    } else {
      yield put(getTransactionByIdFailure(data));
    }
  } catch (error) {
    yield put(getTransactionByIdFailure(error));
  }
}
