import { call, put } from 'redux-saga/effects';
import { CATEGORY_TYPE } from '../../../global/app';
import { apiGetListOfFAQ } from '../../../services/api/faqApi';
import { getFAQListFailure, getFAQListSuccess } from '../../actions/faq';

export function* getFAQListSaga(obj) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.FAQ,
      maxResultCount: 999,
      Sorting: 'id asc',
      ...obj.payload
    };
    const data = yield call(apiGetListOfFAQ, params);
    if (data.status === 200) {
      yield put(
        getFAQListSuccess({
          items: data.data.result.items.filter(t => t.parentCategoryId > 0)
        })
      );
    } else {
      yield put(getFAQListFailure(data));
    }
  } catch (error) {
    yield put(getFAQListFailure(error));
  }
}
