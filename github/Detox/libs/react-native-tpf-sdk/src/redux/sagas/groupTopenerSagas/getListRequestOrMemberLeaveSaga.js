import { call, put } from 'redux-saga/effects';
import { LIMIT_PAGE } from '../../../global/app';
import { apiGetListRequestOrMember } from '../../../services/api/groupTopener';
import {
  getListRequestOrMemberJoinFailure,
  getListRequestOrMemberLeaveFailure,
  getListRequestOrMemberLeaveSuccess
} from '../../actions/groupTopener';

export function* getListRequestOrMemberLeaveSaga(obj) {
  try {
    const params = { maxResultCount: LIMIT_PAGE, ...obj.payload };
    const data = yield call(apiGetListRequestOrMember, params);
    if (data.status === 200) {
      yield put(
        getListRequestOrMemberLeaveSuccess({
          data: data.data.result.items,
          totalCount: data.data.result.totalCount,
          loadMore: params?.skipCount > 0
        })
      );
    } else {
      yield put(getListRequestOrMemberLeaveFailure(data));
    }
  } catch (error) {
    yield put(getListRequestOrMemberJoinFailure(error));
  }
}
