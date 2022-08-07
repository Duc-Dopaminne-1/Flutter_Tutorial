import { ActionTypes } from './index';

function addNotification(payload: any) {
  return {
    type: ActionTypes.ADD_LOCAL_NOTIFICATION,
    payload,
  };
}

function removeNotification(payload: any) {
  return {
    type: ActionTypes.REMOVE_LOCAL_NOTIFICATION,
    payload,
  };
}

export { addNotification, removeNotification };
