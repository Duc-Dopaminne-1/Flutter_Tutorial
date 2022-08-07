import {
  ActionTypes,
  IActionGetListVisitorPayload,
  IActionGetListVisitor,
  IActionSaveListVisitorPayload,
  IActionSaveListVisitor,
  IActionGetListFacilitiesPayload,
  IActionGetListFacilities,
  IActionSaveListFacilitiesPayload,
  IActionSaveListFacilities,
  IActionLoadMoreFacilitiesPayload,
  IActionLoadMoreFacilities,
  IActionCreateFacilityPayload,
  IActionCreateFacility,
  IActionDeleteFacilityPayload,
  IActionDeleteFacility,
  IActionUpdateFacilityPayload,
  IActionUpdateFacility,
  IActionCheckInOutVisitorPayload,
  IActionCheckInOutVisitor,
  IActionLoadMoreVisitorsPayload,
  IActionLoadMoreVisitors,
  IActionCreateVisitorPayload,
  IActionCreateVisitor,
  IActionGetListDeliveryPayload,
  IActionGetListDelivery,
  IActionSaveListDeliveryPayload,
  IActionSaveListDelivery,
  IActionLoadMoreListDeliveryPayload,
  IActionLoadMoreListDelivery,
  IActionCheckShippedDelivery,
  IActionCheckShippedDeliveryPayload,
  IActionCreateDeliveryPayload,
  IActionCreateDelivery,
} from './index';

function getListFacilities(payload: IActionGetListFacilitiesPayload): IActionGetListFacilities {
  return {
    type: ActionTypes.GET_LIST_FACILITIES,
    payload,
  };
}

function saveListFacilities(payload: IActionSaveListFacilitiesPayload): IActionSaveListFacilities {
  return {
    type: ActionTypes.SAVE_LIST_FACILITIES,
    payload,
  };
}

function loadMoreFacilities(payload: IActionLoadMoreFacilitiesPayload): IActionLoadMoreFacilities {
  return {
    type: ActionTypes.LOAD_MORE_FACILITIES,
    payload,
  };
}

function createFacility(payload: IActionCreateFacilityPayload): IActionCreateFacility {
  return {
    type: ActionTypes.CREATE_FACILITY,
    payload,
  };
}

function deleteFacility(payload: IActionDeleteFacilityPayload): IActionDeleteFacility {
  return {
    type: ActionTypes.DELETE_FACILITY,
    payload,
  };
}

function updateFacility(payload: IActionUpdateFacilityPayload): IActionUpdateFacility {
  return {
    type: ActionTypes.UPDATE_FACILITY,
    payload,
  };
}

function getListVisitors(payload: IActionGetListVisitorPayload): IActionGetListVisitor {
  return {
    type: ActionTypes.GET_LIST_VISITOR,
    payload,
  };
}

function saveListVisitors(payload: IActionSaveListVisitorPayload): IActionSaveListVisitor {
  return {
    type: ActionTypes.SAVE_LIST_VISITOR,
    payload,
  };
}

function loadMoreVisitors(payload: IActionLoadMoreVisitorsPayload): IActionLoadMoreVisitors {
  return {
    type: ActionTypes.LOAD_MORE_VISITORS,
    payload,
  };
}

function checkInOutVisitor(payload: IActionCheckInOutVisitorPayload): IActionCheckInOutVisitor {
  return {
    type: ActionTypes.CHECK_IN_OUT_VISITOR,
    payload,
  };
}

function createVisitor(payload: IActionCreateVisitorPayload): IActionCreateVisitor {
  return {
    type: ActionTypes.CREATE_VISITOR,
    payload,
  };
}

function getListDelivery(payload: IActionGetListDeliveryPayload): IActionGetListDelivery {
  return {
    type: ActionTypes.GET_LIST_DELIVERY,
    payload,
  };
}

function saveListDelivery(payload: IActionSaveListDeliveryPayload): IActionSaveListDelivery {
  return {
    type: ActionTypes.SAVE_LIST_DELIVERY,
    payload,
  };
}

function loadMoreListDelivery(payload: IActionLoadMoreListDeliveryPayload): IActionLoadMoreListDelivery {
  return {
    type: ActionTypes.LOAD_MORE_LIST_DELIVERY,
    payload,
  };
}

function checkShippedDelivery(payload: IActionCheckShippedDeliveryPayload): IActionCheckShippedDelivery {
  return {
    type: ActionTypes.CHECK_SHIPPED_DELIVERY,
    payload,
  };
}

function createDelivery(payload: IActionCreateDeliveryPayload): IActionCreateDelivery {
  return {
    type: ActionTypes.CREATE_DELIVERY,
    payload,
  };
}

export {
  getListFacilities,
  saveListFacilities,
  loadMoreFacilities,
  createFacility,
  deleteFacility,
  updateFacility,
  getListVisitors,
  saveListVisitors,
  loadMoreVisitors,
  checkInOutVisitor,
  createVisitor,
  getListDelivery,
  saveListDelivery,
  loadMoreListDelivery,
  checkShippedDelivery,
  createDelivery,
};
