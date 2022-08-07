import { getProfitListFailure, getProfitListSuccess } from '../../actions/profit';
import { call, put } from 'redux-saga/effects';
import { apiGetArticles } from '../../../services/api/getArticlesApi';
import { CATEGORY_TYPE } from '../../../global/app';

export function* getProfitListSaga(obj) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.POLICY,
      ...obj.payload
    };
    const data = yield call(apiGetArticles, params);
    if (data.status === 200) {
      yield put(
        getProfitListSuccess({
          items: data.data.result.items,
          totalCount: data.data.result.totalCount
        })
      );
    } else {
      yield put(getProfitListFailure(data));
    }
  } catch (error) {
    yield put(getProfitListFailure(error));
  }
}
