import { call, put } from 'redux-saga/effects';
import { CATEGORY_TYPE, LIMIT_PAGE } from '../../../global/app';
import { apiGetEvents } from '../../../services/api/getEventsApi';
import { getEventListFailure, getEventListSuccess } from '../../actions/event';

export function* getEventListSaga(obj) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.EVENT,
      maxResultCount: LIMIT_PAGE,
      SkipCount: 0,
      isHighlighted: false,
      ...obj.payload
    };

    const data = yield call(apiGetEvents, params);
    if (data.status === 200) {
      yield put(
        getEventListSuccess({
          items: data.data.result.items,
          totalCount: data.data.result.totalCount
        })
      );
    } else {
      yield put(getEventListFailure(data));
    }
  } catch (error) {
    yield put(getEventListFailure(error));
  }
}
