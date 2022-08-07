import { takeLatest } from '@redux-saga/core/effects';
import { PARTNER } from '../../actionsType';
import { getPartnerDetailSaga } from './getPartnerDetailSaga';
import { getPartnerListSaga } from './getPartnerListSaga';

export default function* partnerSagas() {
  yield takeLatest(PARTNER.GET_PARTNER_LIST.HANDLER, getPartnerListSaga);
  yield takeLatest(PARTNER.GET_PARTNER_DETAIL.HANDLER, getPartnerDetailSaga);
}
