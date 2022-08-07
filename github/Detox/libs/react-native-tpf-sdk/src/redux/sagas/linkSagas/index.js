import { LINK } from '../../actionsType';
import { takeLatest } from 'redux-saga/effects';
import { getLinkSaga } from './getLinkSaga';

export default function* linkSagas() {
  yield takeLatest(LINK.GET_LINK.HANDLER, getLinkSaga);
}
