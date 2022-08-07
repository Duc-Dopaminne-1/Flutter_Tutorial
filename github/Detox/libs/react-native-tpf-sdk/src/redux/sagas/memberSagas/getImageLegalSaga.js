import { getGetLegalImageFailure, getGetLegalImageSuccess } from '../../actions/member';
import { call, put } from 'redux-saga/effects';
import { apiGetImageLegal } from '../../../services/api/memberApi';

export function* getImageLegalSaga(action) {
  const { success } = action.payload;
  try {
    const data = yield call(apiGetImageLegal);
    if (data.status === 200) {
      yield put(getGetLegalImageSuccess(data));
      success?.(data?.data?.result);
    } else {
      yield put(getGetLegalImageFailure(data));
    }
  } catch (error) {
    yield put(getGetLegalImageFailure(error));
  }
}
