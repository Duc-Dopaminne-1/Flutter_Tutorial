import { takeLatest } from 'redux-saga/effects';
import { MASTER_DATA } from '../../actionsType';
import { getMasterDataSaga } from './getMasterDataSaga';
import { getAllTriggerSagas } from './getAllTriggerSagas';
import { getFlowByTriggerCodeSagas } from './getFlowByTriggerCodeSagas';
import { getBecomeTopenerSagas } from './getBecomeTopenerSagas';
import { getInfoServiceSaga } from './getInfoServiceSaga';
import { getListTriggerSaga } from './getListTriggerSaga';

export default function* masterDataSagas() {
  yield takeLatest(MASTER_DATA.GET_ALL.HANDLER, getMasterDataSaga);
  yield takeLatest(MASTER_DATA.GET_ALL_TRIGGER.HANDLER, getAllTriggerSagas);
  yield takeLatest(MASTER_DATA.GET_FLOW_BY_TRIGGER_CODE.HANDLER, getFlowByTriggerCodeSagas);
  yield takeLatest(MASTER_DATA.GET_BECOME_TOPENER.HANDLER, getBecomeTopenerSagas);
  yield takeLatest(MASTER_DATA.GET_INFO_SERVICE.HANDLER, getInfoServiceSaga);
  yield takeLatest(MASTER_DATA.GET_LIST_TRIGGER.HANDLER, getListTriggerSaga);
}
