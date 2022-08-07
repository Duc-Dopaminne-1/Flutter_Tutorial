import {
  ActionTypes,
  IActionGetListCompany,
  IActionGetListCompanyPayload,
  IActionSaveListCompany,
  IActionSaveListCompanyPayload,
  IActionCreateCompany,
  IActionCreateCompanyPayload,
  IActionGetListPositionPayload,
  IActionGetListPosition,
  IActionSaveListPositionPayload,
  IActionSaveListPosition,
  IActionCreatePosition,
  IActionCreatePositionPayload,
  IActionUpdatePositionPayload,
  IActionUpdatePosition,
  IActionDeletePositionPayload,
  IActionDeletePosition,
  IActionGetListStaffPayload,
  IActionGetListStaff,
  IActionSaveListStaffPayload,
  IActionSaveListStaff,
  IActionCountStaffPayload,
  IActionCountStaff,
  IActionSaveCountStaffPayload,
  IActionSaveCountStaff,
  IActionCountResident,
  IActionCountResidentPayload,
  IActionSaveCountResident,
  IActionSaveCountResidentPayload,
  IActionLoadMoreListPositionPayload,
  IActionLoadMoreListPosition,
  IActionLoadMoreListStaffPayload,
  IActionLoadMoreListStaff,
  IActionGetListPropertyPayload,
  IActionGetListProperty,
  IActionSaveListPropertyPayload,
  IActionSaveListProperty,
  IActionLoadMoreListPropertyPayload,
  IActionLoadMoreListProperty,
  IActionCreatePropertyPayload,
  IActionCreateProperty,
  IActionDetailProperty,
  IActionDetailPropertyPayload,
  IActionUpdatePropertyPayload,
  IActionUpdateProperty,
  IActionDeletePropertyPayload,
  IActionDeleteProperty,
  IActionGetListPropertyTypePayload,
  IActionGetListPropertyType,
  IActionSavePropertyTypePayload,
  IActionSaveListPropertyType,
  IActionGetListApartmentPayload,
  IActionGetListApartment,
  IActionSaveListApartmentPayload,
  IActionSaveListApartment,
  IActionLoadMoreListApartmentPayload,
  IActionLoadMoreListApartment,
  IActionInviteStaff,
  IActionInviteStaffPayload,
  IActionGetMyListCountryPayload,
  IActionSaveMyListCountryPayload,
  IActionSaveMyListCountry,
  IActionGetMyListCountry,
  IActionCreateApartmentPayload,
  IActionCreateApartment,
  IActionRemoveStaffPayload,
  IActionRemoveStaff,
  IActionGetListTenantPayload,
  IActionGetListTenant,
  IActionSaveListTenantPayload,
  IActionSaveListTenant,
  IActionLoadMoreListTenantPayload,
  IActionLoadMoreListTenant,
  IActionTransferApartmentPayload,
  IActionTransferApartment,
  IActionRemoveTenant,
  IActionRemoveTenantPayload,
  IActionGetListDocumentPayload,
  IActionGetListDocument,
  IActionSaveDocuments,
  IActionSaveDocumentsPayload,
  IActionLoadMoreDocumentsPayload,
  IActionLoadMoreDocuments,
  IActionDetailApartment,
  IActionDetailApartmentPayload,
  IActionGetListMyPropertyPayload,
  IActionGetListMyProperty,
  IActionSaveListMyPropertyPayload,
  IActionSaveListMyProperty,
  IActionGetUserPermissionsPayload,
  IActionGetUserPermissions
} from './index';

function getListCompany(payload: IActionGetListCompanyPayload): IActionGetListCompany {
  return {
    type: ActionTypes.GET_LIST_COMPANY,
    payload,
  };
}

function saveListCompany(payload: IActionSaveListCompanyPayload): IActionSaveListCompany {
  return {
    type: ActionTypes.SAVE_LIST_COMPANY,
    payload,
  };
}

function createCompany(payload: IActionCreateCompanyPayload): IActionCreateCompany {
  return {
    type: ActionTypes.CREATE_COMPANY,
    payload,
  };
}

function getListPosition(payload: IActionGetListPositionPayload): IActionGetListPosition {
  return {
    type: ActionTypes.GET_LIST_POSITION,
    payload,
  };
}

function saveListPosition(payload: IActionSaveListPositionPayload): IActionSaveListPosition {
  return {
    type: ActionTypes.SAVE_LIST_POSITION,
    payload,
  };
}

