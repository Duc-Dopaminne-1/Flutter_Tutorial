import {
  ActionTypes,
  IActionCreateBankAccount,
  IActionCreateBankAccountPayload,
  IActionDeleteBankAccount,
  IActionDeleteBankAccountPayload,
  IActionGetBankAccount,
  IActionGetBankAccountPayload,
  IActionSaveBankAccount,
  IActionSaveBankAccountPayload,
} from './index';

function getBankAccount(payload: IActionGetBankAccountPayload): IActionGetBankAccount {
  return {
    type: ActionTypes.GET_BANK_ACCOUNT,
    payload,
  };
}

function createBankAccount(payload: IActionCreateBankAccountPayload): IActionCreateBankAccount {
  return {
    type: ActionTypes.CREATE_BANK_ACCOUNT,
    payload,
  };
}

function deleteBankAccount(payload: IActionDeleteBankAccountPayload): IActionDeleteBankAccount {
  return {
    type: ActionTypes.DELETE_BANK_ACCOUNT,
    payload,
  };
}

function saveBankAccount(payload: IActionSaveBankAccountPayload): IActionSaveBankAccount {
  return {
    type: ActionTypes.SAVE_BANK_ACCOUNT,
    payload,
  };
}

export { getBankAccount, deleteBankAccount, createBankAccount, saveBankAccount };
