import { WORKFLOW } from '../actionsType';

export const getNewActionHandle = payload => ({
  type: WORKFLOW.GET_NEW_ACTION.HANDLER,
  payload
});

export const getNewActionSuccess = payload => ({
  type: WORKFLOW.GET_NEW_ACTION.SUCCESS,
  payload
});

export const getNewActionFailure = payload => ({
  type: WORKFLOW.GET_NEW_ACTION.FAILURE,
  payload
});

export const getNewActionClear = () => ({
  type: WORKFLOW.GET_NEW_ACTION.CLEAR
});
