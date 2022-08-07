import { getSaleKitDetailFailure, getSaleKitDetailSuccess } from '../../actions/saleKit';
import { call, put } from 'redux-saga/effects';
import { apiGetArticleDetail } from '../../../services/api/getArticlesApi';

export function* getSaleKitDetailSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetArticleDetail, params);
    if (data.status === 200) {
      yield put(
        getSaleKitDetailSuccess({
          item: data.data.result
        })
      );
    } else {
      yield put(getSaleKitDetailFailure(data));
    }
  } catch (error) {
    yield put(getSaleKitDetailFailure(error));
  }
}
