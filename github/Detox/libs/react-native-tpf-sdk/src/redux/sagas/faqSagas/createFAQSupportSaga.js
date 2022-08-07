import { call, put } from 'redux-saga/effects';
import { apiCreateFAQSupport } from '../../../services/api/faqApi';
import { createFAQSupportFailure, createFAQSupportSuccess } from '../../actions/faq';
import { emitEvent } from '../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../global/app';

export function* createFAQSupportSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiCreateFAQSupport, params);
    if (data.status === 200) {
      emitEvent({
        event_name: SDK_EVENT_NAME.SUPPORT_CREATE,
        data: { ...params, id: data.data?.result?.id }
      });
      yield put(createFAQSupportSuccess());
      yield callback(null, data);
    } else {
      yield put(createFAQSupportFailure());
      yield callback(data, null);
    }
  } catch (error) {
    yield put(createFAQSupportFailure());
    yield callback(error, null);
  }
}
