import { getPartnerDetailSuccess, getPartnerDetailFailure } from '../../actions/partner';
import { call, put } from 'redux-saga/effects';
import { apiGetPartnerDetail } from '../../../services/api/partnerApi';

export function* getPartnerDetailSaga(obj) {
  try {
    const params = obj.payload;
    const data = yield call(apiGetPartnerDetail, params);
    if (data.status === 200) {
      yield put(
        getPartnerDetailSuccess({
          item: data.data.result
        })
      );
    } else {
      yield put(getPartnerDetailFailure(data));
    }
  } catch (error) {
    yield put(getPartnerDetailFailure(error));
  }
}
