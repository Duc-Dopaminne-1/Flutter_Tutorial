import { SCHEDULE } from '../actionsType';
export const updateScheduleStatusHandle = payload => ({
  type: SCHEDULE.UPDATE_STATUS.HANDLER,
  payload
});

export const getScheduleDetailHandle = payload => ({
  type: SCHEDULE.GET_DETAIL.HANDLER,
  payload
});
export const getScheduleDetailSuccess = payload => ({
  type: SCHEDULE.GET_DETAIL.SUCCESS,
  payload
});
export const getScheduleDetailClear = payload => ({
  type: SCHEDULE.GET_DETAIL.CLEAR,
  payload
});

export const deleteScheduleHandle = payload => ({
  type: SCHEDULE.DELETE.HANDLER,
  payload
});

export const deleteScheduleSuccess = payload => ({
  type: SCHEDULE.DELETE.SUCCESS,
  payload
});

export const createOrEditScheduleHandle = payload => ({
  type: SCHEDULE.CREATE_OR_EDIT.HANDLER,
  payload
});

export const createOrEditScheduleSuccess = payload => ({
  type: SCHEDULE.CREATE_OR_EDIT.SUCCESS,
  payload
});
export const getListScheduleHandle = payload => ({
  type: SCHEDULE.GET_LIST.HANDLER,
  payload
});

export const getListScheduleSuccess = payload => ({
  type: SCHEDULE.GET_LIST.SUCCESS,
  payload
});

export const getListScheduleFailure = payload => ({
  type: SCHEDULE.GET_LIST.FAILURE,
  payload
});

export const getListScheduleClear = payload => ({
  type: SCHEDULE.GET_LIST.CLEAR,
  payload
});

export const getListInLeadScheduleHandle = payload => ({
  type: SCHEDULE.GET_LIST_IN_LEAD.HANDLER,
  payload
});

export const getListInLeadScheduleSuccess = payload => ({
  type: SCHEDULE.GET_LIST_IN_LEAD.SUCCESS,
  payload
});

export const getListInLeadScheduleFailure = payload => ({
  type: SCHEDULE.GET_LIST_IN_LEAD.FAILURE,
  payload
});

export const getListInLeadScheduleClear = payload => ({
  type: SCHEDULE.GET_LIST_IN_LEAD.CLEAR,
  payload
});

export const getListInFinanceScheduleHandle = payload => ({
  type: SCHEDULE.GET_LIST_IN_FINANCE.HANDLER,
  payload
});

export const getListInFinanceScheduleSuccess = payload => ({
  type: SCHEDULE.GET_LIST_IN_FINANCE.SUCCESS,
  payload
});

export const getListInFinanceScheduleFailure = payload => ({
  type: SCHEDULE.GET_LIST_IN_FINANCE.FAILURE,
  payload
});

export const getListInFinanceScheduleClear = payload => ({
  type: SCHEDULE.GET_LIST_IN_FINANCE.CLEAR,
  payload
});

export const exportFileHandle = payload => ({
  type: SCHEDULE.EXPORT_FILE.HANDLER,
  payload
});

export const exportFileSuccess = () => ({
  type: SCHEDULE.EXPORT_FILE.SUCCESS
});
