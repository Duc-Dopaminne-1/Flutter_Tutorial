import { getHighlightNewsFailure, getHighlightNewsSuccess } from '../../actions/news';
import { call, put } from 'redux-saga/effects';
import { apiGetArticles } from '../../../services/api/getArticlesApi';
import { CATEGORY_TYPE } from '../../../global/app';

export function* getHighlightNewsSaga(obj) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.NEWS,
      maxResultCount: 5,
      isHighlighted: true,
      ...obj.payload
    };
    const data = yield call(apiGetArticles, params);
    if (data.status === 200) {
      yield put(
        getHighlightNewsSuccess({
          items: data.data.result.items
        })
      );
    } else {
      yield put(getHighlightNewsFailure(data));
    }
  } catch (error) {
    yield put(getHighlightNewsFailure(error));
  }
}
