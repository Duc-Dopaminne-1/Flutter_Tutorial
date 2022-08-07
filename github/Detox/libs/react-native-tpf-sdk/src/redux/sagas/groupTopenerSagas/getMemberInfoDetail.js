import { call, put } from 'redux-saga/effects';
import { apiGetMemberInfoDetail } from '../../../services/api/groupTopener';
import { getMemberInfoDetailFailure, getMemberInfoDetailSuccess } from '../../actions/groupTopener';

export function* getMemberInfoDetailSaga(obj) {
  try {
    const { memberId } = obj.payload;
    const data = yield call(apiGetMemberInfoDetail, memberId);
    if (data.status === 200) {
      yield put(
        getMemberInfoDetailSuccess({
          data: data.data.result,
          success: 'Success'
        })
      );
    } else {
      yield put(getMemberInfoDetailFailure(data));
    }
  } catch (error) {
    yield put(getMemberInfoDetailFailure(error));
  }
}
