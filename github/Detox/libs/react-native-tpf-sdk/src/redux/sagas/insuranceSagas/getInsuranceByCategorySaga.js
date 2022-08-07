import {
  getInsuranceByCategoryFailure,
  getInsuranceByCategorySuccess
} from '../../actions/insurance';
import { call, put } from 'redux-saga/effects';
import { getInsuranceByCategory } from '../../../services/api/insuranceApi';
import { LIMIT_PAGE, PRODUCT_CATEGORY_TYPE } from '../../../global/app';

export function* getInsuranceByCategorySaga(obj) {
  try {
    const params = {
      maxResultCount: LIMIT_PAGE,
      productType: PRODUCT_CATEGORY_TYPE.INSURANCE,
      ...obj.payload
    };
    const data = yield call(getInsuranceByCategory, params);

    if (data.status === 200) {
      yield put(
        getInsuranceByCategorySuccess({
          ...data.data.result,
          ...params,
          loadMore: params.skipCount > 0
        })
      );
    } else {
      yield put(getInsuranceByCategoryFailure(data.response));
    }
  } catch (error) {
    yield put(getInsuranceByCategoryFailure(error));
  }
}
