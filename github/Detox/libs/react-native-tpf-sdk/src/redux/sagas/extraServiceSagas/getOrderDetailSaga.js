import { call, put } from 'redux-saga/effects';

import { apiGetAddedOrderFormForEdit } from '../../../services/api/extraServiceApi';
import {
  getExtraServiceOrderDetailFailure,
  getExtraServiceOrderDetailSuccess
} from '../../actions/extraService';

export function* getOrderDetailSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(apiGetAddedOrderFormForEdit, params);
    if (data.status === 200) {
      yield put(
        getExtraServiceOrderDetailSuccess({
          item: data.data.result
        })
      );
    } else {
      yield put(getExtraServiceOrderDetailFailure(data.response));
    }
  } catch (error) {
    yield put(getExtraServiceOrderDetailFailure(error));
  }
}
