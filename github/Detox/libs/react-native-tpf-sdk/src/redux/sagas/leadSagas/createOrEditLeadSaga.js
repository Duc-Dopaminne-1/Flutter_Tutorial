import { createOrEditLeadSuccess, createOrEditLeadFailure } from '../../actions/lead';
import { put, call } from 'redux-saga/effects';
import { apiCreateOrEditLead } from '../../../services/api/leadApi';

export function* createOrEditLeadSaga(obj) {
  const { callback = () => {} } = obj.payload || {};
  try {
    const { params } = obj.payload || {};
    const data = yield call(apiCreateOrEditLead, params);
    if (data.status === 200) {
      yield put(createOrEditLeadSuccess({ item: obj.payload }));
      yield callback(null, data);
    } else {
      yield put(createOrEditLeadFailure(data));
      yield callback(data, null);
    }
  } catch (error) {
    yield put(createOrEditLeadFailure(error));
    yield callback(error, null);
  }
}
