import { getNewsDetailFailure, getNewsDetailSuccess } from '../../actions/news';
import { call, put } from 'redux-saga/effects';
import { apiGetArticleDetail } from '../../../services/api/getArticlesApi';

export function* getNewsDetailSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetArticleDetail, params);
    if (data.status === 200) {
      yield put(
        getNewsDetailSuccess({
          item: data.data.result
        })
      );
    } else {
      yield put(getNewsDetailFailure(data));
    }
  } catch (error) {
    yield put(getNewsDetailFailure(error));
  }
}
