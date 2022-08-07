import { takeLatest } from 'redux-saga/effects';
import { BANNER } from '../../actionsType';
import { getBannerDetailSaga } from './getBannerDetailSaga';
import { getBannerSaga } from './getBannerSaga';

export default function* bannerSagas() {
  yield takeLatest(BANNER.GET_BANNER.HANDLER, getBannerSaga);
  yield takeLatest(BANNER.GET_BANNER_DETAIL.HANDLER, getBannerDetailSaga);
}
