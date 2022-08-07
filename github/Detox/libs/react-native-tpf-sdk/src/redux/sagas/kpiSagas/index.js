import { KPI } from '../../actionsType';
import { takeLatest } from 'redux-saga/effects';
import { getGroupKpiListSaga } from './getGroupKpiListSaga';
import { getGroupKpiSumarySaga } from './getGroupKpiSumarySaga';
import { getPersonalKpiListSaga } from './getPersonalKpiListSaga';
import { getPersonalKpiSumarySaga } from './getPersonalKpiSumarySaga';
import { getPersonalKpDetailSaga } from './getPersonalKpiDetailSaga';
import { getGroupKpiDetailSaga } from './getGroupKpiDetailSaga';

export default function* eventSagas() {
  yield takeLatest(KPI.GET_PERSONAL_KPI_LIST.HANDLER, getPersonalKpiListSaga);
  yield takeLatest(KPI.GET_PERSONAL_KPI_DETAIL.HANDLER, getPersonalKpDetailSaga);
  yield takeLatest(KPI.GET_PERSONAL_KPI_STATUS_SUMARY.HANDLER, getPersonalKpiSumarySaga);
  yield takeLatest(KPI.GET_GROUP_KPI_LIST.HANDLER, getGroupKpiListSaga);
  yield takeLatest(KPI.GET_GROUP_KPI_STATUS_SUMARY.HANDLER, getGroupKpiSumarySaga);
  yield takeLatest(KPI.GET_GROUP_KPI_DETAIL.HANDLER, getGroupKpiDetailSaga);
}
