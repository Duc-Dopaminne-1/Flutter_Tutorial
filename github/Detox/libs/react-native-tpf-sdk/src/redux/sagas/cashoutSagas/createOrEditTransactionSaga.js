import { call, put } from 'redux-saga/effects';
import { getShowAlertError } from '../../../redux/actions/system';
import { CREATE_EDIT_TRANSACTION_FAILURE } from '../../../constants/errors';
import {
  createOrEditTransactionFailure,
  createOrEditTransactionSuccess
} from '../../actions/cashout';
import { apiCreateDepositRefundTransaction } from '../../../services/api/cashoutApi';
export function* createOrEditTransactionSaga(obj) {
  try {
    const {
      memberId,
      orderId,
      isAffiliateAccount,
      bank,
      bankBranch,
      bankProvince,
      bankAccount,
      accountHolder
    } = obj.payload;
    const data = yield call(apiCreateDepositRefundTransaction, {
      memberId,
      orderId,
      isAffiliateAccount,
      bank,
      bankBranch,
      bankProvince,
      bankAccount,
      accountHolder
    });
    if (data.status === 200) {
      yield put(
        createOrEditTransactionSuccess({
          ...data.data.result,
          isSuccess: true
        })
      );
    } else {
      yield put(createOrEditTransactionFailure(data));
      yield put(
        getShowAlertError({
          ...CREATE_EDIT_TRANSACTION_FAILURE,
          message: data?.message
        })
      );
    }
  } catch (error) {
    yield put(createOrEditTransactionFailure(error));
  }
}
