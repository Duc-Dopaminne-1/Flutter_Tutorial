import { getAllTriggerFailure, getAllTriggerSuccess } from '../../actions/masterData';
import { call, put } from 'redux-saga/effects';
import { apiGetAllTrigger } from '../../../services/api/masterDataApi';

export function* getAllTriggerSagas(obj) {
  try {
    const params = { maxResultCount: 999, ...obj.payload };
    const data = yield call(apiGetAllTrigger, params);
    if (data.status === 200) {
      yield put(
        getAllTriggerSuccess({
          data: data.data.result.items,
          totalCount: data.data.result.totalCount
        })
      );
    } else {
      yield put(getAllTriggerFailure(data));
    }
  } catch (error) {
    yield put(getAllTriggerFailure(error));
  }
}
