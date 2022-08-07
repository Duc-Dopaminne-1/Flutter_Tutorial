import { IFinancialRequest, IFinancialResponse } from '@reup/reup-api-sdk/libs/api/financial/models';
import { IActionCallback } from '@src/models/callback';
import { Action } from 'redux';
import { IActionResetAllState } from '../auth';
import * as actions from './action';
import financialSaga from './saga';
import reducer from './reducer';

export enum ActionTypes {
  GET_BANK_ACCOUNT = 'GET_BANK_ACCOUNT',
  SAVE_BANK_ACCOUNT = 'SAVE_BANK_ACCOUNT',
  DELETE_BANK_ACCOUNT = 'DELETE_BANK_ACCOUNT',
  CREATE_BANK_ACCOUNT = 'CREATE_BANK_ACCOUNT',
}

// Payload

export interface IActionGetBankAccountPayload extends IActionCallback {
  propertyId: string;
}

export interface IActionDeleteBankAccountPayload extends IActionCallback {
  propertyId: string;
}

export interface IActionCreateBankAccountPayload extends IActionCallback {
  propertyId: string;
  params: IFinancialRequest;
}

export interface IActionSaveBankAccountPayload extends IActionCallback {
  result: IFinancialResponse;
}

// Action

export interface IActionGetBankAccount extends Action {
  type: ActionTypes.GET_BANK_ACCOUNT;
  payload: IActionGetBankAccountPayload;
}

export interface IActionDeleteBankAccount extends Action {
  type: ActionTypes.DELETE_BANK_ACCOUNT;
  payload: IActionDeleteBankAccountPayload;
}

export interface IActionCreateBankAccount extends Action {
  type: ActionTypes.CREATE_BANK_ACCOUNT;
  payload: IActionCreateBankAccountPayload;
}

export interface IActionSaveBankAccount extends Action {
  type: ActionTypes.SAVE_BANK_ACCOUNT;
  payload: IActionSaveBankAccountPayload;
}

export type IActionFinancial =
  | IActionResetAllState
  | IActionGetBankAccount
  | IActionDeleteBankAccount
  | IActionCreateBankAccount
  | IActionSaveBankAccount;

export { actions, financialSaga, reducer };
