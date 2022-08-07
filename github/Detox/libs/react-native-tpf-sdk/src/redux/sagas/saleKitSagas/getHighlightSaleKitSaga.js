import { getHighlightSaleKitFailure, getHighlightSaleKitSuccess } from '../../actions/saleKit';
import { call, put } from 'redux-saga/effects';
import { apiGetArticles } from '../../../services/api/getArticlesApi';
import { CATEGORY_TYPE, LIMIT_PAGE } from '../../../global/app';

export function* getHighlightSaleKitSaga(obj) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.SALE_KIT,
      maxResultCount: LIMIT_PAGE,
      isHighlighted: true,
      ...obj.payload
    };
    const data = yield call(apiGetArticles, params);

    if (data.status === 200) {
      yield put(
        getHighlightSaleKitSuccess({
          items: data.data.result.items,
          totalCount: data.data.result.totalCount,
          cmsCategoryId: obj.payload.cmsCategoryId
        })
      );
    } else {
      yield put(getHighlightSaleKitFailure(data));
    }
  } catch (error) {
    yield put(getHighlightSaleKitFailure(error));
  }
}
