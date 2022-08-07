import { Action } from 'redux';
import { IActionCallback } from '@src/models/callback';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompany, ICount, ICompanyUserInvitation, IPropertyType } from '@reup/reup-api-sdk/libs/api/company/models';
import { CreateCompanyParams, ResidentCountParams } from '@reup/reup-api-sdk/libs/api/company';
import * as actions from './actions';
import companySaga from '@modules/Company/saga';
import reducer from '@modules/Company/reducer';
import { IActionResetAllState } from '../auth';
import { ICompanyPosition } from '@reup/reup-api-sdk/libs/api/company/position/model';
import { ICompanyUser } from '@reup/reup-api-sdk/libs/api/company/user/models';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import {
  CreateCompanyPropertyParams,
  UpdateCompanyPropertyParams,
  QueryCompanyPropertyParams,
} from '@reup/reup-api-sdk/libs/api/company/property';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { QueryCompanyUnitParams, CreateCompanyUnitParams } from '@reup/reup-api-sdk/libs/api/company/unit';
import { ICompanyUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { IUnitMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';
import { QueryCompanyUserParams } from '@reup/reup-api-sdk/libs/api/company/user';
import { GetCompanyTenantParams } from '@reup/reup-api-sdk/libs/api/company/tenant';
import { ICompanyDocument } from '@reup/reup-api-sdk/libs/api/company/document/models';
import { QueryCompanyDocumentParams } from '@reup/reup-api-sdk/libs/api/company/document';
import { CreateCompanyBulletinBoardNotificationParams } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/notification';
import { CreateEventParams } from '@reup/reup-api-sdk/libs/api/calendar/event';
import {
  QueryCompanyPositionParams,
  CreateCompanyPositionParams,
  UpdateCompanyPositionParams,
} from '@reup/reup-api-sdk/libs/api/company/position';
import { IProperty } from '@reup/reup-api-sdk/src/api/company/property/model';
import { QueryResidentDocumentParams } from '@reup/reup-api-sdk/libs/api/resident/document';

// Action Types
export enum ActionTypes {
  GET_LIST_COMPANY = 'GET_LIST_COMPANY',
  SAVE_LIST_COMPANY = 'SAVE_LIST_COMPANY',
  CREATE_COMPANY = 'CREATE_COMPANY',
  GET_LIST_POSITION = 'GET_LIST_POSITION',
  SAVE_LIST_POSITION = 'SAVE_LIST_POSITION',
  CREATE_POSITION = 'CREATE_POSITION',
  UPDATE_POSITION = 'UPDATE_POSITION',
  DELETE_POSITION = 'DELETE_POSITION',
  GET_LIST_STAFF = 'GET_LIST_STAFF',
  SAVE_LIST_STAFF = 'SAVE_LIST_STAFF',
  COUNT_LIST_STAFF = 'COUNT_LIST_STAFF',
  SAVE_COUNT_LIST_STAFF = 'SAVE_COUNT_LIST_STAFF',
  COUNT_LIST_RESIDENT = 'COUNT_LIST_RESIDENT',
  SAVE_COUNT_LIST_RESIDENT = 'SAVE_COUNT_LIST_RESIDENT',
  LOAD_MORE_LIST_POSITION = 'LOAD_MORE_LIST_POSITION',
  LOAD_MORE_LIST_STAFF = 'LOAD_MORE_LIST_STAFF',
  GET_LIST_PROPERTY = 'GET_LIST_PROPERTY',
  SAVE_LIST_PROPERTTY = 'SAVE_LIST_PROPERTTY',
  LOAD_MORE_LIST_PROPERTY = 'LOAD_MORE_LIST_PROPERTY',
  CREATE_PROPERTY = 'CREATE_PROPERTY',
  DETAIL_PROPERTY = 'DETAIL_PROPERTY',
  UPDATE_PROPERTY = 'UPDATE_PROPERTY',
  DELETE_PROPERTY = 'DELETE_PROPERTY',
  GET_LIST_PROPERTY_TYPE = 'GET_LIST_PROPERTY_TYPE',
  SAVE_LIST_PROPERTY_TYPE = 'SAVE_LIST_PROPERTY_TYPE',
  GET_LIST_APARTMENT = 'GET_LIST_APARTMENT',
  SAVE_LIST_APARTMENT = 'SAVE_LIST_APARTMENT',
  LOAD_MORE_LIST_APARTMENT = 'LOAD_MORE_LIST_APARTMENT',
  DETAIL_APARTMENT = 'DETAIL_APARTMENT',
  CREATE_APARTMENT = 'CREATE_APARTMENT',
  INVITE_STAFF = 'INVITE_STAFF',
  GET_MY_COUNTRIES = 'GET_MY_COUNTRIES',
  SAVE_MY_COUNTRIES = 'SAVE_MY_COUNTRIES',
  REMOVE_STAFF = 'REMOVE_STAFF',
  GET_LIST_TENANT = 'GET_LIST_TENANT',
  SAVE_LIST_TENANT = 'SAVE_LIST_TENANT',
  LOAD_MORE_LIST_TENANT = 'LOAD_MORE_LIST_TENANT',
  TRANSFER_APARTMENT = 'TRANSFER_APARTMENT',
  REMOVE_TENANT = 'REMOVE_TENANT',
  GET_LIST_DOCUMENT = 'GET_LIST_DOCUMENT',
  SAVE_DOCUMENTS = 'SAVE_BUILDING_DOCUMENTS',
  LOAD_MORE_DOCUMENTS = 'LOAD_MORE_DOCUMENTS',
  GET_MY_PROPERTY = 'GET_MY_PROPERTY',
  SAVE_LIST_MY_PROPERTY = 'SAVE_LIST_MY_PROPERTY',
  GET_USER_PERMISSIONS = 'GET_USER_PERMISSIONS'
}

// Payload
export interface IActionGetListCompanyPayload extends IActionCallback {
  page?: number;
  limit?: number;
}
export interface IActionSaveListCompanyPayload extends IActionCallback {
  results: IPagination<ICompany>;
}
export interface IActionCreateCompanyPayload extends IActionCallback {
  params: CreateCompanyParams;
}

export interface IActionGetListPositionPayload extends IActionCallback {
  companyId: string;
  page?: number;
  limit?: number;
  params?: QueryCompanyPositionParams;
}

export interface IActionSaveListPositionPayload extends IActionCallback {
  results: IPagination<ICompanyPosition>;
}

export interface IActionLoadMoreListPositionPayload extends IActionCallback {
  results: IPagination<ICompanyPosition>;
}

export interface IActionCreatePositionPayload extends IActionCallback {
  companyId: string;
  params: CreateCompanyPositionParams;
}

export interface IActionUpdatePositionPayload extends IActionCallback {
  companyId: string;
  id: string;
  params: UpdateCompanyPositionParams;
}

export interface IActionDeletePositionPayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionGetListStaffPayload extends IActionCallback {
  id: string;
  page?: number;
  limit?: number;
  params?: QueryCompanyUserParams;
  isSave?: boolean;
}

export interface IActionCountStaffPayload extends IActionCallback {
  companyId: string;
  params?: ResidentCountParams;
  isSave?: boolean;
}

export interface IActionCountResidentPayload extends IActionCallback {
  companyId: string;
  params?: ResidentCountParams;
  isSave?: boolean;
}

export interface IActionSaveCountStaffPayload extends IActionCallback {
  count: ICount;
}

export interface IActionSaveCountResidentPayload extends IActionCallback {
  count: ICount;
}

export interface IActionSaveListStaffPayload extends IActionCallback {
  results: IPagination<ICompanyUser>;
}

export interface IActionLoadMoreListStaffPayload extends IActionCallback {
  results: IPagination<ICompanyUser>;
}

export interface IActionRemoveStaffPayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionGetListPropertyPayload extends IActionCallback {
  companyId: string;
  page?: number;
  limit?: number;
  params?: QueryCompanyPropertyParams;
  isSave?: boolean;
}

export interface IActionSaveListPropertyPayload extends IActionCallback {
  results: IPagination<ICompanyProperty>;
}

export interface IActionLoadMoreListPropertyPayload extends IActionCallback {
  results: IPagination<ICompanyProperty>;
}

export interface IActionCreatePropertyPayload extends IActionCallback {
  companyId: string;
  params: CreateCompanyPropertyParams;
}

export interface IActionDetailPropertyPayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionUpdatePropertyPayload extends IActionCallback {
  companyId: string;
  id: string;
  params: UpdateCompanyPropertyParams;
}

export interface IActionDeletePropertyPayload extends IActionCallback {
  companyId: string;
  id: string;
}

export type IActionGetListPropertyTypePayload = IActionCallback;

export interface IActionSavePropertyTypePayload extends IActionCallback {
  results: IPropertyType[];
}

export interface IActionGetListApartmentPayload extends IActionCallback {
  companyId: string;
  page?: number;
  limit?: number;
  q?: QueryCompanyUnitParams;
  isSave?: boolean;
}

export interface IActionSaveListApartmentPayload extends IActionCallback {
  results: IPagination<ICompanyUnit>;
}

export interface IActionLoadMoreListApartmentPayload extends IActionCallback {
  results: IPagination<ICompanyUnit>;
}

export interface IActionDetailApartmentPayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionCreateApartmentPayload extends IActionCallback {
  companyId: string;
  params: CreateCompanyUnitParams;
}

export interface IActionInviteStaffPayload extends IActionCallback {
  companyId: string;
  params: ICompanyUserInvitation;
}

export interface IActionGetMyListCountryPayload extends IActionCallback {
  companyId: string;
  page?: number;
  limit?: number;
}

export interface IActionSaveMyListCountryPayload extends IActionCallback {
  results: IPagination<ICountry>;
}

export interface IActionGetListTenantPayload extends IActionCallback {
  companyId: string;
  page?: number;
  limit?: number;
  params?: GetCompanyTenantParams;
  isSave?: boolean;
}

export interface IActionSaveListTenantPayload extends IActionCallback {
  results: IPagination<IUnitMember>;
}

export interface IActionLoadMoreListTenantPayload extends IActionCallback {
  results: IPagination<IUnitMember>;
}

export interface IActionTransferApartmentPayload extends IActionCallback {
  companyId: string;
  unitFromId: string;
  unitToId: string;
}

export interface IActionGetListDocumentPayload extends IActionCallback {
  id: string;
  page?: number;
  limit?: number;
  params?: QueryCompanyDocumentParams & QueryResidentDocumentParams;
}

export interface IActionSaveDocumentsPayload extends IActionCallback {
  result: IPagination<ICompanyDocument>;
}

export interface IActionLoadMoreDocumentsPayload extends IActionCallback {
  result: IPagination<ICompanyDocument>;
}

export interface IActionRemoveTenantPayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionGetListMyPropertyPayload extends IActionCallback {
  page?: number;
  limit?: number;
  isSave?: boolean;
}

export interface IActionSaveListMyPropertyPayload extends IActionCallback {
  results: IPagination<IProperty>
}

export interface IActionGetUserPermissionsPayload extends IActionCallback {
  companyId: string;
}

// Actions
export interface IActionGetListCompany extends Action {
  type: ActionTypes.GET_LIST_COMPANY;
  payload: IActionGetListCompanyPayload;
}
export interface IActionSaveListCompany extends Action {
  type: ActionTypes.SAVE_LIST_COMPANY;
  payload: IActionSaveListCompanyPayload;
}
export interface IActionCreateCompany extends Action {
  type: ActionTypes.CREATE_COMPANY;
  payload: IActionCreateCompanyPayload;
}
export interface IActionGetListPosition extends Action {
  type: ActionTypes.GET_LIST_POSITION;
  payload: IActionGetListPositionPayload;
}
export interface IActionSaveListPosition extends Action {
  type: ActionTypes.SAVE_LIST_POSITION;
  payload: IActionSaveListPositionPayload;
}

export interface IActionLoadMoreListPosition extends Action {
  type: ActionTypes.LOAD_MORE_LIST_POSITION;
  payload: IActionLoadMoreListPositionPayload;
}

export interface IActionCreatePosition extends Action {
  type: ActionTypes.CREATE_POSITION;
  payload: IActionCreatePositionPayload;
}

export interface IActionUpdatePosition extends Action {
  type: ActionTypes.UPDATE_POSITION;
  payload: IActionUpdatePositionPayload;
}

export interface IActionDeletePosition extends Action {
  type: ActionTypes.DELETE_POSITION;
  payload: IActionDeletePositionPayload;
}

export interface IActionGetListStaff extends Action {
  type: ActionTypes.GET_LIST_STAFF;
  payload: IActionGetListStaffPayload;
}

export interface IActionCountStaff extends Action {
  type: ActionTypes.COUNT_LIST_STAFF;
  payload: IActionCountStaffPayload;
}

export interface IActionCountResident extends Action {
  type: ActionTypes.COUNT_LIST_RESIDENT;
  payload: IActionCountResidentPayload;
}

export interface IActionSaveCountStaff extends Action {
  type: ActionTypes.SAVE_COUNT_LIST_STAFF;
  payload: IActionSaveCountStaffPayload;
}

export interface IActionSaveCountResident extends Action {
  type: ActionTypes.SAVE_COUNT_LIST_RESIDENT;
  payload: IActionSaveCountResidentPayload;
}

export interface IActionSaveListStaff extends Action {
  type: ActionTypes.SAVE_LIST_STAFF;
  payload: IActionSaveListStaffPayload;
}

export interface IActionLoadMoreListStaff extends Action {
  type: ActionTypes.LOAD_MORE_LIST_STAFF;
  payload: IActionLoadMoreListStaffPayload;
}

export interface IActionRemoveStaff extends Action {
  type: ActionTypes.REMOVE_STAFF;
  payload: IActionRemoveStaffPayload;
}

export interface IActionGetListProperty extends Action {
  type: ActionTypes.GET_LIST_PROPERTY;
  payload: IActionGetListPropertyPayload;
}

export interface IActionSaveListProperty extends Action {
  type: ActionTypes.SAVE_LIST_PROPERTTY;
  payload: IActionSaveListPropertyPayload;
}

export interface IActionLoadMoreListProperty extends Action {
  type: ActionTypes.LOAD_MORE_LIST_PROPERTY;
  payload: IActionLoadMoreListPropertyPayload;
}

export interface IActionCreateProperty extends Action {
  type: ActionTypes.CREATE_PROPERTY;
  payload: IActionCreatePropertyPayload;
}

export interface IActionDetailProperty extends Action {
  type: ActionTypes.DETAIL_PROPERTY;
  payload: IActionDetailPropertyPayload;
}

export interface IActionUpdateProperty extends Action {
  type: ActionTypes.UPDATE_PROPERTY;
  payload: IActionUpdatePropertyPayload;
}

export interface IActionDeleteProperty extends Action {
  type: ActionTypes.DELETE_PROPERTY;
  payload: IActionDeletePropertyPayload;
}

export interface IActionGetListPropertyType extends Action {
  type: ActionTypes.GET_LIST_PROPERTY_TYPE;
  payload: IActionGetListPropertyTypePayload;
}

export interface IActionSaveListPropertyType extends Action {
  type: ActionTypes.SAVE_LIST_PROPERTY_TYPE;
  payload: IActionSavePropertyTypePayload;
}
export interface IActionInviteStaff extends Action {
  type: ActionTypes.INVITE_STAFF;
  payload: IActionInviteStaffPayload;
}

export interface IActionGetMyListCountry extends Action {
  type: ActionTypes.GET_MY_COUNTRIES;
  payload: IActionGetMyListCountryPayload;
}

export interface IActionSaveMyListCountry extends Action {
  type: ActionTypes.SAVE_MY_COUNTRIES;
  payload: IActionSaveMyListCountryPayload;
}

export interface IActionGetListApartment extends Action {
  type: ActionTypes.GET_LIST_APARTMENT;
  payload: IActionGetListApartmentPayload;
}

export interface IActionSaveListApartment extends Action {
  type: ActionTypes.SAVE_LIST_APARTMENT;
  payload: IActionSaveListApartmentPayload;
}

export interface IActionLoadMoreListApartment extends Action {
  type: ActionTypes.LOAD_MORE_LIST_APARTMENT;
  payload: IActionLoadMoreListApartmentPayload;
}

export interface IActionDetailApartment extends Action {
  type: ActionTypes.DETAIL_APARTMENT;
  payload: IActionDetailApartmentPayload;
}

export interface IActionCreateApartment extends Action {
  type: ActionTypes.CREATE_APARTMENT;
  payload: IActionCreateApartmentPayload;
}

export interface IActionGetListTenant extends Action {
  type: ActionTypes.GET_LIST_TENANT;
  payload: IActionGetListTenantPayload;
}

export interface IActionSaveListTenant extends Action {
  type: ActionTypes.SAVE_LIST_TENANT;
  payload: IActionSaveListTenantPayload;
}

export interface IActionLoadMoreListTenant extends Action {
  type: ActionTypes.LOAD_MORE_LIST_TENANT;
  payload: IActionLoadMoreListTenantPayload;
}

export interface IActionTransferApartment extends Action {
  type: ActionTypes.TRANSFER_APARTMENT;
  payload: IActionTransferApartmentPayload;
}

export interface IActionRemoveTenant extends Action {
  type: ActionTypes.REMOVE_TENANT;
  payload: IActionRemoveTenantPayload;
}

export interface IActionGetListDocument extends Action {
  type: ActionTypes.GET_LIST_DOCUMENT;
  payload: IActionGetListDocumentPayload;
}

export interface IActionSaveDocuments extends Action {
  type: ActionTypes.SAVE_DOCUMENTS;
  payload: IActionSaveDocumentsPayload;
}

export interface IActionLoadMoreDocuments extends Action {
  type: ActionTypes.LOAD_MORE_DOCUMENTS;
  payload: IActionLoadMoreDocumentsPayload;
}

export interface IActionGetListMyProperty extends Action {
  type: ActionTypes.GET_MY_PROPERTY;
  payload: IActionGetListMyPropertyPayload;
}

export interface IActionSaveListMyProperty extends Action {
  type: ActionTypes.SAVE_LIST_MY_PROPERTY;
  payload: IActionSaveListMyPropertyPayload;
}

export interface IActionGetUserPermissions extends Action {
  type: ActionTypes.GET_USER_PERMISSIONS;
  payload: IActionGetUserPermissionsPayload;
}

export type ICompanyAction =
  | IActionGetListCompany
  | IActionSaveListCompany
  | IActionCreateCompany
  | IActionResetAllState
  | IActionGetListPosition
  | IActionSaveListPosition
  | IActionCreatePosition
  | IActionUpdatePosition
  | IActionDeletePosition
  | IActionGetListStaff
  | IActionSaveListStaff
  | IActionCountStaff
  | IActionSaveCountStaff
  | IActionCountResident
  | IActionSaveCountResident
  | IActionLoadMoreListPosition
  | IActionLoadMoreListStaff
  | IActionGetListProperty
  | IActionSaveListProperty
  | IActionLoadMoreListProperty
  | IActionDetailProperty
  | IActionUpdateProperty
  | IActionDeleteProperty
  | IActionGetListPropertyType
  | IActionSaveListPropertyType
  | IActionGetListApartment
  | IActionSaveListApartment
  | IActionLoadMoreListApartment
  | IActionInviteStaff
  | IActionGetMyListCountry
  | IActionSaveMyListCountry
  | IActionCreateApartment
  | IActionRemoveStaff
  | IActionGetListTenant
  | IActionSaveListTenant
  | IActionLoadMoreListTenant
  | IActionTransferApartment
  | IActionRemoveTenant
  | IActionRemoveTenant
  | IActionGetListDocument
  | IActionSaveDocuments
  | IActionLoadMoreDocuments
  | IActionGetListMyProperty
  | IActionSaveListMyProperty
  | IActionGetUserPermissions;

export { actions, reducer, companySaga };
