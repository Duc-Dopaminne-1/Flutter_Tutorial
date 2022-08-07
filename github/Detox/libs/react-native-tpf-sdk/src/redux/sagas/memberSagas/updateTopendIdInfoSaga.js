import { updateTopendIdInfoFailure, updateTopendIdInfoSuccess } from '../../actions/member';
import { call, put } from 'redux-saga/effects';
import { apiUpdateTopendIdInfoForMobile } from '../../../services/api/memberApi';

export function* updateTopendIdInfoSaga({ payload, success, failure }) {
  try {
    const params = payload;
    const data = yield call(apiUpdateTopendIdInfoForMobile, params);

    if (data.status === 200) {
      yield put(updateTopendIdInfoSuccess());
      success && success();
    } else {
      yield put(updateTopendIdInfoFailure());
      failure && failure();
    }
  } catch (error) {
    yield put(updateTopendIdInfoFailure());
    failure && failure();
  }
}
