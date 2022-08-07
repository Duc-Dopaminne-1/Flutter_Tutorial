import { call, put } from 'redux-saga/effects';
import { apiSetDealNewFlag } from '../../../services/api/credit';
import { setDealNewFlagFailure, setDealNewFlagSuccess } from '../../actions/credit';

export function* setDealNewFlagSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiSetDealNewFlag, params);
    if (data.status === 200) {
      yield put(setDealNewFlagSuccess(data?.data?.result));
      yield callback(null, data?.data);
    } else {
      yield put(setDealNewFlagFailure(data));
      callback(data, null);
    }
  } catch (error) {
    yield put(setDealNewFlagFailure(error));
  }
}
