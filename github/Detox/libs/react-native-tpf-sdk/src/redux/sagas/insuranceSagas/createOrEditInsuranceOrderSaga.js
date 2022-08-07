import { call, put } from 'redux-saga/effects';
import { apiCreateInsuranceOrder, apiEditInsuranceOrder } from '../../../services/api/insuranceApi';
import {
  createInsuranceOrderFailure,
  createInsuranceOrderSuccess,
  editInsuranceOrderFailure,
  editInsuranceOrderSuccess
} from '../../actions/insurance';

export function* createInsuranceOrderSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(apiCreateInsuranceOrder, params);

    if (data.status === 200) {
      yield put(
        createInsuranceOrderSuccess({
          ...data.data.result,
          isSuccess: true,
          isBack: obj.payload.action === 'Back',
          action: obj.payload.action,
          step: obj.payload.step
        })
      );
    } else {
      yield put(createInsuranceOrderFailure({ ...data.response, isError: true }));
    }
  } catch (error) {
    yield put(createInsuranceOrderFailure(error));
  }
}

export function* editInsuranceOrderSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };

    const data = yield call(apiEditInsuranceOrder, params);

    if (data.status === 200) {
      yield put(
        editInsuranceOrderSuccess({
          ...data.data.result,
          isSuccess: true,
          isBack: obj.payload.action === 'Back',
          action: obj.payload.action,
          step: obj.payload.step
        })
      );
    } else {
      yield put(editInsuranceOrderFailure({ ...data.response, isError: true }));
    }
  } catch (error) {
    yield put(editInsuranceOrderFailure(error));
  }
}
