import { call, put } from 'redux-saga/effects';
import { PRODUCT_CATEGORY_TYPE } from '../../../global/app';
import { apiGetAllCategory } from '../../../services/api/credit';
import { getAllCategoryFailure, getAllCategorySuccess } from '../../actions/credit';
import { loanCategoryParses } from '../../parses/credit';

export function* getAllCategorySaga(obj) {
  try {
    const params = {
      productType: PRODUCT_CATEGORY_TYPE.CREDIT,
      maxResultCount: 100,
      ...obj.payload
    };
    const data = yield call(apiGetAllCategory, params);
    if (data.status === 200) {
      const dataParse = loanCategoryParses(data.data.result.items);
      yield put(
        getAllCategorySuccess({
          data: dataParse
        })
      );
    } else {
      yield put(getAllCategoryFailure(data));
    }
  } catch (error) {
    yield put(getAllCategoryFailure(error));
  }
}
