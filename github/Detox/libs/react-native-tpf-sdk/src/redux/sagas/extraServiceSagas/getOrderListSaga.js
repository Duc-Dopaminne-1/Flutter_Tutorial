import { call, put } from 'redux-saga/effects';
import { LIMIT_PAGE, ORDER_TYPE } from '../../../global/app';
import { apiGetExtraServiceOrderList } from '../../../services/api/extraServiceApi';
import {
  getExtraServiceOrderDetailFailure,
  getExtraServiceOrderListSuccess
} from '../../actions/extraService';

export function* getOrderListSaga(obj) {
  try {
    const params = {
      orderType: ORDER_TYPE.EXTRA_SERVICE,
      maxResultCount: LIMIT_PAGE,
      ...obj.payload
    };

    const data = yield call(apiGetExtraServiceOrderList, params);

    if (data.status === 200) {
      yield put(
        getExtraServiceOrderListSuccess({
          ...data.data.result,
          endList: data.data.result?.items?.length < params.maxResultCount,
          skipCount: params.skipCount || 0
        })
      );
    } else {
      yield put(getExtraServiceOrderDetailFailure(data.response));
    }
  } catch (error) {
    yield put(getExtraServiceOrderDetailFailure(error));
  }
}
