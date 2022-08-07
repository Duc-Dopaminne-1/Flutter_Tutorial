import { call, put } from 'redux-saga/effects';
import { LIMIT_PAGE } from '../../..//global/app';
import { apiGetContacts } from '../../../services/api/contactApi';
import { getContactsFailure, getContactsSuccess } from '../../actions/contact';

export function* getContactsSaga(obj) {
  try {
    const params = { ...obj.payload, maxResultCount: LIMIT_PAGE };

    const data = yield call(apiGetContacts, params);
    if (data.status === 200) {
      yield put(
        getContactsSuccess({
          items: data.data.result.items,
          totalCount: data.data.result.totalCount,
          loadMore: params?.skipCount > 0
        })
      );
    } else {
      yield put(getContactsFailure(data));
    }
  } catch (error) {
    yield put(getContactsFailure(error));
  }
}
