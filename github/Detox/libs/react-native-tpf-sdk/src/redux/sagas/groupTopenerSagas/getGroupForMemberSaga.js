import { call, put } from 'redux-saga/effects';
import { apiGetGroupForMember } from '../../../services/api/groupTopener';
import { getGroupForMemberFailure, getGroupForMemberSuccess } from '../../actions/groupTopener';

export function* getGroupForMemberSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetGroupForMember, params);

    if (data.status === 200) {
      yield put(
        getGroupForMemberSuccess({
          data: data.data.result,
          fromRoute: params.fromRoute
        })
      );
    } else {
      yield put(getGroupForMemberFailure(data));
    }
  } catch (error) {
    yield put(getGroupForMemberFailure(error));
  }
}
