import { call, put } from 'redux-saga/effects';
import { apiGetTotalOrderSummary } from '../../../services/api/extraServiceApi';
import {
  getExtraServiceOrderTotalRecordFailure,
  getExtraServiceOrderTotalRecordSuccess
} from '../../actions/extraService';

export function* getExtraServiceTotalRecordSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(apiGetTotalOrderSummary, params);

    if (data.status === 200) {
      yield put(
        getExtraServiceOrderTotalRecordSuccess({
          ...data.data.result
        })
      );
    } else {
      yield put(getExtraServiceOrderTotalRecordFailure(data.response));
    }
  } catch (error) {
    yield put(getExtraServiceOrderTotalRecordFailure(error));
  }
}
