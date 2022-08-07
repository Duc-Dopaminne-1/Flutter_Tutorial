import { getGetAdvanceInfoByIdFailure, getGetAdvanceInfoByIdSuccess } from '../../actions/member';
import { call, put } from 'redux-saga/effects';
import { apiGetAdvanceInfoById } from '../../../services/api/memberApi';

export function* getAdvanceInfoByIdSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(apiGetAdvanceInfoById, params);
    if (data.status === 200) {
      yield put(getGetAdvanceInfoByIdSuccess({ ...data.data.result }));
    } else {
      yield put(getGetAdvanceInfoByIdFailure(data));
    }
  } catch (error) {
    yield put(getGetAdvanceInfoByIdFailure(error));
  }
}
