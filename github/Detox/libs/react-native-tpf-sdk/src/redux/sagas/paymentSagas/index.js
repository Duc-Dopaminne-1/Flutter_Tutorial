import { PAYMENT } from '../../actionsType';
import { takeLatest } from 'redux-saga/effects';
import { generateLinkSaga } from './generateLinkSaga';
import { getResponsePaymentSaga } from './getResponsePaymentSaga';
import { getPaymentResultSaga } from './getPaymentResultSaga';

export default function* paymentSagas() {
  yield takeLatest(PAYMENT.GENERATE_LINK.HANDLER, generateLinkSaga);
  yield takeLatest(PAYMENT.GET_RESPONSE_PAYMENT_DATA.HANDLER, getResponsePaymentSaga);
  yield takeLatest(PAYMENT.GET_PAYMENT_RESULT.HANDLER, getPaymentResultSaga);
}
