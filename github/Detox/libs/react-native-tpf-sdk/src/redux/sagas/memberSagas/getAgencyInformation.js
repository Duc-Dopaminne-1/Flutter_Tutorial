import { getAgencyInformationSuccess, getAgencyInformationFailure } from '../../actions/member';
import { put, call } from 'redux-saga/effects';
import { apiGetAgencyInformation } from '../../../services/api/memberApi';

export function* getAgencyInformationSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetAgencyInformation, params);
    if (data.status === 200) {
      yield put(
        getAgencyInformationSuccess({
          agencyInformation: data.data.result
        })
      );
    } else {
      yield put(getAgencyInformationFailure(data));
    }
  } catch (error) {
    yield put(getAgencyInformationFailure(error));
  }
}
