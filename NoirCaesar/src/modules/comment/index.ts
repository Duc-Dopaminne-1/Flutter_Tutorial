import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import reducer from './reducer';
import { ModelEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment';
import { Action } from 'redux';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IComment } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment/models';

export enum ActionTypes {
  GET_LIST_COMMENT = 'GET_LIST_COMMENT',
  CREATE_COMMENT = 'CREATE_COMMENT',
  SAVE_LIST_COMMENT = 'SAVE_LIST_COMMENT',
  LOAD_MORE_LIST_COMMENT = 'LOAD_MORE_LIST_COMMENT',
}

// Payloads
export interface IActionGetlistCommentPayload extends IActionCallback {
  model: ModelEnum;
  model_id: string;
  page?: number;
  limit?: number;
}

export interface IActionCreateCommentPayload extends IActionCallback {
  model: ModelEnum;
  model_id: string;
  text: string;
}

export interface IActionSaveListCommentPayload {
  results: IPagination<IComment>;
}

export interface IActionLoadMoreListCommentPayload {
  results: IPagination<IComment>;
}

// Actions
export interface IActionGetListComment extends Action {
  type: ActionTypes.GET_LIST_COMMENT;
  payload: IActionGetlistCommentPayload;
}

export interface IActionCreateComment extends Action {
  type: ActionTypes.CREATE_COMMENT;
  payload: IActionCreateCommentPayload;
}

export interface IActionSaveListComment extends Action {
  type: ActionTypes.SAVE_LIST_COMMENT;
  payload: IActionSaveListCommentPayload;
}

export interface IActionLoadMoreListComment extends Action {
  type: ActionTypes.LOAD_MORE_LIST_COMMENT;
  payload: IActionLoadMoreListCommentPayload;
}

export type IActionComments =
  | IActionGetListComment
  | IActionCreateComment
  | IActionSaveListComment
  | IActionLoadMoreListComment
  | IActionResetAllState;

export { reducer };
