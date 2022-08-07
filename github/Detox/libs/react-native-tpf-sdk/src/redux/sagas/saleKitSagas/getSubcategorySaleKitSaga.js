import { getSubCategorySaleKitFailure, getSubCategorySaleKitSuccess } from '../../actions/saleKit';
import { call, put } from 'redux-saga/effects';
import { apiGetCategorysApi } from '../../../services/api/getCategorysApi';
import { CATEGORY_TYPE } from '../../../global/app';

export function* getSubcategorySaleKitSaga(obj) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.SALE_KIT,
      ...obj.payload
    };
    const data = yield call(apiGetCategorysApi, params);

    if (data.status === 200) {
      const list = data.data.result.items.filter(t => t.parentCategoryId > 0) || [];
      const cmsCategoryId = obj.payload?.cmsCategoryId || 0;

      yield put(
        getSubCategorySaleKitSuccess({
          items: list,
          cmsCategoryId,
          totalCount: list.length
        })
      );
    } else {
      yield put(getSubCategorySaleKitFailure(data));
    }
  } catch (error) {
    yield put(getSubCategorySaleKitFailure(error));
  }
}
