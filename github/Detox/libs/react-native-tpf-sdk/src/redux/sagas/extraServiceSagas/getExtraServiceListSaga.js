import { getExtraServiceListSuccess, getExtraServiceListFailure } from '../../actions/extraService';
import { put, call } from 'redux-saga/effects';
import { LIMIT_PAGE, PRODUCT_CATEGORY_TYPE } from '../../../global/app';
import { getInsuranceCategories } from '../../../services/api/insuranceApi';

export function* getExtraServiceListSaga(obj) {
  try {
    const params = {
      productType: PRODUCT_CATEGORY_TYPE.EXTRA_SERVICE,
      maxResultCount: LIMIT_PAGE,
      ...obj.payload
    };
    const data = yield call(getInsuranceCategories, params);
    if (data.status === 200) {
      yield put(
        getExtraServiceListSuccess({
          ...data.data.result,
          loadMore: obj.payload?.skipCount > 0
        })
      );
    } else {
      yield put(getExtraServiceListFailure(data));
    }
  } catch (error) {
    yield put(getExtraServiceListFailure(error));
  }
}
