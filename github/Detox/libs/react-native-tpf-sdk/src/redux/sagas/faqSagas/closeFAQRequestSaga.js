import { call, put } from 'redux-saga/effects';
import { apiCloseFAQRequest } from '../../../services/api/faqApi';
import { closeFAQRequestFailure, closeFAQRequestSuccess } from '../../actions/faq';

export function* closeFAQRequestSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiCloseFAQRequest, params);
    if (data.status === 200) {
      yield put(closeFAQRequestSuccess(data));
      yield callback(null, data);
    } else {
      yield put(closeFAQRequestFailure());
      yield callback(data, null);
    }
  } catch (error) {
    yield put(closeFAQRequestFailure());
    yield callback(error, null);
  }
}
