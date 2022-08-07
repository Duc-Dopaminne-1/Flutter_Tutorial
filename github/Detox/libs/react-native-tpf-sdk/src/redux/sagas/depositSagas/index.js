import { takeLatest } from 'redux-saga/effects';
import { DEPOSIT } from '../../actionsType';
import { getDepositMoneySaga } from './getDepositMoneySaga';
import { getSumaryTransactionSaga } from './getSumaryTransactionSaga';
import { getListDepositRefundRequestSaga } from './getListDepositRefundRequestSaga';
import { getSumaryInsuranceSaga } from './getSumaryInsuranceSaga';

export default function* eventSagas() {
  yield takeLatest(DEPOSIT.GET_DEPOSIT_MONEY.HANDLER, getDepositMoneySaga);
  yield takeLatest(DEPOSIT.GET_LIST_REFUND_REQUEST.HANDLER, getListDepositRefundRequestSaga);
  yield takeLatest(DEPOSIT.GET_SUMMARY_TRANSACTION.HANDLER, getSumaryTransactionSaga);
  yield takeLatest(DEPOSIT.GET_SUMMARY_INSURANCE.HANDLER, getSumaryInsuranceSaga);
}
