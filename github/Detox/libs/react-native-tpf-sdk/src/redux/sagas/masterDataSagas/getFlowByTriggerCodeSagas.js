import { getFlowByTriggerCodeFailure, getFlowByTriggerCodeSuccess } from '../../actions/masterData';
import { call, put } from 'redux-saga/effects';
import { apiGetFlowByTriggerCode } from '../../../services/api/masterDataApi';
import { LIMIT_PAGE } from '../../../global/app';
import { getShowAlertError } from '../../actions/system';
import { SYSTEM_ERROR } from '../../../constants/errors';

export function* getFlowByTriggerCodeSagas(obj) {
  const { triggerCode, callback } = obj.payload;
  try {
    delete obj.payload.callback;
    const params = { maxResultCount: LIMIT_PAGE, triggerCode, ...obj.payload };

    const data = yield call(apiGetFlowByTriggerCode, params);
    if (data.status === 200) {
      callback?.({
        categoryFlow: data.data.result.categoryFlow || data.data.result.categoryListFlow?.items?.[0]
      });
      yield put(
        getFlowByTriggerCodeSuccess({
          trigger: data.data.result.trigger,

          categoryListFlow: data.data.result.categoryListFlow?.items,
          totalCountCategoryListFlow: data.data.result.categoryListFlow?.totalCount,

          productListFlow: data.data.result.productListFlow?.items,
          totalCountProductListFlow: data.data.result.productListFlow?.totalCount,

          loadMore: params?.skipCount > 0
        })
      );
    } else {
      callback?.({ categoryFlow: null });
      yield put(getShowAlertError(SYSTEM_ERROR));
    }
  } catch (error) {
    callback?.({ categoryFlow: null });
    yield put(getShowAlertError(SYSTEM_ERROR));
  }
}
