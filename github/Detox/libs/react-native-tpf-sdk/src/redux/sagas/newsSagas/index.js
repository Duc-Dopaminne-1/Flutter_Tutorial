import { takeLatest } from 'redux-saga/effects';
import { NEWS } from '../../actionsType';
import { getHighlightNewsSaga } from './getHighlightNewsSaga';
import { getNewsDetailSaga } from './getNewsDetailSaga';
import { getNewsListSaga } from './getNewsListSaga';

export default function* newsSagas() {
  yield takeLatest(NEWS.GET_HIGHLIGHT_NEWS.HANDLER, getHighlightNewsSaga);
  yield takeLatest(NEWS.GET_NEWS_LIST.HANDLER, getNewsListSaga);
  yield takeLatest(NEWS.GET_NEWS_DETAIL.HANDLER, getNewsDetailSaga);
}
