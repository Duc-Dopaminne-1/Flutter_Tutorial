import { takeLatest } from 'redux-saga/effects';
import { EVENT } from '../../actionsType';
import { getEventDetailSaga } from './getEventDetailSaga';
import { getEventListSaga } from './getEventListSaga';
import { getHighlightEventSaga } from './getHighlightEventSaga';

export default function* eventSagas() {
  yield takeLatest(EVENT.GET_HIGHLIGHT_EVENT.HANDLER, getHighlightEventSaga);
  yield takeLatest(EVENT.GET_EVENT_LIST.HANDLER, getEventListSaga);
  yield takeLatest(EVENT.GET_EVENT_DETAIL.HANDLER, getEventDetailSaga);
}
