import { takeLatest } from 'redux-saga/effects';
import { SALE_KIT } from '../../actionsType';
import { getSubcategorySaleKitSaga } from './getSubcategorySaleKitSaga';
import { getSaleKitListSaga } from './getSaleKitListSaga';
import { getHighlightSaleKitSaga } from './getHighlightSaleKitSaga';
import { getSaleKitDetailSaga } from './getSaleKitDetailSaga';

export default function* eventSagas() {
  yield takeLatest(SALE_KIT.GET_SUB_CATEGORY.HANDLER, getSubcategorySaleKitSaga);
  yield takeLatest(SALE_KIT.GET_SALE_KIT_LIST.HANDLER, getSaleKitListSaga);
  yield takeLatest(SALE_KIT.GET_HIGHLIGHT_SALE_KIT.HANDLER, getHighlightSaleKitSaga);
  yield takeLatest(SALE_KIT.GET_SALE_KIT_DETAIL.HANDLER, getSaleKitDetailSaga);
}
