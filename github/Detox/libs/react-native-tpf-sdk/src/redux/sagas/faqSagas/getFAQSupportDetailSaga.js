import { call, put } from 'redux-saga/effects';
import { apiGetFAQSupportDetail } from '../../../services/api/faqApi';
import { getFAQSupportDetailFailure, getFAQSupportDetailSuccess } from '../../actions/faq';
import { parseFAQSupportItem } from '../../parses/faq';

export function* getFAQSupportDetailSaga(obj) {
  const { callback = () => {}, params } = obj?.payload || {};
  try {
    const data = yield call(apiGetFAQSupportDetail, params);
    if (data.status === 200) {
      const dataParse = parseFAQSupportItem(data.data?.result);
      yield put(getFAQSupportDetailSuccess(dataParse));
      yield callback(null, dataParse);
    } else {
      yield put(getFAQSupportDetailFailure(data));
      yield callback(data, null);
    }
  } catch (error) {
    yield put(getFAQSupportDetailFailure(error));
    yield callback(error, null);
  }
}
