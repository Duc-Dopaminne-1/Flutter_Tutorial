import { takeLatest } from 'redux-saga/effects';
import { CASHOUT } from '../../actionsType';
import { createOrEditAdvanceCommissionSaga } from './createOrEditAdvanceCommissionSaga';
import { createOrEditTransactionSaga } from './createOrEditTransactionSaga';
import { getAdvanceTransactionSaga } from './getAdvanceTransactionSaga';
import { getAllGlobalConfigSaga } from './getAllGlobalCongifSaga';
import { getTransactionByIdSaga } from './getTransactionByIdSaga';

export default function* invoiceSagas() {
  yield takeLatest(CASHOUT.CREATE_OR_EDIT_TRANSACTION.HANDLER, createOrEditTransactionSaga);
  yield takeLatest(CASHOUT.GET_TRANSACTION_BY_ID.HANDLER, getTransactionByIdSaga);
  yield takeLatest(CASHOUT.GET_ALL_GLOBAL_CONFIG.HANDLER, getAllGlobalConfigSaga);
  yield takeLatest(
    CASHOUT.CREATE_OR_EDIT_ADVANCE_COMMISSION.HANDLER,
    createOrEditAdvanceCommissionSaga
  );
  yield takeLatest(CASHOUT.GET_ADVANCE_TRANSACTION.HANDLER, getAdvanceTransactionSaga);
}
