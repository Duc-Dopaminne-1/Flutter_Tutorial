import {
  AppActionType,
  IAppActionInit,
  IAppActionInited,
  IAppActionLoadData,
  IAppActionLoadedData,
  IAppActionReady,
  IAppActionTryAuth,
  IAppActionTryAuthDone,
  IAppActionNotAuth,
} from '@models/app';

export const init = (): IAppActionInit => ({
  type: AppActionType.INIT,
});

export const inited = (payload: any): IAppActionInited => ({
  type: AppActionType.INITED,
  payload,
});

export const loadData = (): IAppActionLoadData => ({
  type: AppActionType.LOAD_DATA,
});

export const loadedData = (payload: any): IAppActionLoadedData => ({
  type: AppActionType.LOADED_DATA,
  payload,
});

export const tryAuth = (): IAppActionTryAuth => ({
  type: AppActionType.TRY_AUTH,
});

export const tryAuthDone = (): IAppActionTryAuthDone => ({
  type: AppActionType.TRY_AUTH_DONE,
});

export const notAuth = (): IAppActionNotAuth => ({
  type: AppActionType.NOT_AUTH,
});

export const ready = (): IAppActionReady => ({
  type: AppActionType.READY,
});
