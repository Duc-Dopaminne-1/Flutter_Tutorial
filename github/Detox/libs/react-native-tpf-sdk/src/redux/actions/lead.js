import { LEAD } from '../actionsType';

export const getLeadListHandle = (payload, success, failure) => ({
  type: LEAD.GET_LEAD_LIST.HANDLER,
  payload,
  success,
  failure
});

export const getLeadListSuccess = payload => ({
  type: LEAD.GET_LEAD_LIST.SUCCESS,
  payload
});

export const getLeadListFailure = payload => ({
  type: LEAD.GET_LEAD_LIST.FAILURE,
  payload
});

export const getLeadListClear = payload => ({
  type: LEAD.GET_LEAD_LIST.CLEAR,
  payload
});

export const createOrEditLeadHandle = payload => ({
  type: LEAD.CREATE_OR_EDIT.HANDLER,
  payload
});

export const createOrEditLeadSuccess = payload => ({
  type: LEAD.CREATE_OR_EDIT.SUCCESS,
  payload
});

export const createOrEditLeadFailure = payload => ({
  type: LEAD.CREATE_OR_EDIT.FAILURE,
  payload
});
export const createOrEditLeadClear = payload => ({
  type: LEAD.CREATE_OR_EDIT.CLEAR,
  payload
});

export const getLeadDetailHandle = payload => ({
  type: LEAD.GET_LEAD_DETAIL.HANDLER,
  payload
});

export const getLeadDetailSuccess = payload => ({
  type: LEAD.GET_LEAD_DETAIL.SUCCESS,
  payload
});

export const getLeadDetailFailure = payload => ({
  type: LEAD.GET_LEAD_DETAIL.FAILURE,
  payload
});

export const getLeadDetailClear = payload => ({
  type: LEAD.GET_LEAD_DETAIL.CLEAR,
  payload
});

export const deleteLeadHandle = payload => ({
  type: LEAD.DELETE_LEAD.HANDLER,
  payload
});

export const deleteLeadSuccess = payload => ({
  type: LEAD.DELETE_LEAD.SUCCESS,
  payload
});

export const deleteLeadFailure = payload => ({
  type: LEAD.DELETE_LEAD.FAILURE,
  payload
});

export const deleteLeadClear = payload => ({
  type: LEAD.DELETE_LEAD.CLEAR,
  payload
});
export const updateStatusLeadHandle = payload => ({
  type: LEAD.UPDATE_STATUS_LEAD.HANDLER,
  payload
});

export const updateStatusLeadSuccess = payload => ({
  type: LEAD.UPDATE_STATUS_LEAD.SUCCESS,
  payload
});

export const updateStatusLeadFailure = payload => ({
  type: LEAD.UPDATE_STATUS_LEAD.FAILURE,
  payload
});

export const getLeadStatusSummaryHandle = payload => ({
  type: LEAD.GET_LEAD_STATUS_SUMMARY.HANDLER,
  payload
});

export const getLeadStatusSummarySuccess = payload => ({
  type: LEAD.GET_LEAD_STATUS_SUMMARY.SUCCESS,
  payload
});

export const getLeadStatusSummaryFailure = payload => ({
  type: LEAD.GET_LEAD_STATUS_SUMMARY.FAILURE,
  payload
});
export const createRequestHandle = payload => ({
  type: LEAD.CREATE_REQUEST.HANDLER,
  payload
});
