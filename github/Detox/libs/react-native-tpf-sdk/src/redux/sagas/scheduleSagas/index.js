import { SCHEDULE } from '../../actionsType';
import { takeLatest } from 'redux-saga/effects';
import { createOrEditScheduleSaga } from './createOrEditScheduleSaga';
import { deleteScheduleSaga } from './deleteScheduleSaga';
import { getListScheduleInFinanceSaga } from './getListScheduleInFinanceSaga';
import { getListScheduleInLeadSaga } from './getListScheduleInLeadSaga';
import { getListScheduleSaga } from './getListScheduleSaga';
import { getScheduleDetailSaga } from './getScheduleDetailSaga';
import { updateScheduleStatusSaga } from './updateScheduleStatus';
import { exportFileSaga } from './exportFileSaga';

export default function* scheduleSagas() {
  yield takeLatest(SCHEDULE.GET_LIST.HANDLER, getListScheduleSaga);
  yield takeLatest(SCHEDULE.GET_LIST_IN_LEAD.HANDLER, getListScheduleInLeadSaga);
  yield takeLatest(SCHEDULE.GET_LIST_IN_FINANCE.HANDLER, getListScheduleInFinanceSaga);
  yield takeLatest(SCHEDULE.CREATE_OR_EDIT.HANDLER, createOrEditScheduleSaga);
  yield takeLatest(SCHEDULE.DELETE.HANDLER, deleteScheduleSaga);
  yield takeLatest(SCHEDULE.GET_DETAIL.HANDLER, getScheduleDetailSaga);
  yield takeLatest(SCHEDULE.UPDATE_STATUS.HANDLER, updateScheduleStatusSaga);
  yield takeLatest(SCHEDULE.EXPORT_FILE.HANDLER, exportFileSaga);
}