function loadMoreListPosition(payload: IActionLoadMoreListPositionPayload): IActionLoadMoreListPosition {
  return {
    type: ActionTypes.LOAD_MORE_LIST_POSITION,
    payload,
  };
}

function createPosition(payload: IActionCreatePositionPayload): IActionCreatePosition {
  return {
    type: ActionTypes.CREATE_POSITION,
    payload,
  };
}

function updatePosition(payload: IActionUpdatePositionPayload): IActionUpdatePosition {
  return {
    type: ActionTypes.UPDATE_POSITION,
    payload,
  };
}

function deletePosition(payload: IActionDeletePositionPayload): IActionDeletePosition {
  return {
    type: ActionTypes.DELETE_POSITION,
    payload,
  };
}

function getListStaff(payload: IActionGetListStaffPayload): IActionGetListStaff {
  return {
    type: ActionTypes.GET_LIST_STAFF,
    payload,
  };
}

function removeStaff(payload: IActionRemoveStaffPayload): IActionRemoveStaff {
  return {
    type: ActionTypes.REMOVE_STAFF,
    payload,
  };
}

function saveListStaff(payload: IActionSaveListStaffPayload): IActionSaveListStaff {
  return {
    type: ActionTypes.SAVE_LIST_STAFF,
    payload,
  };
}

function countListStaff(payload: IActionCountStaffPayload): IActionCountStaff {
  return {
    type: ActionTypes.COUNT_LIST_STAFF,
    payload,
  };
}

function loadMoreListStaff(payload: IActionLoadMoreListStaffPayload): IActionLoadMoreListStaff {
  return {
    type: ActionTypes.LOAD_MORE_LIST_STAFF,
    payload,
  };
}

function saveCountListStaff(payload: IActionSaveCountStaffPayload): IActionSaveCountStaff {
  return {
    type: ActionTypes.SAVE_COUNT_LIST_STAFF,
    payload,
  };
}

function getListProperty(payload: IActionGetListPropertyPayload): IActionGetListProperty {
  return {
    type: ActionTypes.GET_LIST_PROPERTY,
    payload,
  };
}

function countListResident(payload: IActionCountResidentPayload): IActionCountResident {
  return {
    type: ActionTypes.COUNT_LIST_RESIDENT,
    payload,
  };
}

function saveListProperty(payload: IActionSaveListPropertyPayload): IActionSaveListProperty {
  return {
    type: ActionTypes.SAVE_LIST_PROPERTTY,
    payload,
  };
}

function saveCountListResident(payload: IActionSaveCountResidentPayload): IActionSaveCountResident {
  return {
    type: ActionTypes.SAVE_COUNT_LIST_RESIDENT,
    payload,
  };
}

function loadMoreListProperty(payload: IActionLoadMoreListPropertyPayload): IActionLoadMoreListProperty {
  return {
    type: ActionTypes.LOAD_MORE_LIST_PROPERTY,
    payload,
  };
}

function createProperty(payload: IActionCreatePropertyPayload): IActionCreateProperty {
  return {
    type: ActionTypes.CREATE_PROPERTY,
    payload,
  };
}

function detailProperty(payload: IActionDetailPropertyPayload): IActionDetailProperty {
  return {
    type: ActionTypes.DETAIL_PROPERTY,
    payload,
  };
}

function updateProperty(payload: IActionUpdatePropertyPayload): IActionUpdateProperty {
  return {
    type: ActionTypes.UPDATE_PROPERTY,
    payload,
  };
}

function deleteProperty(payload: IActionDeletePropertyPayload): IActionDeleteProperty {
  return {
    type: ActionTypes.DELETE_PROPERTY,
    payload,
  };
}

function getListPropertyType(payload: IActionGetListPropertyTypePayload): IActionGetListPropertyType {
  return {
    type: ActionTypes.GET_LIST_PROPERTY_TYPE,
    payload,
  };
}

function saveListPropertyType(payload: IActionSavePropertyTypePayload): IActionSaveListPropertyType {
  return {
    type: ActionTypes.SAVE_LIST_PROPERTY_TYPE,
    payload,
  };
}

function getListApartment(payload: IActionGetListApartmentPayload): IActionGetListApartment {
  return {
    type: ActionTypes.GET_LIST_APARTMENT,
    payload,
  };
}

function saveListApartment(payload: IActionSaveListApartmentPayload): IActionSaveListApartment {
  return {
    type: ActionTypes.SAVE_LIST_APARTMENT,
    payload,
  };
}

