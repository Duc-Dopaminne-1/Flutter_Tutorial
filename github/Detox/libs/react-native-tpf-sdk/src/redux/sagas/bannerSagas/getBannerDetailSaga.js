import { getBannerDetailHandle, getBannerDetailSuccess } from '../../actions/banner';
import { call, put } from 'redux-saga/effects';
import { apiGetArticleDetail } from '../../../services/api/getArticlesApi';

export function* getBannerDetailSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetArticleDetail, params);
    if (data.status === 200) {
      yield put(
        getBannerDetailSuccess({
          item: data.data.result
        })
      );
    } else {
      yield put(getBannerDetailHandle(data));
    }
  } catch (error) {
    yield put(getBannerDetailHandle(error));
  }
}
