import { getListRequestOrMemberFailure } from '../../actions/groupTopener';
import { getPersonalKpiListFailure, getPersonalKpiListSuccess } from '../../actions/kpi';
import { call, put } from 'redux-saga/effects';
import { apiGetPersonalKpiList } from '../../../services/api/kpiApi';
import { LIMIT_PAGE } from '../../../global/app';

export function* getPersonalKpiListSaga(obj) {
  try {
    const params = { maxResultCount: LIMIT_PAGE, ...obj.payload };
    const data = yield call(apiGetPersonalKpiList, params);
    if (data.status === 200) {
      yield put(
        getPersonalKpiListSuccess({
          data: data.data.result.personalKPIs,
          totalCount: data.data.result.totalCount,
          endList: data.data?.result?.personalKPIs.length < params.maxResultCount,
          loadMore: params?.skipCount > 0
        })
      );
    } else {
      yield put(getPersonalKpiListFailure(data));
    }
  } catch (error) {
    yield put(getListRequestOrMemberFailure(error));
  }
}
