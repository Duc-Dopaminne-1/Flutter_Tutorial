import { getOrderListFailure, getOrderListSuccess } from '../../actions/order';
import { call, put } from 'redux-saga/effects';
import { apiGetOrderList } from '../../../services/api/orderApi';
import { LIMIT_PAGE, ORDER_TYPE } from '../../../global/app';

export function* getOrderListSaga(obj) {
  try {
    const params = {
      orderType: ORDER_TYPE.INSURANCE,
      maxResultCount: LIMIT_PAGE,
      ...obj.payload
    };
    const data = yield call(apiGetOrderList, params);
    if (data.status === 200) {
      yield put(
        getOrderListSuccess({
          ...data.data.result,
          endList: data.data.result?.items?.length < params.maxResultCount,
          skipCount: params.skipCount || 0
        })
      );
    } else {
      yield put(getOrderListFailure(data.response));
    }
  } catch (error) {
    yield put(getOrderListFailure(error));
  }
}
