import { ReactElement, RefObject } from 'react';
import { Action } from 'redux';
import { FlatListProps } from 'react-native';
import { Schema } from 'normalizr';

export enum ActionTypes {
  LIST_INIT = 'LIST_INIT',
  LIST_CLEAR = 'LIST_CLEAR',
  LIST_LOAD_REQUEST = 'LIST_LOAD_REQUEST',
  LIST_LOAD_SUCCESS = 'LIST_LOAD_SUCCESS',
  LIST_LOAD_FAILURE = 'LIST_LOAD_FAILURE',
  LIST_ADD_ITEM = 'LIST_ADD_ITEM',
  LIST_REMOVE_ITEM = 'LIST_REMOVE_ITEM',
  LOGOUT = 'LOGOUT',
}
// Response
export interface IResponseError {
  error: Error;
}

export type IListLoadResponse =
  | IResponseError
  | {
      data: string[];
      entities: any;
      canLoadMore: boolean;
    };

export type IListLoadQuery = {
  keyword?: string;
  pageNumber?: number;
  limit?: number;
  [key: string]: any;
};

// Function
export type IOnLoad = (query: IListLoadQuery) => Promise<IListLoadResponse>;

// Payload
export interface IListPayload {
  listName: string;
}
export interface IListInitPayload extends IListPayload {
  limit: number;
  onLoad: IOnLoad;
}
export interface IErrorPayload extends IListPayload {
  error: Error;
}
export interface IListLoadPayload extends IListPayload {
  isRefresh: boolean;
  query: any;
}
export interface IListLoadSuccessPayload extends IListPayload {
  data: string[];
  canLoadMore: boolean;
  isRefresh: boolean;
}

export interface IListAddItemPayload extends IListPayload {
  id: string;
}

export interface IListRemoveItemPayload extends IListPayload {
  id: string;
}

// Actions
export interface IListInitAction extends Action {
  type: ActionTypes.LIST_INIT;
  payload: IListInitPayload;
}
export interface IListClearAction extends Action {
  type: ActionTypes.LIST_CLEAR;
  payload: IListPayload;
}
export interface IListLoadAction extends Action {
  type: ActionTypes.LIST_LOAD_REQUEST;
  payload: IListLoadPayload;
}
export interface IListLoadSuccessAction extends Action {
  type: ActionTypes.LIST_LOAD_SUCCESS;
  payload: IListLoadSuccessPayload;
}
export interface IListLoadFailureAction extends Action {
  type: ActionTypes.LIST_LOAD_FAILURE;
  payload: IErrorPayload;
}
export interface IListAddItemAction extends Action {
  type: ActionTypes.LIST_ADD_ITEM;
  payload: IListAddItemPayload;
}
export interface IListRemoveItemAction extends Action {
  type: ActionTypes.LIST_REMOVE_ITEM;
  payload: IListRemoveItemPayload;
}
export interface ILogout extends Action {
  type: ActionTypes.LOGOUT;
}
export type IListAction =
  | IListInitAction
  | IListClearAction
  | IListLoadAction
  | IListLoadSuccessAction
  | IListLoadFailureAction
  | IListAddItemAction
  | IListRemoveItemAction
  | ILogout;

// Dispatch
export type IListLoad = (payload: IListLoadPayload) => IListLoadAction;
export type IListInit = (payload: IListInitPayload) => IListInitAction;
export type IListClear = (payload: IListPayload) => IListClearAction;
export type IListLoadSuccess = (payload: IListLoadSuccessPayload) => IListLoadSuccessAction;
export type IListLoadFailure = (payload: IErrorPayload) => IListLoadFailureAction;
export type IListAddItem = (payload: IListAddItemPayload) => IListAddItemAction;
export type IListRemoveItem = (payload: IListRemoveItemPayload) => IListRemoveItemAction;

export interface IListDispatch {
  init: IListInit;
  load: IListLoad;
  loadSuccess: IListLoadSuccess;
  loadFailure: IListLoadFailure;
  clear: IListClear;
  addItem: IListAddItem;
  removeItem: IListRemoveItem;
}

// State
export interface IListItemState {
  inited: boolean;
  pageNumber: number;
  limit: number;
  loading: boolean;
  refreshing: boolean;
  canLoadMore: boolean;
  data: string[];
  error: Error | null;
  onLoad?: IOnLoad;
}
export interface IListState {
  [key: string]: IListItemState;
}

export interface IListOwnProps {
  listName: string;
  query?: any;
  onLoad: IOnLoad;
  renderLoadmore?: boolean;
  loadMoreText?: string;
  renderScrollToTop?: boolean;
  inverted?: boolean;
  extraData?: any;
  renderItem?: ({ item, index }: { item: string; index: number }) => ReactElement<string>;
  render?: (props: any) => any;
  schema?: Schema;
  limit?: number;
  listProps?: Partial<FlatListProps<any>>;
  ref?: RefObject<any>;
  onScrollBeginDrag?: () => void;
}
