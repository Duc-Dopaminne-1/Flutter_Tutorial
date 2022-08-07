import { getSaleKitListFailure, getSaleKitListSuccess } from '../../actions/saleKit';
import { call, put } from 'redux-saga/effects';
import { apiGetArticles } from '../../../services/api/getArticlesApi';
import { CATEGORY_TYPE, LIMIT_PAGE } from '../../../global/app';

export function* getSaleKitListSaga(obj) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.SALE_KIT,
      maxResultCount: LIMIT_PAGE,
      isHighlighted: false,
      ...obj.payload
    };

    const data = yield call(apiGetArticles, params);

    if (data.status === 200) {
      yield put(
        getSaleKitListSuccess({
          items: data.data.result.items,
          totalCount: data.data.result.totalCount,
          cmsCategoryId: obj.payload.cmsCategoryId
        })
      );
    } else {
      yield put(getSaleKitListFailure(data));
    }
  } catch (error) {
    yield put(getSaleKitListFailure(error));
  }
}
