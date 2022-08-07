import {
  ActionTypes,
  IActionGetListMaintenanceRequest,
  IActionGetListMaintenanceRequestPayload,
  IActionGetListMaintenanceCategory,
  IActionGetListMaintenanceCategoryPayload,
  IActionSaveListMaintenanceCategoryPayload,
  IActionSaveListMaintenanceCategory,
  IActionLoadMoreListMaintenanceCategoryPayload,
  IActionLoadMoreListMaintenanceCategory,
  IActionCreateMaintenanceCategoryPayload,
  IActionCreateMaintenanceCategory,
  IActionSaveListMaintenanceRequest,
  IActionSaveListMaintenanceRequestPayload,
  IActionSaveListStatusMaintenanceRequest,
  IActionSaveListStatusMaintenanceRequestPayload,
  IActionResetListStatusMaintenanceRequestPayload,
  IActionResetListStatusMaintenanceRequest,
  IActionLoadMoreListMaintenanceRequestPayload,
  IActionLoadMoreListMaintenanceRequest,
  IActionLoadMoreListStatusMaintenanceRequestPayload,
  IActionLoadMoreListStatusMaintenanceRequest,
  IActionCreateTaskPayload,
  IActionCreateTask,
  IActionGetGeneral,
  IActionGetGeneralPayload,
  IActionSaveGeneral,
  IActionSaveGeneralPayload,
  IActionUpdateMaintenanceCategoryPayload,
  IActionUpdateMaintenanceCategory,
  IActionGetListRecurringTask,
  IActionGetListRecurringTaskPayload,
  IActionSaveRecurringTasksPayload,
  IActionSaveRecurringTasks,
  IActionLoadMoreRecurringTasksPayload,
  IActionLoadMoreRecurringTasks,
  IActionDeleteMaintenanceCategory,
  IActionDeleteMaintenanceCategoryPayload,
  IActionGetListStatusMaintenanceRequestPayload,
  IActionGetListStatusMaintenanceRequest,
  IActionUpdateRecurringTaskPayload,
  IActionUpdateRecurringTask,
  IActionSaveStatusPayload,
  IActionSaveStatus,
  IActionDeleteRequestPayload,
  IActionDeleteRequest,
  IActionChangeStatusRequestPayload,
  IActionChangeStatusRequest,
  IActionCreateRequestPayload,
  IActionCreateRequest, IActionGetResidentRequestGeneralPayload, IActionGetResidentRequestGeneral, IActionGetListResidentRequest, IActionGetListResidentRequestPayload, IActionGetListStatusResidentRequest, IActionGetListStatusResidentRequestPayload, IActionGetListResidentCategory, IActionGetListResidentCategoryPayload, IActionResidentRequestPayload, IActionCreateResidentRequest, IActionAssigneeMaintenanceRequestPayload, IActionAssigneeMaintenanceRequest
} from './index';

function getListMaintenanceRequest(payload: IActionGetListMaintenanceRequestPayload): IActionGetListMaintenanceRequest {
  return {
    type: ActionTypes.GET_LIST_MAINTENANCE_REQUEST,
    payload,
  };
}

function getListResidentRequest(payload: IActionGetListResidentRequestPayload): IActionGetListResidentRequest {
  return {
    type: ActionTypes.GET_LIST_RESIDENT_REQUEST,
    payload,
  };
}

function getListMaintenanceCategory(payload: IActionGetListMaintenanceCategoryPayload): IActionGetListMaintenanceCategory {
  return {
    type: ActionTypes.GET_LIST_MAINTENANCE_CATEGORY,
    payload,
  };
}

function getListResidentCategory(payload: IActionGetListResidentCategoryPayload): IActionGetListResidentCategory {
  return {
    type: ActionTypes.GET_LIST_RESIDENT_CATEGORY,
    payload,
  };
}

function getListStatusMaintenanceRequest(payload: IActionGetListStatusMaintenanceRequestPayload): IActionGetListStatusMaintenanceRequest {
  return {
    type: ActionTypes.GET_LIST_STATUS_MAINTENANCE_REQUEST,
    payload,
  };
}

function getListStatusResidentRequest(payload: IActionGetListStatusResidentRequestPayload): IActionGetListStatusResidentRequest {
  return {
    type: ActionTypes.GET_LIST_STATUS_RESIDENT_REQUEST,
    payload,
  };
}

function saveListMaintenanceRequest(payload: IActionSaveListMaintenanceRequestPayload): IActionSaveListMaintenanceRequest {
  return {
    type: ActionTypes.SAVE_LIST_MAINTENANCE_REQUEST,
    payload,
  };
}

function saveListMaintenanceCategory(payload: IActionSaveListMaintenanceCategoryPayload): IActionSaveListMaintenanceCategory {
  return {
    type: ActionTypes.SAVE_LIST_MAINTENANCE_CATEGORY,
    payload,
  };
}

function saveListStatusMaintenanceRequest(
  payload: IActionSaveListStatusMaintenanceRequestPayload,
): IActionSaveListStatusMaintenanceRequest {
  return {
    type: ActionTypes.SAVE_LIST_STATUS_MAINTENANCE_REQUEST,
    payload,
  };
}

function loadmoreListMaintenanceCategory(payload: IActionLoadMoreListMaintenanceCategoryPayload): IActionLoadMoreListMaintenanceCategory {
  return {
    type: ActionTypes.LOAD_MORE_MAINTENANCE_CATEGORY,
    payload,
  };
}

