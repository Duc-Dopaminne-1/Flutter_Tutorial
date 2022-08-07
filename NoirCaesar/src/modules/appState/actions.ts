import {
  ActionTypes,
  IChangeAppStateAction,
  IChangeAppStateActionPayload,
  IChangeOrientationAction,
  IChangeOrientationActionPayload,
  IChangeRootAction,
  IChangeRootActionPayload,
} from './index';

export function changeAppState(payload: IChangeAppStateActionPayload): IChangeAppStateAction {
  return {
    type: ActionTypes.CHANGE_APP_STATE,
    payload,
  };
}

export function changeRoot(payload: IChangeRootActionPayload): IChangeRootAction {
  return {
    type: ActionTypes.CHANGE_ROOT,
    payload,
  };
}

export function changeOrientation(payload: IChangeOrientationActionPayload): IChangeOrientationAction {
  return {
    type: ActionTypes.CHANGE_ORIENTATION,
    payload,
  };
}
