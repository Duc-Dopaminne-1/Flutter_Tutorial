import { call, put } from 'redux-saga/effects';
import { apiRemoveListMember } from '../../../services/api/groupTopener';
import {
  deleteMemberGroupTopenerFailure,
  deleteMemberGroupTopenerSuccess
} from '../../actions/groupTopener';

export function* deleteMemberGroupTopenerSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiRemoveListMember, params);
    if (data.status === 200) {
      yield put(
        deleteMemberGroupTopenerSuccess({
          data: data.data.result
        })
      );
      yield callback(null, data);
    } else {
      yield put(deleteMemberGroupTopenerFailure(data));
      yield callback(data, null);
    }
  } catch (error) {
    yield put(deleteMemberGroupTopenerFailure(error));
    yield callback(error, null);
  }
}
