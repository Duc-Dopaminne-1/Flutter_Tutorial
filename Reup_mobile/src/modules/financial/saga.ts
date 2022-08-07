import { call, put, takeLatest } from 'redux-saga/effects';
import { isNetworkAvailable } from '../network/actions';
import { saveBankAccount, getBankAccount as reloadBankAccount } from './action';
import { IActionCreateBankAccount, IActionDeleteBankAccount, IActionGetBankAccount } from './index';
import * as Services from './service';
import { ActionTypes } from './index';

function* getBankAccount(action: IActionGetBankAccount) {
  const { onFail, onSuccess, propertyId } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(Services.getBankAccount, propertyId);
  console.log('get bank account', action, response, error);
  if (!error) {
    yield put(saveBankAccount({ result: response }));
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* createBankAccount(action: IActionCreateBankAccount) {
  const { onFail, onSuccess, propertyId, params } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(Services.createBankAccount, propertyId, params);
  console.log('create bank account', action, response, error);
  if (!error) {
    yield put(
      reloadBankAccount({
        propertyId,
        onSuccess: data => onSuccess && onSuccess(data),
        onFail: error => onFail && onFail(error),
      }),
    );
  } else {
    onFail && onFail(error);
  }
}

function* deleteBankAccount(action: IActionDeleteBankAccount) {
  const { onFail, onSuccess, propertyId } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { response, error } = yield call(Services.deleteBankAccount, propertyId);
  console.log('delete bank account', action, response, error);
  if (!error) {
    onSuccess && onSuccess(response);
  } else {
    onFail && onFail(error);
  }
}

function* financialSaga() {
  yield takeLatest(ActionTypes.GET_BANK_ACCOUNT, getBankAccount);
  yield takeLatest(ActionTypes.CREATE_BANK_ACCOUNT, createBankAccount);
  yield takeLatest(ActionTypes.DELETE_BANK_ACCOUNT, deleteBankAccount);
}

export default financialSaga;
