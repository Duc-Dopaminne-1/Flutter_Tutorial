import { getPartnerListFailure, getPartnerListSuccess } from '../../actions/partner';
import { call, put } from 'redux-saga/effects';
import { apiGetPartnerList } from '../../../services/api/partnerApi';

export function* getPartnerListSaga({ payload, success, failure }) {
  try {
    const params = { status: 'A', maxResultCount: 10000, ...payload };
    const data = yield call(apiGetPartnerList, params);
    if (data.status === 200) {
      yield put(
        getPartnerListSuccess({
          items: data.data.result.items,
          totalCount: data.data.result.totalCount
        })
      );
      success && success();
    } else {
      yield put(getPartnerListFailure(data));
    }
  } catch (error) {
    yield put(getPartnerListFailure(error));
  }
}
