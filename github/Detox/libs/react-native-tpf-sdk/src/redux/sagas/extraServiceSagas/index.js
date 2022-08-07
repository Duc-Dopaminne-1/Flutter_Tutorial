import { EXTRA_SERVICE } from '../../actionsType';
import { takeLatest } from 'redux-saga/effects';
import {
  createExtraServiceOrderSaga,
  editExtraServiceOrderSaga
} from './createExtraServiceOrderSaga';
import { getExtraServiceDetailSaga } from './getExtraServiceDetailSaga';
import { getExtraServiceListSaga } from './getExtraServiceListSaga';
import {
  getAddedOrderFormForCreateSaga,
  getExtraServiceOrderFormSaga
} from './getExtraServiceOrderFormSaga';
import { getExtraServiceTotalRecordSaga } from './getExtraServiceTotalRecordSaga';
import { getOrderDetailSaga } from './getOrderDetailSaga';
import { getOrderListSaga } from './getOrderListSaga';
import { updateOrderStatusSaga } from './updateOrderStatusSaga';
import { createExtraServicePaymentTransactionSaga } from './createExtraServicePaymentTransactionSaga';

export default function* extraServiceSagas() {
  yield takeLatest(EXTRA_SERVICE.GET_ORDER_LIST.HANDLER, getOrderListSaga);
  yield takeLatest(EXTRA_SERVICE.GET_ORDER_DETAIL.HANDLER, getOrderDetailSaga);
  yield takeLatest(EXTRA_SERVICE.UPDATE_ORDER_STATUS.HANDLER, updateOrderStatusSaga);
  yield takeLatest(EXTRA_SERVICE.GET_PRODUCT_LIST.HANDLER, getExtraServiceListSaga);
  yield takeLatest(EXTRA_SERVICE.GET_PRODUCT_DETAIL.HANDLER, getExtraServiceDetailSaga);
  yield takeLatest(EXTRA_SERVICE.CREATE_ORDER.HANDLER, createExtraServiceOrderSaga);
  yield takeLatest(EXTRA_SERVICE.GET_ORDER_FORM.HANDLER, getExtraServiceOrderFormSaga);
  yield takeLatest(EXTRA_SERVICE.GET_TOTAL_RECORD.HANDLER, getExtraServiceTotalRecordSaga);
  yield takeLatest(
    EXTRA_SERVICE.CREATE_EXTRA_SERVICE_PAYMENT_TRANSACTION.HANDLER,
    createExtraServicePaymentTransactionSaga
  );
  yield takeLatest(EXTRA_SERVICE.EDIT_ORDER.HANDLER, editExtraServiceOrderSaga);
  yield takeLatest(
    EXTRA_SERVICE.GET_ADDED_ORDER_FORM_FOR_CREATE.HANDLER,
    getAddedOrderFormForCreateSaga
  );
}
