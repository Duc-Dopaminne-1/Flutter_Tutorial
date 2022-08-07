import { INSURANCE } from '../../actionsType';
import { takeLatest, takeEvery } from 'redux-saga/effects';
import { getInsuranceByCategorySaga } from './getInsuranceByCategorySaga';
import { getInsuranceCategoriesSaga } from './getInsuranceCategoriesSaga';
import { getHighlightInsuranceCategorySaga } from './getHighlightInsuranceCategorySaga';
import { getInsuranceDetailSaga } from './getInsuranceDetailSaga';
import {
  getInsuranceOrderFormForCreateSaga,
  getInsuranceOrderFormForEditSaga,
  getInsuranceOrderFormSaga
} from './getInsuranceOrderForm';
import { createInsuranceOrderSaga, editInsuranceOrderSaga } from './createOrEditInsuranceOrderSaga';
import { getInsuranceListResponsesSaga } from './getInsuranceListResponsesSaga';
import { getInsuaranceRefundConfigSaga } from './getInsuaranceRefundConfigSaga';
import { createInsurancePaymentTransactionSaga } from './createInsurancePaymentTransactionSaga';

export default function* contactSagas() {
  yield takeLatest(INSURANCE.GET_INSURANCE_CATEGORIES.HANDLER, getInsuranceCategoriesSaga);
  yield takeEvery(INSURANCE.GET_INSURANCE_BY_CATEGORY.HANDLER, getInsuranceByCategorySaga);
  yield takeLatest(
    INSURANCE.GET_HIGHLIGHT_INSURANCE_CATEGORIES.HANDLER,
    getHighlightInsuranceCategorySaga
  );
  yield takeLatest(INSURANCE.GET_INSURANCE_DETAIL.HANDLER, getInsuranceDetailSaga);
  yield takeLatest(INSURANCE.GET_INSURANCE_ORDER_FORM.HANDLER, getInsuranceOrderFormSaga);

  yield takeLatest(INSURANCE.GET_LIST_RESPONSES.HANDLER, getInsuranceListResponsesSaga);
  yield takeLatest(INSURANCE.GET_INSUARANCE_REFUND_CONFIG.HANDLER, getInsuaranceRefundConfigSaga);
  yield takeLatest(
    INSURANCE.CREATE_INSURANCE_PAYMENT_TRANSACTION.HANDLER,
    createInsurancePaymentTransactionSaga
  );
  yield takeLatest(INSURANCE.CREATE_INSURANCE_ORDER.HANDLER, createInsuranceOrderSaga);
  yield takeLatest(INSURANCE.EDIT_INSURANCE_ORDER.HANDLER, editInsuranceOrderSaga);

  yield takeLatest(
    INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_CREATE.HANDLER,
    getInsuranceOrderFormForCreateSaga
  );

  yield takeLatest(
    INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_EDIT.HANDLER,
    getInsuranceOrderFormForEditSaga
  );
}
