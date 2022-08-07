import * as actions from './actions';
import { Action } from 'redux';
import { AppStateStatus } from 'react-native';
import reducer from './reducer';

export enum ActionTypes {
  CHANGE_APP_STATE = '@HD/CHANGE_APP_STATE',
  CHANGE_ROOT = '@HD/CHANGE_ROOT',
  CHANGE_ORIENTATION = '@HD/CHANGE_ORIENTATION',
}

export enum AppStateTypes {
  active = 'active',
  background = 'background',
  inactive = 'inactive',
}

export interface IAppState {
  currentState: AppStateStatus;
  root: string;
}

export interface IActionCallback {
  [key: string]: any;
}

export interface IChangeRootActionPayload extends IActionCallback {
  root: string;
}

export interface IChangeOrientationActionPayload extends IActionCallback {
  orientation: string;
}

export interface IChangeAppStateActionPayload extends IActionCallback {
  appState: AppStateStatus;
}

export interface IChangeRootAction extends Action {
  type: ActionTypes.CHANGE_ROOT;
  payload: IChangeRootActionPayload;
}

export interface IChangeOrientationAction extends Action {
  type: ActionTypes.CHANGE_ORIENTATION;
  payload: IChangeOrientationActionPayload;
}

export interface IChangeAppStateAction extends Action {
  type: ActionTypes.CHANGE_APP_STATE;
  payload: IChangeAppStateActionPayload;
}

export type IAppStateAction = IChangeAppStateAction | IChangeRootAction | IChangeAppStateAction;

export type IChangeRoot = (payload: IChangeRootActionPayload) => IChangeRootAction;
export type IChangeOrientation = (payload: IChangeOrientationActionPayload) => IChangeOrientationAction;
export type IChangeAppState = (payload: IChangeAppStateActionPayload) => IChangeAppStateAction;

export interface DispatchProps {
  changeRoot: IChangeRoot;
  changeOrientation: IChangeOrientation;
  changeAppState: IChangeAppState;
}

export { actions, reducer };
