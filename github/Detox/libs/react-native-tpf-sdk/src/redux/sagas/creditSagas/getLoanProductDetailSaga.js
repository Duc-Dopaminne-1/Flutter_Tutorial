import { call, put } from 'redux-saga/effects';
import { apiGetLoanProductDetail } from '../../../services/api/credit';
import { getLoanProductDetailFailure, getLoanProductDetailSuccess } from '../../actions/credit';

export function* getLoanProductDetailSaga(obj) {
  try {
    const params = obj.payload;
    const data = yield call(apiGetLoanProductDetail, params);
    if (data.status === 200) {
      const categoryName =
        data?.data?.result.listCategoryInfo.filter(
          item => item.categoryId === data.data.result.categoryIdLevel2
        )?.[0]?.categoryName || '';
      yield put(
        getLoanProductDetailSuccess({
          data: { ...data.data?.result, categoryName }
        })
      );
    } else {
      yield put(getLoanProductDetailFailure(data));
    }
  } catch (error) {
    yield put(getLoanProductDetailFailure(error));
  }
}
