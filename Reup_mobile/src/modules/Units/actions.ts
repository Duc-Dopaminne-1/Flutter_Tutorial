import {
  ActionTypes,
  IActionGetMembersPayload,
  IActionGetMembers,
  IActionSaveMembersPayload,
  IActionGetVehiclesPayload,
  IActionGetVehicles,
  IActionSaveVehiclesPayload,
  IActionGetPetsPayload,
  IActionGetPets,
  IActionSavePetsPayload,
  IActionLoadMoreMembersPayload,
  IActionLoadMoreVehiclesPayload,
  IActionDeleteMemberPayload,
  IActionUpdateMemberPayload,
  IActionUpdateMember,
  IActionInvitationsPayload,
  IActionInvitations,
  IActionCreateMember,
  IActionCreateMemberPayload,
  IActionAddVehiclePayload,
  IActionUnitListMePayload,
  IActionUnitListMe,
  IActionSaveUnitListMePayload,
  IActionSaveUnitListMe,
  IActionLoadMoreUnitListMePayload,
  IActionLoadMoreUnitListMe,
  IActionAddPetPayload,
  IActionDeletePetPayload,
  IActionDeleteVehiclePayload,
} from './index';

function getMembers(payload: IActionGetMembersPayload): IActionGetMembers {
  return {
    type: ActionTypes.GET_MEMBERS,
    payload,
  };
}

function saveMembers(payload: IActionSaveMembersPayload) {
  return {
    type: ActionTypes.SAVE_MEMBERS,
    payload,
  };
}

function getVehicles(payload: IActionGetVehiclesPayload): IActionGetVehicles {
  return {
    type: ActionTypes.GET_VEHICLES,
    payload,
  };
}

function saveVehicles(payload: IActionSaveVehiclesPayload) {
  return {
    type: ActionTypes.SAVE_VEHICLES,
    payload,
  };
}

function addVehicle(payload: IActionAddVehiclePayload) {
  return {
    type: ActionTypes.ADD_VEHICLE,
    payload,
  };
}

function removeVehicle(payload: IActionDeleteVehiclePayload) {
  return {
    type: ActionTypes.REMOVE_VEHICLE,
    payload,
  };
}


function getPets(payload: IActionGetPetsPayload): IActionGetPets {
  return {
    type: ActionTypes.GET_PETS,
    payload,
  };
}

function savePets(payload: IActionSavePetsPayload) {
  return {
    type: ActionTypes.SAVE_PETS,
    payload,
  };
}

function addNewPet(payload: IActionAddPetPayload) {
  return {
    type: ActionTypes.ADD_PET,
    payload,
  };
}

function removePet(payload: IActionDeletePetPayload) {
  return {
    type: ActionTypes.REMOVE_PET,
    payload,
  };
}

function loadMoreMembers(payload: IActionLoadMoreMembersPayload) {
  return {
    type: ActionTypes.LOAD_MORE_MEMBERS,
    payload,
  };
}

function loadMoreVehicles(payload: IActionLoadMoreVehiclesPayload) {
  return {
    type: ActionTypes.LOAD_MORE_VEHICLES,
    payload,
  };
}

function loadMorePets(payload: IActionLoadMoreMembersPayload) {
  return {
    type: ActionTypes.LOAD_MORE_PETS,
    payload,
  };
}

function deleteMember(payload: IActionDeleteMemberPayload) {
  return {
    type: ActionTypes.DELETE_MEMBER,
    payload,
  };
}

function updateMember(payload: IActionUpdateMemberPayload): IActionUpdateMember {
  return {
    type: ActionTypes.UPDATE_MEMBER,
    payload,
  };
}

function createMember(payload: IActionCreateMemberPayload): IActionCreateMember {
  return {
    type: ActionTypes.CREATE_MEMBER,
    payload,
  };
}

function invitations(payload: IActionInvitationsPayload): IActionInvitations {
  return {
    type: ActionTypes.INVITATIONS,
    payload,
  };
}

function getUnitListMe(payload: IActionUnitListMePayload): IActionUnitListMe {
  return {
    type: ActionTypes.GET_LIST_UNIT_ME,
    payload,
  };
}

function saveUnitListMe(payload: IActionSaveUnitListMePayload): IActionSaveUnitListMe {
  return {
    type: ActionTypes.SAVE_LIST_UNIT_ME,
    payload,
  };
}

function loadMoreUnitListMe(payload: IActionLoadMoreUnitListMePayload): IActionLoadMoreUnitListMe {
  return {
    type: ActionTypes.LOAD_MORE_UNIT_ME,
    payload,
  };
}

export {
  getMembers,
  saveMembers,
  getVehicles,
  saveVehicles,
  addVehicle,
  removeVehicle,
  getPets,
  savePets,
  addNewPet,
  removePet,
  loadMoreMembers,
  loadMoreVehicles,
  loadMorePets,
  deleteMember,
  updateMember,
  createMember,
  invitations,
  getUnitListMe,
  saveUnitListMe,
  loadMoreUnitListMe,
};
