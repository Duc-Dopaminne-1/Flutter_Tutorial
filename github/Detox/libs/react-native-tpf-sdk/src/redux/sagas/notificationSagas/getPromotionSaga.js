import { getPromotionFailure, getPromotionSuccess } from '../../actions/notification';
import { call, put } from 'redux-saga/effects';
import { apiGetPromotion } from '../../../services/api/notificationApi';
import { store } from '../../store/configureStore';

export function* getPromotionSaga(obj) {
  const { memberId } = obj.payload;
  const lang = store.getState()?.setting?.lang || 'vi';

  try {
    const params = {
      Language: lang,
      memberId
    };

    const data = yield call(apiGetPromotion, params);

    if (data.status === 200) {
      yield put(getPromotionSuccess(data.data.result));
    } else {
      yield put(getPromotionFailure(data));
    }
  } catch (error) {
    yield put(getPromotionFailure(error));
  }
}
