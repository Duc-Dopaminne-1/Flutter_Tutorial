import { call, put } from 'redux-saga/effects';
import { LIMIT_PAGE } from '../../../global/app';
import { apiGetLeadList } from '../../../services/api/leadApi';
import { getLeadListFailure, getLeadListSuccess } from '../../actions/lead';

export function* getLeadListSaga({ payload, success, failure }) {
  try {
    const params = { maxResultCount: LIMIT_PAGE, ...payload };
    const data = yield call(apiGetLeadList, params);

    if (data.status === 200) {
      yield put(
        getLeadListSuccess({
          items: data.data.result.items,
          totalCount: data.data.result.totalCount,
          endList: data.data.result?.items?.length < params.maxResultCount,
          loadMore: params?.skipCount > 0,
          ...payload
        })
      );
      success && success({ ...data.data, ...payload });
      return;
    } else {
      yield put(getLeadListFailure(data));
      failure && failure(data);
    }
  } catch (error) {
    yield put(getLeadListFailure(error));
    failure && failure();
  }
}
