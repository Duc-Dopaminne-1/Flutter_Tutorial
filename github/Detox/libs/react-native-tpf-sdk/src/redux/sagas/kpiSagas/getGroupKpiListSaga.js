import { getGroupKpiListFailure, getGroupKpiListSuccess } from '../../actions/kpi';
import { call, put } from 'redux-saga/effects';
import { apiGetGroupKpiList } from '../../../services/api/kpiApi';
import { LIMIT_PAGE } from '../../../global/app';

export function* getGroupKpiListSaga(obj) {
  try {
    const params = { maxResultCount: LIMIT_PAGE, ...obj.payload };
    const data = yield call(apiGetGroupKpiList, params);
    if (data.status === 200) {
      yield put(
        getGroupKpiListSuccess({
          data: data.data.result.groupKPIs,
          totalCount: data.data.result.totalCount,
          endList: data.data.result?.groupKPIs.length < params.maxResultCount,
          loadMore: params?.skipCount > 0
        })
      );
    } else {
      yield put(getGroupKpiListFailure(data));
    }
  } catch (error) {
    yield put(getGroupKpiListFailure(error));
  }
}
