import { getBannerFailure, getBannerSuccess } from '../../actions/banner';
import { call, put } from 'redux-saga/effects';
import { apiGetArticles } from '../../../services/api/getArticlesApi';
import { CATEGORY_TYPE } from '../../../global/app';

export function* getBannerSaga(payload) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.BANNER,
      maxResultCount: 5,
      ...payload.action
    };
    const data = yield call(apiGetArticles, params);
    if (data.status === 200) {
      yield put(
        getBannerSuccess({
          items: data.data.result.items
        })
      );
    } else {
      yield put(getBannerFailure(data));
    }
  } catch (error) {
    yield put(getBannerFailure(error));
  }
}
