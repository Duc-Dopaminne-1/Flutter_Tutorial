import {
  ActionTypes,
  IListAddItem,
  IListClear,
  IListInit,
  IListLoad,
  IListLoadFailure,
  IListLoadSuccess,
  IListRemoveItem,
} from './interface';

export const init: IListInit = payload => ({
  type: ActionTypes.LIST_INIT,
  payload,
});

export const clear: IListClear = payload => ({
  type: ActionTypes.LIST_CLEAR,
  payload,
});

export const load: IListLoad = payload => ({
  type: ActionTypes.LIST_LOAD_REQUEST,
  payload,
});

export const loadSuccess: IListLoadSuccess = payload => ({
  type: ActionTypes.LIST_LOAD_SUCCESS,
  payload,
});

export const loadFailure: IListLoadFailure = payload => ({
  type: ActionTypes.LIST_LOAD_FAILURE,
  payload,
});

export const addItem: IListAddItem = payload => ({
  type: ActionTypes.LIST_ADD_ITEM,
  payload,
});

export const removeItem: IListRemoveItem = payload => ({
  type: ActionTypes.LIST_REMOVE_ITEM,
  payload,
});
