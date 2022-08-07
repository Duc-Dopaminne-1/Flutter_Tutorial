import { getNewsListFailure, getNewsListSuccess } from '../../actions/news';
import { call, put } from 'redux-saga/effects';
import { apiGetArticles } from '../../../services/api/getArticlesApi';
import { CATEGORY_TYPE, LIMIT_PAGE } from '../../../global/app';

export function* getNewsListSaga(obj) {
  try {
    const params = {
      status: 'A',
      maxResultCount: LIMIT_PAGE,
      categoryType: CATEGORY_TYPE.NEWS,
      isHighlighted: false,
      ...obj.payload
    };

    const data = yield call(apiGetArticles, params);

    if (data.status === 200) {
      yield put(
        getNewsListSuccess({
          items: data.data.result.items,
          totalCount: data.data.result.totalCount
        })
      );
    } else {
      yield put(getNewsListFailure(data));
    }
  } catch (error) {
    yield put(getNewsListFailure(error));
  }
}
