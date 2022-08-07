import { INVOICE } from '../../actionsType';
import { takeLatest } from 'redux-saga/effects';
import { createOrEditInvoiceSaga } from './createOrEditInvoiceSaga';
import { createUpgradeTopenerTransactionSaga } from './createUpgradeTopenerTransactionSaga';
import { getAllInvoiceSaga } from './getAllInvoiceSaga';
import { getAllTransactionSaga } from './getAllTransactionSaga';

export default function* invoiceSagas() {
  yield takeLatest(INVOICE.CREATE_OR_EDIT_INVOICE.HANDLER, createOrEditInvoiceSaga);
  yield takeLatest(INVOICE.GET_ALL_INVOICE.HANDLER, getAllInvoiceSaga);
  yield takeLatest(INVOICE.GET_ALL_TRANSACTION.HANDLER, getAllTransactionSaga);
  yield takeLatest(
    INVOICE.CREATE_UPGRADE_TOPENER_TRANSACTION.HANDLER,
    createUpgradeTopenerTransactionSaga
  );
}
