import { KPI, MASTER_DATA } from '../actionsType';

export const getMasterDataHandle = payload => ({
  type: MASTER_DATA.GET_ALL.HANDLER,
  payload
});

export const getMasterDataSuccess = payload => ({
  type: MASTER_DATA.GET_ALL.SUCCESS,
  payload
});

export const getMasterDataFailure = payload => ({
  type: MASTER_DATA.GET_ALL.FAILURE,
  payload
});

export const getAllTriggerHandle = payload => ({
  type: MASTER_DATA.GET_ALL_TRIGGER.HANDLER,
  payload
});

export const getAllTriggerSuccess = payload => ({
  type: MASTER_DATA.GET_ALL_TRIGGER.SUCCESS,
  payload
});

export const getAllTriggerFailure = payload => ({
  type: MASTER_DATA.GET_ALL_TRIGGER.FAILURE,
  payload
});

export const getFlowByTriggerCodeHandle = payload => ({
  type: MASTER_DATA.GET_FLOW_BY_TRIGGER_CODE.HANDLER,
  payload
});

export const getFlowByTriggerCodeSuccess = payload => ({
  type: MASTER_DATA.GET_FLOW_BY_TRIGGER_CODE.SUCCESS,
  payload
});

export const getFlowByTriggerCodeFailure = payload => ({
  type: MASTER_DATA.GET_FLOW_BY_TRIGGER_CODE.FAILURE,
  payload
});

export const getFlowByTriggerCodeClear = payload => ({
  type: MASTER_DATA.GET_FLOW_BY_TRIGGER_CODE.CLEAR,
  payload
});

export const getBecomeTopenerHandle = (payload, success, failure) => ({
  type: MASTER_DATA.GET_BECOME_TOPENER.HANDLER,
  payload,
  success,
  failure
});

export const getBecomeTopenerSuccess = payload => ({
  type: MASTER_DATA.GET_BECOME_TOPENER.SUCCESS,
  payload
});

export const getBecomeTopenerFailure = payload => ({
  type: MASTER_DATA.GET_BECOME_TOPENER.FAILURE,
  payload
});

export const getInfoServiceHandle = payload => ({
  type: MASTER_DATA.GET_INFO_SERVICE.HANDLER,
  payload
});

export const getInfoServiceSuccess = payload => ({
  type: MASTER_DATA.GET_INFO_SERVICE.SUCCESS,
  payload
});

export const getInfoServiceFailure = payload => ({
  type: MASTER_DATA.GET_INFO_SERVICE.FAILURE,
  payload
});

export const getListTriggerHandle = payload => ({
  type: MASTER_DATA.GET_LIST_TRIGGER.HANDLER,
  payload
});

export const getListTriggerSuccess = payload => ({
  type: MASTER_DATA.GET_LIST_TRIGGER.SUCCESS,
  payload
});

export const getListTriggerFailure = payload => ({
  type: MASTER_DATA.GET_LIST_TRIGGER.FAILURE,
  payload
});
