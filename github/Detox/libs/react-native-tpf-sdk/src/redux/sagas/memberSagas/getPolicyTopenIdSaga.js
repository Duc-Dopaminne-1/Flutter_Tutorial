import { getPolicyTopenIdSuccess, getPolicyTopenIdFailure } from '../../actions/member';
import { put, call, all, select } from 'redux-saga/effects';
import { apiGetConditionInfo, apiGetTermInfo } from '../../../services/api/memberApi';

export function* getPolicyTopenIdSaga() {
  try {
    const { lang } = select(state => state.setting);
    const data = yield all([call(apiGetTermInfo, { lang }), call(apiGetConditionInfo, { lang })]);
    const [terms, privacy] = data;

    if (terms?.data?.status === 'SUCCESS' || privacy?.data?.status === 'SUCCESS') {
      yield put(getPolicyTopenIdSuccess({ data: [terms?.data?.data, privacy?.data?.data] }));
    } else {
      yield put(getPolicyTopenIdFailure());
    }
  } catch (error) {
    yield put(getPolicyTopenIdFailure(error));
  }
}
