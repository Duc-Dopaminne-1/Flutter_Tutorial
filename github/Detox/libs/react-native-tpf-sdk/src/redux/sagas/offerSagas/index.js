import { takeLatest } from 'redux-saga/effects';
import { OFFER } from '../../actionsType';
import { getOfferListSaga } from './getOfferListSaga';
import { getOfferDetailSaga } from './getOfferDetailSaga';
import { getHighlightOfferSaga } from './getHighlightOfferSaga';

export default function* offerSagas() {
  yield takeLatest(OFFER.GET_HIGHLIGHT_OFFER.HANDLER, getHighlightOfferSaga);
  yield takeLatest(OFFER.GET_OFFER_LIST.HANDLER, getOfferListSaga);
  yield takeLatest(OFFER.GET_OFFER_DETAIL.HANDLER, getOfferDetailSaga);
}
