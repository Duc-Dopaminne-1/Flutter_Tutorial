import { call, put } from 'redux-saga/effects';
import { LIMIT_PAGE } from '../../../global/app';
import { apiGetLink } from '../../../services/api/linkApi';
import { getLinkSuccess, getLinkFailure } from '../../actions/link';

export function* getLinkSaga(action) {
  try {
    const data = yield call(apiGetLink);

    if (data.status === 200) {
      yield put(
        getLinkSuccess({
          link: data.data.result.updrageTopenerUrl,
          imageUrl: data.data.result.bannerLink
        })
      );
      action.success && action.success({ ...data.data });
      return;
    } else {
      // yield put(getLeadListFailure(data));
      // failure && failure(data);
    }
  } catch (error) {
    // yield put(getLeadListFailure(error));
    // failure && failure();
  }
}
