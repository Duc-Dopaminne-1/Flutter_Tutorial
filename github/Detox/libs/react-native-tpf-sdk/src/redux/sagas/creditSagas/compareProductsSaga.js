import { call, put } from 'redux-saga/effects';
import { apiCompareProductSaga } from '../../../services/api/credit';
import { compareProductsFailure, compareProductsSuccess } from '../../actions/credit';

export function* compareProductsSaga(obj) {
  try {
    const params = obj.payload;
    const data = yield call(apiCompareProductSaga, params);
    if (data.status === 200) {
      yield put(
        compareProductsSuccess({
          data: data.data.result,
          action: 'success'
        })
      );
    } else {
      yield put(compareProductsFailure(data));
    }
  } catch (error) {
    yield put(compareProductsFailure(error));
  }
}
