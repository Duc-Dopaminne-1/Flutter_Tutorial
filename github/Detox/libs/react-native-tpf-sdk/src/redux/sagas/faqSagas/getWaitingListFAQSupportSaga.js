import { call, put } from 'redux-saga/effects';
import { LIMIT_PAGE } from '../../../global/app';
import { FAQSupportStatus } from '../../../global/faq_support_status';
import { apiGetListFAQSupport } from '../../../services/api/faqApi';
import {
  getWaitingListFAQSupportFailure,
  getWaitingListFAQSupportSuccess
} from '../../actions/faq';
import { parseListFAQSupport } from '../../parses/faq';

export function* getWaitingListFAQSupportSaga(obj) {
  const { callback = () => {}, params } = obj?.payload || {};
  try {
    const _params = {
      maxResultCount: LIMIT_PAGE,
      SkipCount: 0,
      StatusFilter: FAQSupportStatus.WAIT_FOR_RESPONSE.code,
      ...params
    };
    const data = yield call(apiGetListFAQSupport, _params);
    if (data.status === 200) {
      const listData = data.data.result.items || [];
      const dataParse = parseListFAQSupport(listData);
      yield put(
        getWaitingListFAQSupportSuccess({
          items: dataParse,
          totalCount: data.data.result.totalCount
        })
      );
      yield callback(null, data);
    } else {
      yield put(getWaitingListFAQSupportFailure(data));
      yield callback(data, null);
    }
  } catch (error) {
    yield put(getWaitingListFAQSupportFailure(error));
    yield callback(error, null);
  }
}
