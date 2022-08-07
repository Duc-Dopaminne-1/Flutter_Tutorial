import { KPI } from '../actionsType';

export const getPersonalKpiListHandle = payload => ({
  type: KPI.GET_PERSONAL_KPI_LIST.HANDLER,
  payload
});

export const getPersonalKpiListSuccess = payload => ({
  type: KPI.GET_PERSONAL_KPI_LIST.SUCCESS,
  payload
});

export const getPersonalKpiListFailure = payload => ({
  type: KPI.GET_PERSONAL_KPI_LIST.FAILURE,
  payload
});

export const getPersonalKpiDetailHandle = payload => ({
  type: KPI.GET_PERSONAL_KPI_DETAIL.HANDLER,
  payload
});

export const getPersonalKpiDetailSuccess = payload => ({
  type: KPI.GET_PERSONAL_KPI_DETAIL.SUCCESS,
  payload
});

export const getPersonalKpiDetailFailure = payload => ({
  type: KPI.GET_PERSONAL_KPI_DETAIL.FAILURE,
  payload
});

export const getPersonalKpiListClear = payload => ({
  type: KPI.GET_PERSONAL_KPI_LIST.CLEAR,
  payload
});

export const getPersonalKpiStatusSummaryHandle = payload => ({
  type: KPI.GET_PERSONAL_KPI_STATUS_SUMARY.HANDLER,
  payload
});

export const getPersonalKpiStatusSummarySuccess = payload => ({
  type: KPI.GET_PERSONAL_KPI_STATUS_SUMARY.SUCCESS,
  payload
});

export const getPersonalKpiStatusSummaryFailure = payload => ({
  type: KPI.GET_PERSONAL_KPI_STATUS_SUMARY.FAILURE,
  payload
});

export const getGroupKpiListHandle = payload => ({
  type: KPI.GET_GROUP_KPI_LIST.HANDLER,
  payload
});

export const getGroupKpiListSuccess = payload => ({
  type: KPI.GET_GROUP_KPI_LIST.SUCCESS,
  payload
});

export const getGroupKpiListFailure = payload => ({
  type: KPI.GET_GROUP_KPI_LIST.FAILURE,
  payload
});

export const getGrouplKpiListClear = payload => ({
  type: KPI.GET_GROUP_KPI_LIST.CLEAR,
  payload
});

export const getGroupKpiStatusSummaryHandle = payload => ({
  type: KPI.GET_GROUP_KPI_STATUS_SUMARY.HANDLER,
  payload
});

export const getGroupKpiStatusSummarySuccess = payload => ({
  type: KPI.GET_GROUP_KPI_STATUS_SUMARY.SUCCESS,
  payload
});

export const getGroupKpiStatusSummaryFailure = payload => ({
  type: KPI.GET_GROUP_KPI_STATUS_SUMARY.FAILURE,
  payload
});

export const getGroupKpiDetailHandle = payload => ({
  type: KPI.GET_GROUP_KPI_DETAIL.HANDLER,
  payload
});

export const getGroupKpiDetailSuccess = payload => ({
  type: KPI.GET_GROUP_KPI_DETAIL.SUCCESS,
  payload
});

export const getGroupKpiDetailFailure = payload => ({
  type: KPI.GET_GROUP_KPI_DETAIL.FAILURE,
  payload
});
