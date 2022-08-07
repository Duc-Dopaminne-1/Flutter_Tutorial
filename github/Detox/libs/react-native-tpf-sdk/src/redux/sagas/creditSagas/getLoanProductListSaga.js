import { call, put } from 'redux-saga/effects';
import { LIMIT_PAGE } from '../../../global/app';
import { apiGetLoanProductList } from '../../../services/api/credit';
import { getLoanProductListFailure, getLoanProductListSuccess } from '../../actions/credit';

export function* getLoanProductListSaga(obj) {
  try {
    const params = { maxResultCount: LIMIT_PAGE, ...obj.payload };
    const data = yield call(apiGetLoanProductList, params);
    if (data.status === 200) {
      yield put(
        getLoanProductListSuccess({
          ...data.data.result,
          loadMore: params?.skipCount > 0
        })
      );
    } else {
      yield put(getLoanProductListFailure(data));
    }
  } catch (error) {
    yield put(getLoanProductListFailure(error));
  }
}
