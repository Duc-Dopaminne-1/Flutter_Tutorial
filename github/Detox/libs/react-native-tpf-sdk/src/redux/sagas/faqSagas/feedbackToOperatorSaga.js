import { call, put } from 'redux-saga/effects';
import { apiFeedbackSupportToOperator } from '../../../services/api/faqApi';
import { feedbackToOperatorFailure, feedbackToOperatorSuccess } from '../../actions/faq';

export function* feedbackToOperatorSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiFeedbackSupportToOperator, params);
    if (data.status === 200) {
      yield put(feedbackToOperatorSuccess(data));
      yield callback(null, data);
    } else {
      yield put(feedbackToOperatorFailure());
      yield callback(data, null);
    }
  } catch (error) {
    yield put(feedbackToOperatorFailure());
    yield callback(error, null);
  }
}
