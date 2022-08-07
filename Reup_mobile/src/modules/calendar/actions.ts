import {
  ActionTypes,
  IActionGetListEventPayload,
  IActionGetListEvent,
  IActionSaveListEventPayload,
  IActionSaveListEvent,
  IActionLoadMoreListEventPayload,
  IActionLoadMoreListEvent,
  IActionCreateEventPayload,
  IActionCreateEvent,
  IActionDetailEventPayload,
  IActionDetailEvent,
  IActionUpdateEventPayload,
  IActionUpdateEvent,
  IActionRemoveEventPayload,
  IActionRemoveEvent,
  IActionChangeStatusEventPayload,
  IActionChangeStatusEvent,
  IActionCreateEventTenantPayload,
  IActionCreateEventTenant,
} from './index';

function getListEvent(payload: IActionGetListEventPayload): IActionGetListEvent {
  return {
    type: ActionTypes.GET_LIST_EVENT,
    payload,
  };
}

function saveListEvent(payload: IActionSaveListEventPayload): IActionSaveListEvent {
  return {
    type: ActionTypes.SAVE_LIST_EVENT,
    payload,
  };
}

function loadMoreListEvent(payload: IActionLoadMoreListEventPayload): IActionLoadMoreListEvent {
  return {
    type: ActionTypes.LOAD_MORE_LIST_EVENT,
    payload,
  };
}

function createEvent(payload: IActionCreateEventPayload): IActionCreateEvent {
  return {
    type: ActionTypes.CREATE_EVENT,
    payload,
  };
}

function detailEvent(payload: IActionDetailEventPayload): IActionDetailEvent {
  return {
    type: ActionTypes.DETAIL_EVENT,
    payload,
  };
}

function updateEvent(payload: IActionUpdateEventPayload): IActionUpdateEvent {
  return {
    type: ActionTypes.UPDATE_EVENT,
    payload,
  };
}

function removeEvent(payload: IActionRemoveEventPayload): IActionRemoveEvent {
  return {
    type: ActionTypes.REMOVE_EVENT,
    payload,
  };
}

function changeStatusEvent(payload: IActionChangeStatusEventPayload): IActionChangeStatusEvent {
  return {
    type: ActionTypes.CHANGE_STATUS_EVENT,
    payload,
  };
}

function createEventTenant(payload: IActionCreateEventTenantPayload): IActionCreateEventTenant {
  return {
    type: ActionTypes.CREATE_EVENT_TENANT,
    payload,
  };
}

export {
  getListEvent,
  saveListEvent,
  loadMoreListEvent,
  createEvent,
  detailEvent,
  updateEvent,
  removeEvent,
  changeStatusEvent,
  createEventTenant,
};
