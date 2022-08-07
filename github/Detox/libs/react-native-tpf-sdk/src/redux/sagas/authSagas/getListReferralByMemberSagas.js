import { call, put } from 'redux-saga/effects';
import { LIMIT_PAGE } from '../../../global/app';
import { apiGetListReferralByMember } from '../../../services/api/authApi';
import { getListReferralByMemberFailure, getListReferralByMemberSuccess } from '../../actions/auth';

export function* getListReferralByMemberSagas({ payload, success, failure }) {
  try {
    const params = { maxResultCount: LIMIT_PAGE, ...payload };
    const res = yield call(apiGetListReferralByMember, params);

    if (res.status !== 200) {
      yield put(getListReferralByMemberFailure(res));
      failure && failure({ ...params, ...res });
      return;
    }

    yield put(
      getListReferralByMemberSuccess({
        items: res.data.result.items,
        totalCount: res.data.result.totalCount,
        loadMore: params?.skipCount > 0
      })
    );
    success && success(res.data);
  } catch (error) {
    yield put(getListReferralByMemberFailure(error));
  }
}
