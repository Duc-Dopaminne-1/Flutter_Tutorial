import {
  getCommissionInformationFailure,
  getCommissionInformationSuccess
} from '../../actions/member';
import { call, put } from 'redux-saga/effects';
import { apiGetCommissionInformation } from '../../../services/api/memberApi';

export function* getCommissionInformationSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(apiGetCommissionInformation, params);
    if (data.status === 200) {
      yield put(getCommissionInformationSuccess({ ...data.data.result }));
    } else {
      yield put(getCommissionInformationFailure(data));
    }
  } catch (error) {
    yield put(getCommissionInformationFailure(error));
  }
}
