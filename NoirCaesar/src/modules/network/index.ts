import { Action } from 'redux';
import * as actions from './actions';
import reducer from './reducer';

export enum ActionTypes {
  CHANGE_CONNECTION_STATUS = 'CHANGE_CONNECTION_STATUS',
}

export interface INetworkStatus {
  isConnected: boolean;
}

export interface IChangeConnectionStatusPayload {
  isConnected: boolean;
}

export interface IChangeConnectionStatusAction extends Action {
  type: ActionTypes.CHANGE_CONNECTION_STATUS;
  payload: IChangeConnectionStatusPayload;
}

export type INetworkStatusAction = IChangeConnectionStatusAction;

export type IChangeConnectionStatus = (payload: IChangeConnectionStatusPayload) => IChangeConnectionStatusAction;

export interface DispatchProps {
  changeConnectionStatus: IChangeConnectionStatus;
}

export { actions, reducer };
