import { getCreditByCategoryFailure, getCreditByCategorySuccess } from '../../actions/credit';
import { call, put } from 'redux-saga/effects';
import { getCreditByCategory } from '../../../services/api/credit';
import { LIMIT_PAGE, PRODUCT_CATEGORY_TYPE } from '../../../global/app';

export function* getCreditByCategorySaga(obj) {
  try {
    const params = {
      maxResultCount: LIMIT_PAGE,
      productType: PRODUCT_CATEGORY_TYPE.CREDIT,
      ...obj.payload
    };
    const data = yield call(getCreditByCategory, params);

    if (data.status === 200) {
      yield put(
        getCreditByCategorySuccess({
          ...data.data.result,
          ...params,
          loadMore: params.skipCount > 0
        })
      );
    } else {
      yield put(getCreditByCategoryFailure(data.response));
    }
  } catch (error) {
    yield put(getCreditByCategoryFailure(error));
  }
}
