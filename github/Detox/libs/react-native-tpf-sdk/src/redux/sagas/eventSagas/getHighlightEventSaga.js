import { call, put } from 'redux-saga/effects';
import { CATEGORY_TYPE } from '../../../global/app';
import { apiGetEvents } from '../../../services/api/getEventsApi';
import { getHighlightEventFailure, getHighlightEventSuccess } from '../../actions/event';

export function* getHighlightEventSaga(obj) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.EVENT,
      maxResultCount: 5,
      isHighlighted: true,
      ...obj.payload
    };
    const data = yield call(apiGetEvents, params);

    if (data.status === 200) {
      yield put(
        getHighlightEventSuccess({
          items: data.data.result.items
        })
      );
    } else {
      yield put(getHighlightEventFailure(data));
    }
  } catch (error) {
    yield put(getHighlightEventFailure(error));
  }
}
