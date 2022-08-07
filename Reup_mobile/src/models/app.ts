import { Action } from 'redux';

// State
export enum AppStatus {
  MOUNTED = 'MOUNTED',
  INITING = 'INITING',
  INITED = 'INITED',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  TRY_AUTH = 'TRY_AUTH',
  TRY_AUTH_DONE = 'TRY_AUTH_DONE',
  NOT_AUTH = 'NOT_AUTH',
  READY = 'READY',
  RELOADED = 'RELOADED',
}

export interface IAppState {
  status: AppStatus;
  newVersion: boolean;
  supported: boolean;
  data: any;
}

// Actions
export enum AppActionType {
  INIT = 'APP_INIT',
  INITED = 'APP_INITED',
  LOAD_DATA = 'LOAD_DATA',
  LOADED_DATA = 'LOADED_DATA',
  TRY_AUTH = 'TRY_AUTH',
  TRY_AUTH_DONE = 'TRY_AUTH_DONE',
  NOT_AUTH = 'NOT_AUTH',
  READY = 'READY',
  LOAD_USER_DATA = 'LOAD_USER_DATA',
  LOG_OUT = 'LOG_OUT',
  RELOAD = 'APP_RELOAD',
}

export interface IAppActionInit extends Action {
  type: AppActionType.INIT;
}

export interface IAppActionInited extends Action {
  type: AppActionType.INITED;
  payload: any;
}

export interface IAppActionLoadData extends Action {
  type: AppActionType.LOAD_DATA;
}

export interface IAppActionLoadedData extends Action {
  type: AppActionType.LOADED_DATA;
  payload: any;
}

export interface IAppActionTryAuth extends Action {
  type: AppActionType.TRY_AUTH;
}

export interface IAppActionTryAuthDone extends Action {
  type: AppActionType.TRY_AUTH_DONE;
}

export interface IAppActionNotAuth extends Action {
  type: AppActionType.NOT_AUTH;
}

export interface IAppActionReady extends Action {
  type: AppActionType.READY;
}

export interface IAppActionLogout extends Action {
  type: AppActionType.LOG_OUT;
}

export type IAppAction =
  | IAppActionInit
  | IAppActionInited
  | IAppActionLoadData
  | IAppActionLoadedData
  | IAppActionTryAuth
  | IAppActionTryAuthDone
  | IAppActionReady
  | IAppActionLogout
  | IAppActionNotAuth;

// Dispatch
export interface IAppDispatch {
  init: () => IAppActionInit;
  inited: (payload: any) => IAppActionInited;
  loadData: () => IAppActionLoadData;
  loadedData: (payload: any) => IAppActionLoadedData;
  tryAuth: () => IAppActionTryAuth;
  tryAuthDone: () => IAppActionTryAuthDone;
  notAuth: () => IAppActionNotAuth;
  ready: () => IAppActionReady;
}
