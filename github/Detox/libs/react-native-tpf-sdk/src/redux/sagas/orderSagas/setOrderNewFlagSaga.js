import { call, put } from 'redux-saga/effects';
import { apiSetOrderNewFlag } from '../../../services/api/orderApi';
import { setOrderNewFlagFailure, setOrderNewFlagSuccess } from '../../actions/order';

export function* setOrderNewFlagSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiSetOrderNewFlag, params);
    if (data.status === 200) {
      yield put(setOrderNewFlagSuccess(data?.data?.result));
      yield callback(null, data?.data);
    } else {
      yield put(setOrderNewFlagFailure(data));
      callback(data, null);
    }
  } catch (error) {
    yield put(setOrderNewFlagFailure(error));
  }
}
