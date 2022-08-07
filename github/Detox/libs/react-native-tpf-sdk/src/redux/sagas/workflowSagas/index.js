import { takeLatest } from 'redux-saga/effects';
import { WORKFLOW } from '../../actionsType';
import { getNewActionSaga } from './getNewAction';

export default function* workflowSagas() {
  yield takeLatest(WORKFLOW.GET_NEW_ACTION.HANDLER, getNewActionSaga);
}
