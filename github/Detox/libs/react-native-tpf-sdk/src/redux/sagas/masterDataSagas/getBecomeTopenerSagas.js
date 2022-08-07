import { call, put } from 'redux-saga/effects';
import { apiGetBecomeTopener } from '../../../services/api/masterDataApi';
import { getBecomeTopenerSuccess, getBecomeTopenerFailure } from '../../actions/masterData';

export function* getBecomeTopenerSagas(action) {
  try {
    const data = yield call(apiGetBecomeTopener);
    if (data.status === 200) {
      yield put(
        getBecomeTopenerSuccess({
          link: data.data.result.updrageTopenerUrl,
          imageUrl: data.data.result.bannerLink
        })
      );
      action.success && action.success({ ...data.data });
      return;
    } else {
      yield put(getBecomeTopenerFailure(data));
      //failure && failure(data);
    }
  } catch (error) {
    yield put(getBecomeTopenerFailure(error));
    //failure && failure();
  }
}
