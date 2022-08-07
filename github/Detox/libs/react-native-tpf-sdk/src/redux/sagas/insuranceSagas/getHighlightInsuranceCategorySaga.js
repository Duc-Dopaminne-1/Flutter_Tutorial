import {
  getHighlightInsuranceCategoriesSuccess,
  getHighlightInsuranceCategoriesFailure
} from '../../actions/insurance';
import { call, put } from 'redux-saga/effects';
import { getInsuranceCategories } from '../../../services/api/insuranceApi';
import { PRODUCT_CATEGORY_TYPE, LIMIT_PAGE } from '../../../global/app';

export function* getHighlightInsuranceCategorySaga(obj) {
  try {
    const params = {
      productType: PRODUCT_CATEGORY_TYPE.INSURANCE,
      isHighlight: true,
      maxResultCount: LIMIT_PAGE
    };

    const data = yield call(getInsuranceCategories, params);
    if (data.status === 200) {
      yield put(
        getHighlightInsuranceCategoriesSuccess({
          items: data.data.result.items
        })
      );
    } else {
      yield put(getHighlightInsuranceCategoriesFailure(data.response));
    }
  } catch (error) {
    yield put(getHighlightInsuranceCategoriesFailure(error));
  }
}
