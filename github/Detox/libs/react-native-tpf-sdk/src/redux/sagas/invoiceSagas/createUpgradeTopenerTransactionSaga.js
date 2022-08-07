import {
  createUpgradeTopnerTransactionSuccess,
  createUpgradeTopnerTransactionFailure
} from '../../actions/invoice';
import { call, put } from 'redux-saga/effects';
import { apiCreateUpgradeTopenerTransaction } from '../../../services/api/invoiceApi';

export function* createUpgradeTopenerTransactionSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(apiCreateUpgradeTopenerTransaction, params);
    if (data.status === 200) {
      yield put(
        createUpgradeTopnerTransactionSuccess({
          ...data.data.result,
          isSuccess: true
        })
      );
    } else {
      yield put(createUpgradeTopnerTransactionFailure({ ...data, isError: true }));
    }
  } catch (error) {
    yield put(createUpgradeTopnerTransactionFailure(error));
  }
}