function resetListStatusMaintenanceRequest(
  payload: IActionResetListStatusMaintenanceRequestPayload,
): IActionResetListStatusMaintenanceRequest {
  return {
    type: ActionTypes.RESET_LIST_STATUS_MAINTENANCE_REQUEST,
    payload,
  };
}

function createMaintenanceCategory(payload: IActionCreateMaintenanceCategoryPayload): IActionCreateMaintenanceCategory {
  return {
    type: ActionTypes.CREATE_MAINTENANCE_CATEGORY,
    payload,
  };
}

function loadMoreListMaintenanceRequest(payload: IActionLoadMoreListMaintenanceRequestPayload): IActionLoadMoreListMaintenanceRequest {
  return {
    type: ActionTypes.LOAD_MORE_LIST_MAINTENANCE_REQUEST,
    payload,
  };
}

function loadMoreListStatusMaintenanceRequest(
  payload: IActionLoadMoreListStatusMaintenanceRequestPayload,
): IActionLoadMoreListStatusMaintenanceRequest {
  return {
    type: ActionTypes.LOAD_MORE_LIST_STATUS_MAINTENANCE_REQUEST,
    payload,
  };
}

function createTaskRequest(payload: IActionCreateTaskPayload): IActionCreateTask {
  return {
    type: ActionTypes.CREATE_TASK,
    payload,
  };
}

function getGeneral(payload: IActionGetGeneralPayload): IActionGetGeneral {
  return {
    type: ActionTypes.GET_GENERAL,
    payload,
  };
}

function getResidentRequestGeneral(payload: IActionGetResidentRequestGeneralPayload): IActionGetResidentRequestGeneral {
  return {
    type: ActionTypes.GET_RESIDENT_GENERAL,
    payload,
  };
}

function saveGeneral(payload: IActionSaveGeneralPayload): IActionSaveGeneral {
  return {
    type: ActionTypes.SAVE_GENERAL,
    payload,
  };
}

function updateMaintenanceCategory(payload: IActionUpdateMaintenanceCategoryPayload): IActionUpdateMaintenanceCategory {
  return {
    type: ActionTypes.UPDATE_MAINTENANCE_CATEGORY,
    payload,
  };
}

function getListRecurringTask(payload: IActionGetListRecurringTaskPayload): IActionGetListRecurringTask {
  return {
    type: ActionTypes.GET_LIST_RECURRING_TASK,
    payload,
  };
}

function saveRecurringTasks(payload: IActionSaveRecurringTasksPayload): IActionSaveRecurringTasks {
  return {
    type: ActionTypes.SAVE_RECURRING_TASKS,
    payload,
  };
}

function loadMoreRecurringTasks(payload: IActionLoadMoreRecurringTasksPayload): IActionLoadMoreRecurringTasks {
  return {
    type: ActionTypes.LOAD_MORE_RECURRING_TASKS,
    payload,
  };
}

function deleteMaintenanceCategory(payload: IActionDeleteMaintenanceCategoryPayload): IActionDeleteMaintenanceCategory {
  return {
    type: ActionTypes.DELETE_MAINTENANCE_CATEGORY,
    payload,
  };
}

function updateRecurringTask(payload: IActionUpdateRecurringTaskPayload): IActionUpdateRecurringTask {
  return {
    type: ActionTypes.UPDATE_RECURRING_TASK,
    payload,
  };
}

function saveStatus(payload: IActionSaveStatusPayload): IActionSaveStatus {
  return {
    type: ActionTypes.SAVE_STATUS,
    payload,
  };
}

function deleteRequest(payload: IActionDeleteRequestPayload): IActionDeleteRequest {
  return {
    type: ActionTypes.DELETE_REQUEST,
    payload,
  };
}

function changeStatusRequest(payload: IActionChangeStatusRequestPayload): IActionChangeStatusRequest {
  return {
    type: ActionTypes.CHANGE_STATUS_REQUEST,
    payload,
  };
}

function createRequest(payload: IActionCreateRequestPayload): IActionCreateRequest {
  return {
    type: ActionTypes.CREATE_REQUEST,
    payload,
  };
}

function createResidentRequest(payload: IActionResidentRequestPayload): IActionCreateResidentRequest {
  return {
    type: ActionTypes.CREATE_RESIDENT_REQUEST,
    payload,
  };
}

function assigneeMaintenanceRequest(payload: IActionAssigneeMaintenanceRequestPayload): IActionAssigneeMaintenanceRequest {
  return {
    type: ActionTypes.ASSIGNEE_MAINTENANCE_REQUEST,
    payload,
  };
}

export {
  getListMaintenanceCategory,
  saveListMaintenanceCategory,
  loadmoreListMaintenanceCategory,
  createMaintenanceCategory,
  getListMaintenanceRequest,
  getListStatusMaintenanceRequest,
  saveListMaintenanceRequest,
  saveListStatusMaintenanceRequest,
  resetListStatusMaintenanceRequest,
  loadMoreListMaintenanceRequest,
  loadMoreListStatusMaintenanceRequest,
  createTaskRequest,
  getGeneral,
  saveGeneral,
  updateMaintenanceCategory,
  getListRecurringTask,
  saveRecurringTasks,
  loadMoreRecurringTasks,
  deleteMaintenanceCategory,
  updateRecurringTask,
  saveStatus,
  deleteRequest,
  changeStatusRequest,
  createRequest,
  getResidentRequestGeneral,
  getListResidentRequest,
  getListStatusResidentRequest,
  getListResidentCategory,
  createResidentRequest,
  assigneeMaintenanceRequest
};
