import { Action } from 'redux';

export enum CommonActionType {
  RESET_ALL_STATE = 'RESET_ALL_STATE',
}

export interface IError {
  message: string;
  code: number;
  data?: any;
}

export interface IActionCallback {
  onSuccess?: (data?: any, identify?: string) => void;
  onFail?: (error?: IError) => void;
}

export interface IActionResetAllState extends Action {
  type: CommonActionType.RESET_ALL_STATE;
}
