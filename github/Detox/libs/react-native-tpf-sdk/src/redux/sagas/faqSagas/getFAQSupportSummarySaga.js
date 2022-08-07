import { call, put } from 'redux-saga/effects';
import { apiGetFAQSupportListSummary } from '../../../services/api/faqApi';
import { getFAQSupportSummaryFailure, getFAQSupportSummarySuccess } from '../../actions/faq';

export function* getFAQSupportSummarySaga(obj) {
  const { params } = obj?.payload || {};
  try {
    const data = yield call(apiGetFAQSupportListSummary, params);
    if (data.status === 200) {
      yield put(getFAQSupportSummarySuccess(data));
    } else {
      yield put(getFAQSupportSummaryFailure(data));
    }
  } catch (error) {
    yield put(getFAQSupportSummaryFailure(error));
  }
}
