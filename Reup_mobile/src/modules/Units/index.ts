import * as action from './actions';
import unitSaga from './saga';
import unitReducer from './reducer';
import { IActionCallback } from '@src/models/callback';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IUnitMember, IUnitMemberInvitation, IMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';
import { IUnitVehicle } from '@reup/reup-api-sdk/libs/api/unit/vehicle/models';
import { IUnitPet } from '@reup/reup-api-sdk/libs/api/unit/pet/models';
import { Action } from 'redux';
import { IActionResetAllState } from '../auth';
import { UpdateUnitMemberParams, CreateUnitMemberParams } from '@reup/reup-api-sdk/libs/api/unit/member';
import { CreateUnitVehicleParams } from '@reup/reup-api-sdk/libs/api/unit/vehicle';
import { IUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { CreateUnitPetParams } from '@reup/reup-api-sdk/libs/api/unit/pet';
import { QueryParamUnit } from '@reup/reup-api-sdk/libs/api/unit';

//ACTION TYPE
export enum ActionTypes {
  GET_MEMBERS = 'GET_MEMBERS',
  SAVE_MEMBERS = 'SAVE_MEMBERS',
  GET_VEHICLES = 'GET_VEHICLES',
  SAVE_VEHICLES = 'SAVE_VEHICLES',
  ADD_VEHICLE = 'ADD_VEHICLE',
  REMOVE_VEHICLE = 'REMOVE_VEHICLE',
  GET_PETS = 'GET_PETS',
  SAVE_PETS = 'SAVE_PETS',
  ADD_PET = 'ADD_PET',
  REMOVE_PET = 'REMOVE_PET',
  CREATE_MEMBER = 'CREATE_MEMBER',
  LOAD_MORE_MEMBERS = 'LOAD_MORE_MEMBERS',
  LOAD_MORE_VEHICLES = 'LOAD_MORE_VEHICLES',
  LOAD_MORE_PETS = 'LOAD_MORE_PETS',
  DELETE_MEMBER = 'DELETE_MEMBER',
  UPDATE_MEMBER = 'UPDATE_MEMBER',
  INVITATIONS = 'INVITATIONS',
  GET_LIST_UNIT_ME = 'GET_LIST_UNIT_ME',
  SAVE_LIST_UNIT_ME = 'SAVE_LIST_UNIT_ME',
  LOAD_MORE_UNIT_ME = 'LOAD_MORE_UNIT_ME',
}

//PAYLOAD
export interface IActionGetMembersPayload extends IActionCallback {
  unitId: string;
  page?: number;
  limit?: number;
}

export interface IActionCreateMember extends Action {
  type: ActionTypes.CREATE_MEMBER;
  payload: IActionCreateMemberPayload;
}

export interface IActionCreateMemberPayload extends IActionCallback {
  unitId: string;
  params: CreateUnitMemberParams;
}

export interface IActionSaveMembersPayload extends IActionCallback {
  result: IPagination<IUnitMember>;
}

export interface IActionGetVehiclesPayload extends IActionCallback {
  unitId: string;
  page?: number;
  limit?: number;
}

export interface IActionSaveVehiclesPayload extends IActionCallback {
  result: IPagination<IUnitVehicle>;
}

export interface IActionAddVehiclePayload extends IActionCallback {
  unitId: string,
  params: CreateUnitVehicleParams
}

export interface IActionDeleteVehiclePayload extends IActionCallback {
  unitId: string;
  vehicleId: string;
}

export interface IActionGetPetsPayload extends IActionCallback {
  unitId: string;
  page?: number;
  limit?: number;
}

export interface IActionSavePetsPayload extends IActionCallback {
  result: IPagination<IUnitPet>;
}

export interface IActionAddPetPayload extends IActionCallback {
  unitId: string,
  params: CreateUnitPetParams
}

export interface IActionDeletePetPayload extends IActionCallback {
  unitId: string;
  petId: string;
}

export interface IActionLoadMoreMembersPayload extends IActionCallback {
  result: IPagination<IUnitMember>;
}

export interface IActionLoadMoreVehiclesPayload extends IActionCallback {
  result: IPagination<IUnitVehicle>;
}

export interface IActionLoadMorePetsPayload extends IActionCallback {
  result: IPagination<IUnitPet>;
}

export interface IActionDeleteMemberPayload extends IActionCallback {
  unitId: string;
  id: string;
}

export interface IActionUpdateMemberPayload extends IActionCallback {
  unitId: string;
  id: string;
  params: UpdateUnitMemberParams;
}

export interface IActionInvitationsPayload extends IActionCallback {
  unitId: string;
  params: IUnitMemberInvitation;
}

export interface IActionUnitListMePayload extends IActionCallback {
  page?: number;
  limit?: number;
  isSave?: boolean;
  query?: QueryParamUnit;
}

export interface IActionSaveUnitListMePayload extends IActionCallback {
  result: IPagination<IUnit>;
}

export interface IActionLoadMoreUnitListMePayload extends IActionCallback {
  result: IPagination<IUnit>;
}

// ACTION
export interface IActionGetMembers extends Action {
  type: ActionTypes.GET_MEMBERS;
  payload: IActionGetMembersPayload;
}

export interface IActionSaveMembers extends Action {
  type: ActionTypes.SAVE_MEMBERS;
  payload: IActionSaveMembersPayload;
}

export interface IActionGetVehicles extends Action {
  type: ActionTypes.GET_VEHICLES;
  payload: IActionGetVehiclesPayload;
}

export interface IActionAddVehicle extends Action {
  type: ActionTypes.ADD_VEHICLE;
  payload: IActionAddVehiclePayload;
}

export interface IActionRemoveVehicle extends Action {
  type: ActionTypes.REMOVE_VEHICLE;
  payload: IActionDeleteVehiclePayload;
}

export interface IActionSaveVehicles extends Action {
  type: ActionTypes.SAVE_VEHICLES;
  payload: IActionSaveVehiclesPayload;
}

export interface IActionGetPets extends Action {
  type: ActionTypes.GET_PETS;
  payload: IActionGetPetsPayload;
}

export interface IActionSavePets extends Action {
  type: ActionTypes.SAVE_PETS;
  payload: IActionSavePetsPayload;
}

export interface IActionAddPet extends Action {
  type: ActionTypes.ADD_PET;
  payload: IActionAddPetPayload;
}

export interface IActionRemovePet extends Action {
  type: ActionTypes.REMOVE_PET;
  payload: IActionDeletePetPayload;
}
export interface IActionLoadMoreMembers extends Action {
  type: ActionTypes.LOAD_MORE_MEMBERS;
  payload: IActionLoadMoreMembersPayload;
}

export interface IActionLoadMoreVehicles extends Action {
  type: ActionTypes.LOAD_MORE_VEHICLES;
  payload: IActionLoadMoreVehiclesPayload;
}

export interface IActionLoadMorePets extends Action {
  type: ActionTypes.LOAD_MORE_PETS;
  payload: IActionLoadMorePetsPayload;
}

export interface IActionDeleteMember extends Action {
  type: ActionTypes.DELETE_MEMBER;
  payload: IActionDeleteMemberPayload;
}

export interface IActionUpdateMember extends Action {
  type: ActionTypes.UPDATE_MEMBER;
  payload: IActionUpdateMemberPayload;
}

export interface IActionInvitations extends Action {
  type: ActionTypes.INVITATIONS;
  payload: IActionInvitationsPayload;
}

export interface IActionUnitListMe extends Action {
  type: ActionTypes.GET_LIST_UNIT_ME;
  payload: IActionUnitListMePayload;
}

export interface IActionSaveUnitListMe extends Action {
  type: ActionTypes.SAVE_LIST_UNIT_ME;
  payload: IActionSaveUnitListMePayload;
}

export interface IActionLoadMoreUnitListMe extends Action {
  type: ActionTypes.LOAD_MORE_UNIT_ME;
  payload: IActionLoadMoreUnitListMePayload;
}

export type IUnitAction =
  | IActionGetMembers
  | IActionSaveMembers
  | IActionGetVehicles
  | IActionSaveVehicles
  | IActionAddVehicle
  | IActionRemoveVehicle
  | IActionGetPets
  | IActionSavePets
  | IActionRemovePet
  | IActionAddPet
  | IActionResetAllState
  | IActionLoadMoreMembers
  | IActionLoadMoreVehicles
  | IActionLoadMorePets
  | IActionDeleteMember
  | IActionUpdateMember
  | IActionUnitListMe
  | IActionSaveUnitListMe
  | IActionLoadMoreUnitListMe;

export { action, unitSaga, unitReducer };
