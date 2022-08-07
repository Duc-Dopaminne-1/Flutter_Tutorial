import { generatePaymentLinkFailure, generatePaymentLinkSuccess } from '../../actions/payment';
import { call, put } from 'redux-saga/effects';
import { apiGeneratePaymentLink } from '../../../services/api/payment';

export function* generateLinkSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(apiGeneratePaymentLink, params);

    if (data.status === 200) {
      yield put(
        generatePaymentLinkSuccess({
          item: data.data.result
        })
      );
    } else {
      yield put(generatePaymentLinkFailure(data));
    }
  } catch (error) {
    yield put(generatePaymentLinkFailure(error));
  }
}
