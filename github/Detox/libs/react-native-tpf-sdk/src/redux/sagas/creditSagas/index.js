import { takeLatest, takeEvery } from 'redux-saga/effects';
import { CREDIT } from '../../actionsType';
import { deleteLeadSaga } from '../leadSagas/deleteLeadSaga';
import { compareProductsSaga } from './compareProductsSaga';
import { confirmRefundRequestSaga } from './confirmRefundRequestSaga';
import { createFinanceDealOrderSaga, editDealSaga } from './createOrEditCreditOrderSaga';
import { getAllCategorySaga } from './getAllCategorySaga';
import { getListResponsesSaga } from './getListResponsesSaga';
import { getCreateDealOrderFormSaga, getFinanceDealOrderFormSaga } from './getLoanOrderForm';
import { getLoanProductDetailSaga } from './getLoanProductDetailSaga';
import { getLoanProductListSaga } from './getLoanProductListSaga';
import { getOrderListSaga } from './getOrderListSaga';
import { getTotalRecordSaga } from './getTotalRecordSaga';
import { needSupportSaga } from './needSuportSagaSaga';
import { setDealNewFlagSaga } from './setDealNewFlagSaga';
import { getCreditByCategorySaga } from './getCreditByCategorySaga';
import { createDepositPaymentTransactionSaga } from './createDepositPaymentTransactionSaga';
import { deleteFinanceDealOrderSaga } from './deleteFinanceDealOrderSaga';

export default function* creditSaga() {
  yield takeLatest(CREDIT.GET_LOAN_PRODUCT_LIST.HANDLER, getLoanProductListSaga);
  yield takeLatest(CREDIT.GET_ALL_CATEGORY.HANDLER, getAllCategorySaga);
  yield takeLatest(CREDIT.GET_LOAN_PRODUCT_DETAIL.HANDLER, getLoanProductDetailSaga);
  yield takeLatest(CREDIT.GET_FINANCEDEAL_ORDER_FORM.HANDLER, getFinanceDealOrderFormSaga);
  yield takeLatest(CREDIT.GET_ORDER_LIST.HANDLER, getOrderListSaga);
  yield takeLatest(CREDIT.GET_LIST_RESPONSES.HANDLER, getListResponsesSaga);
  yield takeLatest(CREDIT.COMPARE_PRODUCTS.HANDLER, compareProductsSaga);
  yield takeLatest(CREDIT.GET_TOTAL_RECORD.HANDLER, getTotalRecordSaga);
  yield takeLatest(CREDIT.SET_DEAL_NEW_FLAG.HANDLER, setDealNewFlagSaga);
  yield takeLatest(CREDIT.DELETE_DEAL.HANDLER, deleteLeadSaga);
  yield takeLatest(CREDIT.CONFIRM_REFUND_REQUEST.HANDLER, confirmRefundRequestSaga);
  yield takeLatest(CREDIT.NEED_SUPPORT.HANDLER, needSupportSaga);
  yield takeEvery(CREDIT.GET_CREDIT_BY_CATEGORY.HANDLER, getCreditByCategorySaga);
  yield takeLatest(
    CREDIT.CREATE_DEPOSIT_PAYMENT_TRANSACTION.HANDLER,
    createDepositPaymentTransactionSaga
  );
  yield takeLatest(CREDIT.GET_CREATE_DEAL_ORDER_FORM.HANDLER, getCreateDealOrderFormSaga);
  yield takeLatest(CREDIT.CREATE_FINANE_DEAL_ORDER.HANDLER, createFinanceDealOrderSaga);
  yield takeLatest(CREDIT.EDIT_DEAL.HANDLER, editDealSaga);
  yield takeLatest(CREDIT.DELETE_FINANE_DEAL_ORDER.HANDLER, deleteFinanceDealOrderSaga);
}
