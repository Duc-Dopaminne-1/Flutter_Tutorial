import { call, put } from 'redux-saga/effects';
import { apiGetGroupById } from '../../../services/api/groupTopener';
import { getGroupByIdFailure, getGroupByIdSuccess } from '../../actions/groupTopener';

export function* getGroupByIdSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetGroupById, params);

    if (data.status === 200) {
      yield put(
        getGroupByIdSuccess({
          data: data.data.result
        })
      );
    } else {
      yield put(getGroupByIdFailure(data));
    }
  } catch (error) {
    yield put(getGroupByIdFailure(error));
  }
}
