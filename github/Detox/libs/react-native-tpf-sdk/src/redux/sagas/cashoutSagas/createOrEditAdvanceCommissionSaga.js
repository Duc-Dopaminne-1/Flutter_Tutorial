import { call, put } from 'redux-saga/effects';
import { apiCreateOrEditAdvanceCommission } from '../../../services/api/cashoutApi';
import {
  createOrEditAdvanceCommissionFailure,
  createOrEditAdvanceCommissionSuccess
} from '../../actions/cashout';

export function* createOrEditAdvanceCommissionSaga(obj) {
  try {
    const params = {
      ...obj.payload
    };
    const data = yield call(apiCreateOrEditAdvanceCommission, params);
    if (data.status === 200) {
      yield put(
        createOrEditAdvanceCommissionSuccess({
          ...data.data.result,
          isSuccess: true
        })
      );
    } else {
      yield put(createOrEditAdvanceCommissionFailure(data));
    }
  } catch (error) {
    yield put(createOrEditAdvanceCommissionFailure(error));
  }
}