function detailApartment(payload: IActionDetailApartmentPayload): IActionDetailApartment {
  return {
    type: ActionTypes.DETAIL_APARTMENT,
    payload,
  };
}

function createApartment(payload: IActionCreateApartmentPayload): IActionCreateApartment {
  return {
    type: ActionTypes.CREATE_APARTMENT,
    payload,
  };
}

function inviteStaff(payload: IActionInviteStaffPayload): IActionInviteStaff {
  return {
    type: ActionTypes.INVITE_STAFF,
    payload,
  };
}

function saveMyListCountry(payload: IActionSaveMyListCountryPayload): IActionSaveMyListCountry {
  return {
    type: ActionTypes.SAVE_MY_COUNTRIES,
    payload,
  };
}

function loadMoreListApartment(payload: IActionLoadMoreListApartmentPayload): IActionLoadMoreListApartment {
  return {
    type: ActionTypes.LOAD_MORE_LIST_APARTMENT,
    payload,
  };
}

function getMyListCountry(payload: IActionGetMyListCountryPayload): IActionGetMyListCountry {
  return {
    type: ActionTypes.GET_MY_COUNTRIES,
    payload,
  };
}

function getListTenant(payload: IActionGetListTenantPayload): IActionGetListTenant {
  return {
    type: ActionTypes.GET_LIST_TENANT,
    payload,
  };
}

function saveListTenant(payload: IActionSaveListTenantPayload): IActionSaveListTenant {
  return {
    type: ActionTypes.SAVE_LIST_TENANT,
    payload,
  };
}

function loadMoreListTenant(payload: IActionLoadMoreListTenantPayload): IActionLoadMoreListTenant {
  return {
    type: ActionTypes.LOAD_MORE_LIST_TENANT,
    payload,
  };
}

function transferApartment(payload: IActionTransferApartmentPayload): IActionTransferApartment {
  return {
    type: ActionTypes.TRANSFER_APARTMENT,
    payload,
  };
}

function removeTenant(payload: IActionRemoveTenantPayload): IActionRemoveTenant {
  return {
    type: ActionTypes.REMOVE_TENANT,
    payload,
  };
}

function getListDocument(payload: IActionGetListDocumentPayload): IActionGetListDocument {
  return {
    type: ActionTypes.GET_LIST_DOCUMENT,
    payload,
  };
}

function saveDocuments(payload: IActionSaveDocumentsPayload): IActionSaveDocuments {
  return {
    type: ActionTypes.SAVE_DOCUMENTS,
    payload,
  };
}

function loadMoreDocument(payload: IActionLoadMoreDocumentsPayload): IActionLoadMoreDocuments {
  return {
    type: ActionTypes.LOAD_MORE_DOCUMENTS,
    payload,
  };
}

function getListMyProperty(payload: IActionGetListMyPropertyPayload): IActionGetListMyProperty {
  return {
    type: ActionTypes.GET_MY_PROPERTY,
    payload,
  };
}

function saveListMyProperty(payload: IActionSaveListMyPropertyPayload): IActionSaveListMyProperty {
  return {
    type: ActionTypes.SAVE_LIST_MY_PROPERTY,
    payload,
  };
}

function getUserPermissions(payload: IActionGetUserPermissionsPayload): IActionGetUserPermissions {
  return {
    type: ActionTypes.GET_USER_PERMISSIONS,
    payload
  };
}

export {
  getListCompany,
  saveListCompany,
  createCompany,
  getListPosition,
  saveListPosition,
  createPosition,
  updatePosition,
  deletePosition,
  getListStaff,
  saveListStaff,
  countListStaff,
  saveCountListStaff,
  countListResident,
  getListMyProperty,
  saveCountListResident,
  loadMoreListPosition,
  loadMoreListStaff,
  getListProperty,
  saveListProperty,
  loadMoreListProperty,
  createProperty,
  detailProperty,
  updateProperty,
  deleteProperty,
  getListPropertyType,
  saveListPropertyType,
  getListApartment,
  saveListApartment,
  loadMoreListApartment,
  detailApartment,
  inviteStaff,
  saveMyListCountry,
  getMyListCountry,
  createApartment,
  removeStaff,
  getListTenant,
  saveListTenant,
  loadMoreListTenant,
  transferApartment,
  removeTenant,
  getListDocument,
  saveDocuments,
  loadMoreDocument,
  saveListMyProperty,
  getUserPermissions
};
