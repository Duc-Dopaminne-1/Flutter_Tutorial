import { call, put } from 'redux-saga/effects';
import {
  apiGetAddedOrderFormForCreate,
  apiGetExtraServiceOrderForm
} from '../../../services/api/extraServiceApi';
import {
  getExtraServiceOrderFormFailure,
  getExtraServiceOrderFormSuccess,
  getAddedOrderFormForCreateFailure,
  getAddedOrderFormForCreateSuccess
} from '../../actions/extraService';

export function* getExtraServiceOrderFormSaga(action) {
  const { productId, leadId, contactId, callback } = action.payload;
  try {
    const params = { productId, leadId, contactId };
    const data = yield call(apiGetExtraServiceOrderForm, params);
    callback?.();
    if (data.status === 200) {
      yield put(
        getExtraServiceOrderFormSuccess({
          data: data?.data?.result || {}
        })
      );
    } else {
      yield put(getExtraServiceOrderFormFailure(data));
    }
  } catch (error) {
    callback?.();
    yield put(getExtraServiceOrderFormFailure(error));
  }
}

export function* getAddedOrderFormForCreateSaga(action) {
  const { productId, leadId, contactId, memberId, callback } = action.payload;
  try {
    const params = { productId, leadId, contactId, memberId };
    const data = yield call(apiGetAddedOrderFormForCreate, params);
    callback?.();
    if (data.status === 200) {
      yield put(
        getAddedOrderFormForCreateSuccess({
          data: data?.data?.result || {}
        })
      );
    } else {
      yield put(getAddedOrderFormForCreateFailure(data));
    }
  } catch (error) {
    callback?.();
    yield put(getAddedOrderFormForCreateFailure(error));
  }
}
