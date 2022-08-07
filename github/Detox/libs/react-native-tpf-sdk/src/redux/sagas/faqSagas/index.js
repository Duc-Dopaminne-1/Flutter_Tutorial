import { takeLatest } from 'redux-saga/effects';
import { FAQ } from '../../actionsType';
import { closeFAQRequestSaga } from './closeFAQRequestSaga';
import { createFAQSupportSaga } from './createFAQSupportSaga';
import { feedbackToOperatorSaga } from './feedbackToOperatorSaga';
import { getClosedListFAQSupportSaga } from './getClosedListFAQSupportSaga';
import { getFAQDetailsListSaga } from './getFAQDetailsListSaga';
import { getFAQListSaga } from './getFAQListSaga';
import { getFAQSupportDetailSaga } from './getFAQSupportDetailSaga';
import { getProcessingListFAQSupportSaga } from './getProcessingListFAQSupportSaga';
import { getWaitingListFAQSupportSaga } from './getWaitingListFAQSupportSaga';
import { getFAQSupportSummarySaga } from './getFAQSupportSummarySaga';

export default function* fAQSagas() {
  yield takeLatest(FAQ.GET_FAQ_LIST.HANDLER, getFAQListSaga);
  yield takeLatest(FAQ.GET_FAQ_DETAILS_LIST.HANDLER, getFAQDetailsListSaga);
  yield takeLatest(FAQ.CREATE_FAQ_SUPPORT.HANDLER, createFAQSupportSaga);
  yield takeLatest(FAQ.GET_PROCESSING_FAQ_SUPPORT_LIST.HANDLER, getProcessingListFAQSupportSaga);
  yield takeLatest(FAQ.GET_WAITING_FAQ_SUPPORT_LIST.HANDLER, getWaitingListFAQSupportSaga);
  yield takeLatest(FAQ.GET_CLOSED_FAQ_SUPPORT_LIST.HANDLER, getClosedListFAQSupportSaga);
  yield takeLatest(FAQ.GET_FAQ_SUPPORT_DETAIL.HANDLER, getFAQSupportDetailSaga);
  yield takeLatest(FAQ.FEEDBACK_TO_OPERATOR.HANDLER, feedbackToOperatorSaga);
  yield takeLatest(FAQ.CLOSE_REQUEST.HANDLER, closeFAQRequestSaga);
  yield takeLatest(FAQ.GET_FAQ_SUPPORT_LIST_SUMMARY.HANDLER, getFAQSupportSummarySaga);
}
