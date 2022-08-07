import {
  getResponsePaymentDataFailure,
  getResponsePaymentDataSuccess
} from '../../actions/payment';
import { call, put } from 'redux-saga/effects';
import { apiGetResponsePaymentData } from '../../../services/api/payment';

export function* getResponsePaymentSaga(obj) {
  try {
    const { url } = obj.payload;

    const queryStr = url?.split('?')[1];
    // const paramStrArr = queryStr?.split('&');
    // let tempEntries = [];

    // paramStrArr.forEach(param => {
    //   const entry = param.split('=');
    //   tempEntries = [...tempEntries, ...[entry]];
    // });

    // const params = Object.fromEntries(tempEntries);
    const data = yield call(apiGetResponsePaymentData, queryStr);

    if (data.status === 200) {
      yield put(
        getResponsePaymentDataSuccess({
          item: data.data.result
        })
      );
    } else {
      yield put(getResponsePaymentDataFailure(data));
    }
  } catch (error) {
    yield put(getResponsePaymentDataFailure(error));
  }
}
