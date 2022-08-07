import {
  getInsuranceRefundConfigFailure,
  getInsuranceRefundConfigSuccess
} from '../../actions/insurance';
import { call, put } from 'redux-saga/effects';
import { apiGetInsuaranceRefundConfig } from '../../../services/api/insuranceApi';

export function* getInsuaranceRefundConfigSaga(obj) {
  try {
    const params = { ...obj.payload };
    const data = yield call(apiGetInsuaranceRefundConfig, params);

    if (data.status === 200) {
      yield put(
        getInsuranceRefundConfigSuccess({
          rs: data.data.result
        })
      );
    } else {
      yield put(getInsuranceRefundConfigFailure());
    }
  } catch (error) {
    yield put(getInsuranceRefundConfigFailure(error));
  }
}
