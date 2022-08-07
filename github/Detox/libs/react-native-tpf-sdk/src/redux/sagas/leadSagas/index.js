import { LEAD } from '../../actionsType';
import { takeLatest } from 'redux-saga/effects';
import { getLeadListSaga } from './getLeadListSaga';
import { getLeadDetailSaga } from './getLeadDetailSaga';
import { createOrEditLeadSaga } from './createOrEditLeadSaga';
import { deleteLeadSaga } from './deleteLeadSaga';
import { updateStatusLeadSaga } from './updateStatusLeadSaga';
import { getLeadStatusSummarySaga } from './getLeadStatusSummarySaga';
import { createRequestSaga } from './createRequestSaga';

export default function* contactSagas() {
  yield takeLatest(LEAD.GET_LEAD_LIST.HANDLER, getLeadListSaga);
  yield takeLatest(LEAD.GET_LEAD_DETAIL.HANDLER, getLeadDetailSaga);
  yield takeLatest(LEAD.CREATE_OR_EDIT.HANDLER, createOrEditLeadSaga);
  yield takeLatest(LEAD.DELETE_LEAD.HANDLER, deleteLeadSaga);
  yield takeLatest(LEAD.UPDATE_STATUS_LEAD.HANDLER, updateStatusLeadSaga);
  yield takeLatest(LEAD.GET_LEAD_STATUS_SUMMARY.HANDLER, getLeadStatusSummarySaga);
  yield takeLatest(LEAD.CREATE_REQUEST.HANDLER, createRequestSaga);
}
