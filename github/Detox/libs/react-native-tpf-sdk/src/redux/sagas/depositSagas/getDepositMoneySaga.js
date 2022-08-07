import { call, put } from 'redux-saga/effects';
import { apiGetDepositMoney } from '../../../services/api/depositApi';
import { getDepositMoneyFailure, getDepositMoneySuccess } from '../../actions/deposit';

export function* getDepositMoneySaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetDepositMoney, params);

    if (data.status === 200) {
      yield put(
        getDepositMoneySuccess({
          rs: data.data.result
        })
      );
    } else {
      yield put(getDepositMoneyFailure());
    }
  } catch (error) {
    yield put(getDepositMoneyFailure(error));
  }
}
