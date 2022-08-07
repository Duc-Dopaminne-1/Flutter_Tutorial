import { call, put } from 'redux-saga/effects';
import { apiGetDepositRefundRequest } from '../../../services/api/depositApi';
import {
  getListDepositRefundRequestFailure,
  getListDepositRefundRequestSuccess
} from '../../actions/deposit';

export function* getListDepositRefundRequestSaga(obj) {
  const { callback = () => {}, params } = obj.payload || {};
  try {
    const data = yield call(apiGetDepositRefundRequest, params);

    if (data.status === 200) {
      yield put(
        getListDepositRefundRequestSuccess({
          items: data?.data?.result?.depositRefundTransactionOutput,
          isEndList:
            data?.data?.result?.depositRefundTransactionOutput?.length < params?.maxResultCount,
          skipCount: params?.skipCount || 0
        })
      );
      yield callback(null, data.data);
    } else {
      yield put(getListDepositRefundRequestFailure());
      yield callback(data, null);
    }
  } catch (error) {
    yield put(getListDepositRefundRequestFailure(error));
    yield callback(error, null);
  }
}
