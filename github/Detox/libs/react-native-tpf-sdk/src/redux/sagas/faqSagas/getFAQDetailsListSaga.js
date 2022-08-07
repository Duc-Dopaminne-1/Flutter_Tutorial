import { call, put } from 'redux-saga/effects';
import { CATEGORY_TYPE, LIMIT_PAGE } from '../../../global/app';
import { apiGetFAQDetailsList } from '../../../services/api/faqApi';
import { getFAQDetailsListFailure, getFAQDetailsListSuccess } from '../../actions/faq';

export function* getFAQDetailsListSaga(obj) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.FAQ,
      maxResultCount: LIMIT_PAGE,
      isHighlighted: false,
      ...obj.payload
    };
    const data = yield call(apiGetFAQDetailsList, params);

    if (data.status === 200) {
      yield put(
        getFAQDetailsListSuccess({
          items: data.data.result.items
        })
      );
    } else {
      yield put(getFAQDetailsListFailure(data));
    }
  } catch (error) {
    yield put(getFAQDetailsListFailure(error));
  }
}
