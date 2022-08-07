import { parseListFAQSupport } from '../../parses/faq';
import { call, put } from 'redux-saga/effects';
import { LIMIT_PAGE } from '../../../global/app';
import { FAQSupportStatus } from '../../../global/faq_support_status';
import { apiGetListFAQSupport } from '../../../services/api/faqApi';
import {
  getProcessingListFAQSupportFailure,
  getProcessingListFAQSupportSuccess
} from '../../actions/faq';

export function* getProcessingListFAQSupportSaga(obj) {
  const { callback = () => {}, params } = obj?.payload || {};
  try {
    const _params = {
      maxResultCount: LIMIT_PAGE,
      SkipCount: 0,
      StatusFilter: FAQSupportStatus.PROCESSING.code,
      ...params
    };
    const data = yield call(apiGetListFAQSupport, _params);
    if (data.status === 200) {
      const listData = data.data.result.items || [];
      const dataParse = parseListFAQSupport(listData);
      yield put(
        getProcessingListFAQSupportSuccess({
          items: dataParse,
          totalCount: data.data.result.totalCount
        })
      );
      yield callback(null, dataParse);
    } else {
      yield put(getProcessingListFAQSupportFailure(data));
      yield callback(data, null);
    }
  } catch (error) {
    yield put(getProcessingListFAQSupportFailure(error));
    yield callback(error, null);
  }
}
