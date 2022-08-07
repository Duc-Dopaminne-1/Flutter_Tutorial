import { call, put } from 'redux-saga/effects';
import { LIMIT_PAGE } from '../../../global/app';
import { apiGetListRequestOrMember } from '../../../services/api/groupTopener';
import {
  getListRequestOrMemberFailure,
  getListRequestOrMemberSuccess
} from '../../actions/groupTopener';

export function* getListRequestOrMemberSaga(obj) {
  try {
    const params = { maxResultCount: LIMIT_PAGE, ...obj.payload };
    const data = yield call(apiGetListRequestOrMember, params);
    if (data.status === 200) {
      yield put(
        getListRequestOrMemberSuccess({
          data: data.data.result.items,
          totalCount: data.data.result.totalCount,
          loadMore: params?.skipCount > 0
        })
      );
    } else {
      yield put(getListRequestOrMemberFailure(data));
    }
  } catch (error) {
    yield put(getListRequestOrMemberFailure(error));
  }
}
