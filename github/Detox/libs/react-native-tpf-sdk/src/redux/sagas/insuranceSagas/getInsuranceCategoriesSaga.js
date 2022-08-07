import {
  getInsuranceCategoriesFailure,
  getInsuranceCategoriesSuccess
} from '../../actions/insurance';
import { call, put } from 'redux-saga/effects';
import { getInsuranceCategories } from '../../../services/api/insuranceApi';
import { PRODUCT_CATEGORY_TYPE } from '../../../global/app';

export function* getInsuranceCategoriesSaga(obj) {
  try {
    const params = {
      productType: PRODUCT_CATEGORY_TYPE.INSURANCE,
      isHighlight: false,
      ...obj.payload
    };

    const data = yield call(getInsuranceCategories, params);

    if (data.status === 200) {
      yield put(
        getInsuranceCategoriesSuccess({
          ...data.data.result,
          loadMore: params.skipCount > 0
        })
      );
    } else {
      yield put(getInsuranceCategoriesFailure(data.response));
    }
  } catch (error) {
    yield put(getInsuranceCategoriesFailure(error));
  }
}
