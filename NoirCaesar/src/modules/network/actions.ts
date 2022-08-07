import { select } from 'redux-saga/effects';
import { ActionTypes, IChangeConnectionStatusPayload, IChangeConnectionStatusAction } from './index';

export function changeConnectionStatus(payload: IChangeConnectionStatusPayload): IChangeConnectionStatusAction {
  return {
    type: ActionTypes.CHANGE_CONNECTION_STATUS,
    payload,
  };
}

export function* isNetworkAvailable() {
  const getNetworkStatus = (state: any) => state.networkStatus;
  const { isConnected } = yield select(getNetworkStatus);
  return isConnected;
}
