import { call, put } from 'redux-saga/effects';
import { LIMIT_PAGE, ORDER_TYPE } from '../../../global/app';
import { apiGetCreditOrderList } from '../../../services/api/credit';
import { getCreditOrderListFailure, getCreditOrderListSuccess } from '../../actions/credit';

export function* getOrderListSaga(obj) {
  try {
    const params = {
      orderType: ORDER_TYPE.CREDIT,
      maxResultCount: LIMIT_PAGE,
      ...obj.payload
    };

    const data = yield call(apiGetCreditOrderList, params);

    if (data.status === 200) {
      yield put(
        getCreditOrderListSuccess({
          ...data.data.result,
          endList: data.data.result?.items?.length < params.maxResultCount,
          skipCount: params.skipCount || 0
        })
      );
    } else {
      yield put(getCreditOrderListFailure(data.response));
    }
  } catch (error) {
    yield put(getCreditOrderListFailure(error));
  }
}
