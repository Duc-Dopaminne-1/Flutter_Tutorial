import { getLeadDetailSuccess, getLeadDetailFailure } from '../../actions/lead';
import { put, call } from 'redux-saga/effects';
import { apiGetEntityForEdit } from '../../../services/api/entityApi';
import { ENTITY_TYPE } from '../../../global/entity_type';

export function* getLeadDetailSaga(obj) {
  const { callback = () => {} } = obj.payload || {};
  try {
    const params = { type: ENTITY_TYPE.Lead, ...obj.payload.params };
    const data = yield call(apiGetEntityForEdit, params);
    if (data.status === 200) {
      yield put(
        getLeadDetailSuccess({
          item: data.data.result
        })
      );
      yield callback(null, data.data.result);
    } else {
      yield put(getLeadDetailFailure(data));
      yield callback(data, null);
    }
  } catch (error) {
    yield put(getLeadDetailFailure(error));
    yield callback(error, null);
  }
}
