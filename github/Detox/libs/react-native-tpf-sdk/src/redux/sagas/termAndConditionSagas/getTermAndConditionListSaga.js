import { call, put } from 'redux-saga/effects';
import { CATEGORY_TYPE } from '../../../global/app';
import { apiGetArticles } from '../../../services/api/getArticlesApi';
import {
  getPrivacyPolicySuccess,
  getTermAndConditionListFailure,
  getTermAndConditionListSuccess
} from '../../actions/termAndCodition';

export function* getTermAndConditionListSaga(obj) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.TERM_AND_CONDITION,
      ...obj.payload
    };
    const data = yield call(apiGetArticles, params);
    if (data.status === 200) {
      yield put(
        getTermAndConditionListSuccess({
          items: data.data.result.items,
          totalCount: data.data.result.totalCount
        })
      );
    } else {
      yield put(getTermAndConditionListFailure(data));
    }
  } catch (error) {
    yield put(getTermAndConditionListFailure(error));
  }
}

export function* getPrivacyPoilcySaga(obj) {
  try {
    const params = {
      status: 'A',
      categoryType: CATEGORY_TYPE.PRIVACY,
      ...obj.payload
    };
    const data = yield call(apiGetArticles, params);
    if (data.status === 200) {
      yield put(
        getPrivacyPolicySuccess({
          items: data.data.result.items
        })
      );
    } else {
      yield put(getTermAndConditionListFailure(data));
    }
  } catch (error) {
    yield put(getTermAndConditionListFailure(error));
  }
}
