import * as actions from './actions';
import { Action } from 'redux';
import maintenanceSaga from '@modules/Maintenance/saga';
import reducer from '@modules/Maintenance/reducer';
import { IActionCallback, IError } from '@src/models/callback';
import { ICompanyMaintenanceCategory } from '@reup/reup-api-sdk/libs/api/company/maintenance/category/models';
import { CreateCategoryParams } from '@reup/reup-api-sdk/libs/api/company/maintenance/category';
import { QueryMaintenanceRequestParams, QueryMaintenanceRequestGeneralParams, ChangeStatusMaintenanceRequest, CreateMaintenanceRequest, UpdateMaintenanceRequest } from '@reup/reup-api-sdk/libs/api/maintenance/request';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import {
  QueryCompanyMaintenanceRecurringTaslParams,
  UpdateCompanyMaintenanceRecurringTaslParams,
  CreateCompanyMaintenanceRecurringTaslParams,
} from '@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task';
import { ICompanyMaintenanceRecurringTask } from '@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task/models';
import { IRequest, IGeneralRequestStatus } from '@reup/reup-api-sdk/libs/api/maintenance/request/model';
import { StatusMaintenanceRequest } from '@reup/reup-api-sdk/libs/api/enum';
import { IActionResetAllState } from '../auth';
import { ResidentQueryMaintenanceRequestGeneralParams, ResidentQueryMaintenanceRequestParams } from '@reup/reup-api-sdk/libs/api/resident/maintenance';

// Action Types
export enum ActionTypes {
  GET_LIST_MAINTENANCE_REQUEST = 'GET_LIST_MAINTENANCE_REQUEST',
  GET_LIST_RESIDENT_REQUEST = 'GET_LIST_RESIDENT_REQUEST',
  GET_LIST_MAINTENANCE_CATEGORY = 'GET_LIST_MAINTENANCE_CATEGORY',
  SAVE_LIST_MAINTENANCE_CATEGORY = 'SAVE_LIST_MAINTENANCE_CATEGORY',
  LOAD_MORE_MAINTENANCE_CATEGORY = 'LOAD_MORE_MAINTENANCE_CATEGORY',
  CREATE_MAINTENANCE_CATEGORY = 'CREATE_MAINTENANCE_CATEGORY',
  GET_LIST_STATUS_MAINTENANCE_REQUEST = 'GET_LIST_STATUS_MAINTENANCE_REQUEST',
  GET_LIST_STATUS_RESIDENT_REQUEST = 'GET_LIST_STATUS_RESIDENT_REQUEST',
  SAVE_LIST_MAINTENANCE_REQUEST = 'SAVE_LIST_MAINTENANCE_REQUEST',
  SAVE_LIST_STATUS_MAINTENANCE_REQUEST = 'SAVE_LIST_STATUS_MAINTENANCE_REQUEST',
  RESET_LIST_STATUS_MAINTENANCE_REQUEST = 'RESET_LIST_STATUS_MAINTENANCE_REQUEST',
  LOAD_MORE_LIST_MAINTENANCE_REQUEST = 'LOAD_MORE_LIST_MAINTENANCE_REQUEST',
  LOAD_MORE_LIST_STATUS_MAINTENANCE_REQUEST = 'LOAD_MORE_LIST_STATUS_MAINTENANCE_REQUEST',
  CREATE_TASK = 'CREATE_TASK',
  GET_GENERAL = 'GET_GENERAL',
  GET_RESIDENT_GENERAL = 'GET_RESIDENT_GENERAL',
  SAVE_GENERAL = 'SAVE_GENERAL',
  UPDATE_MAINTENANCE_CATEGORY = 'UPDATE_MAINTENANCE_CATEGORY',
  GET_LIST_RECURRING_TASK = 'GET_LIST_RECURRING_TASK',
  SAVE_RECURRING_TASKS = 'SAVE_RECURRING_TASKS',
  LOAD_MORE_RECURRING_TASKS = 'LOAD_MORE_RECURRING_TASKS',
  DELETE_MAINTENANCE_CATEGORY = 'DELETE_MAINTENANCE_CATEGORY',
  UPDATE_RECURRING_TASK = 'UPDATE_RECURRING_TASK',
  SAVE_STATUS = 'SAVE_STATUS',
  DELETE_REQUEST = 'DELETE_REQUEST',
  CHANGE_STATUS_REQUEST = 'CHANGE_STATUS_REQUEST',
  CREATE_REQUEST = 'CREATE_REQUEST',
  GET_LIST_RESIDENT_CATEGORY = 'GET_LIST_RESIDENT_CATEGORY',
  CREATE_RESIDENT_REQUEST = 'CREATE_RESIDENT_REQUEST',
  ASSIGNEE_MAINTENANCE_REQUEST = 'ASSIGNEE_MAINTENANCE_REQUEST'
}

// Payload
export interface IActionGetListMaintenanceRequestPayload extends IActionCallback {
  companyId: string;
  page: number;
  limit?: number;
  q?: QueryMaintenanceRequestParams;
}

export interface IActionGetListResidentRequestPayload extends IActionCallback {
  property_id?: string;
  page: number;
  limit?: number;
  q?: ResidentQueryMaintenanceRequestParams;
}

export interface IActionGetListMaintenanceCategoryPayload extends IActionCallback {
  companyId: string;
  page?: number;
  limit?: number;
  params?: any;
  isSave?: boolean;
}

export interface IActionGetListResidentCategoryPayload extends IActionCallback {
  propertyId: string;
  page?: number;
  limit?: number;
  isSave?: boolean;
}

export interface IActionSaveListMaintenanceCategoryPayload extends IActionCallback {
  results: IPagination<ICompanyMaintenanceCategory>;
}

export interface IActionLoadMoreListMaintenanceCategoryPayload extends IActionCallback {
  results: IPagination<ICompanyMaintenanceCategory>;
}

export interface IActionCreateMaintenanceCategoryPayload extends IActionCallback {
  companyId: string;
  params: CreateCategoryParams;
  page?: number;
  limit?: number;
}

export interface IActionGetListStatusMaintenanceRequestPayload extends IActionCallback {
  companyId: string;
  page: number;
  limit?: number;
  q?: QueryMaintenanceRequestParams;
}

export interface IActionGetListStatusResidentRequestPayload extends IActionCallback {
  property_id?: string;
  page: number;
  limit?: number;
  q?: ResidentQueryMaintenanceRequestParams;
}

export interface IActionSaveListMaintenanceRequestPayload extends IActionCallback {
  results: IPagination<IRequest>;
}

export interface IActionSaveListStatusMaintenanceRequestPayload extends IActionCallback {
  results: IPagination<IRequest>;
}

export interface IActionResetListStatusMaintenanceRequestPayload extends IActionCallback {
  results: IPagination<IRequest>;
}

export interface IActionLoadMoreListMaintenanceRequestPayload extends IActionCallback {
  results: IPagination<IRequest>;
}

export interface IActionLoadMoreListStatusMaintenanceRequestPayload extends IActionCallback {
  results: IPagination<IRequest>;
}

export interface IActionCreateTaskPayload extends IActionCallback {
  companyId: string;
  params: CreateCompanyMaintenanceRecurringTaslParams;
}

export interface IActionGetListRecurringTaskPayload extends IActionCallback {
  companyId: string;
  page?: number;
  limit?: number;
  params?: QueryCompanyMaintenanceRecurringTaslParams;
}

export interface IActionSaveRecurringTasksPayload extends IActionCallback {
  results: IPagination<ICompanyMaintenanceRecurringTask>;
}

export interface IActionLoadMoreRecurringTasksPayload extends IActionCallback {
  results: IPagination<ICompanyMaintenanceRecurringTask>;
}

export interface IActionGetGeneralPayload extends IActionCallback {
  companyId: string;
  params?: QueryMaintenanceRequestGeneralParams;
}

export interface IActionGetResidentRequestGeneralPayload extends IActionCallback {
  property_id?: string;
  params?: ResidentQueryMaintenanceRequestGeneralParams;
}

export interface IActionSaveGeneralPayload extends IActionCallback {
  results: IGeneralRequestStatus;
}

export interface IActionUpdateMaintenanceCategoryPayload extends IActionCallback {
  companyId: string;
  id: string;
  params: CreateCategoryParams;
}

export interface IActionDeleteMaintenanceCategoryPayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionUpdateRecurringTaskPayload extends IActionCallback {
  companyId: string;
  id: string;
  params: UpdateCompanyMaintenanceRecurringTaslParams;
}

export interface IActionSaveStatusPayload extends IActionCallback {
  results?: StatusMaintenanceRequest | null | undefined;
}

export interface IActionDeleteRequestPayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionChangeStatusRequestPayload extends IActionCallback {
  companyId?: string;
  propertyId?: string,
  id: string;
  params: ChangeStatusMaintenanceRequest;
}

export interface IActionCreateRequestPayload extends IActionCallback {
  companyId: string;
  params: CreateMaintenanceRequest;
}

export interface IActionResidentRequestPayload extends IActionCallback {
  propertyId: string;
  params: CreateMaintenanceRequest;
}

export interface IActionAssigneeMaintenanceRequestPayload extends IActionCallback {
  companyId: string;
  id: string;
  params: UpdateMaintenanceRequest;
}

// Actions
export interface IActionGetListMaintenanceRequest extends Action {
  type: ActionTypes.GET_LIST_MAINTENANCE_REQUEST;
  payload: IActionGetListMaintenanceRequestPayload;
}
export interface IActionGetListResidentRequest extends Action {
  type: ActionTypes.GET_LIST_RESIDENT_REQUEST;
  payload: IActionGetListResidentRequestPayload;
}

export interface IActionGetListMaintenanceCategory extends Action {
  type: ActionTypes.GET_LIST_MAINTENANCE_CATEGORY;
  payload: IActionGetListMaintenanceCategoryPayload;
}

export interface IActionGetListResidentCategory extends Action {
  type: ActionTypes.GET_LIST_RESIDENT_CATEGORY;
  payload: IActionGetListResidentCategoryPayload;
}
export interface IActionSaveListMaintenanceCategory extends Action {
  type: ActionTypes.SAVE_LIST_MAINTENANCE_CATEGORY;
  payload: IActionSaveListMaintenanceCategoryPayload;
}

export interface IActionLoadMoreListMaintenanceCategory extends Action {
  type: ActionTypes.LOAD_MORE_MAINTENANCE_CATEGORY;
  payload: IActionLoadMoreListMaintenanceCategoryPayload;
}

export interface IActionCreateMaintenanceCategory extends Action {
  type: ActionTypes.CREATE_MAINTENANCE_CATEGORY;
  payload: IActionCreateMaintenanceCategoryPayload;
}
export interface IActionGetListStatusMaintenanceRequest extends Action {
  type: ActionTypes.GET_LIST_STATUS_MAINTENANCE_REQUEST;
  payload: IActionGetListStatusMaintenanceRequestPayload;
}

export interface IActionGetListStatusResidentRequest extends Action {
  type: ActionTypes.GET_LIST_STATUS_RESIDENT_REQUEST;
  payload: IActionGetListStatusResidentRequestPayload;
}

export interface IActionSaveListMaintenanceRequest extends Action {
  type: ActionTypes.SAVE_LIST_MAINTENANCE_REQUEST;
  payload: IActionSaveListMaintenanceRequestPayload;
}

export interface IActionSaveListStatusMaintenanceRequest extends Action {
  type: ActionTypes.SAVE_LIST_STATUS_MAINTENANCE_REQUEST;
  payload: IActionSaveListStatusMaintenanceRequestPayload;
}

export interface IActionResetListStatusMaintenanceRequest extends Action {
  type: ActionTypes.RESET_LIST_STATUS_MAINTENANCE_REQUEST;
  payload: IActionResetListStatusMaintenanceRequestPayload;
}

export interface IActionLoadMoreListMaintenanceRequest extends Action {
  type: ActionTypes.LOAD_MORE_LIST_MAINTENANCE_REQUEST;
  payload: IActionLoadMoreListMaintenanceRequestPayload;
}

export interface IActionLoadMoreListStatusMaintenanceRequest extends Action {
  type: ActionTypes.LOAD_MORE_LIST_STATUS_MAINTENANCE_REQUEST;
  payload: IActionLoadMoreListStatusMaintenanceRequestPayload;
}
export interface IActionGetGeneral extends Action {
  type: ActionTypes.GET_GENERAL;
  payload: IActionGetGeneralPayload;
}

export interface IActionGetResidentRequestGeneral extends Action {
  type: ActionTypes.GET_RESIDENT_GENERAL;
  payload: IActionGetResidentRequestGeneralPayload;
}

export interface IActionSaveGeneral extends Action {
  type: ActionTypes.SAVE_GENERAL;
  payload: IActionSaveGeneralPayload;
}

export interface IActionUpdateMaintenanceCategory extends Action {
  type: ActionTypes.UPDATE_MAINTENANCE_CATEGORY;
  payload: IActionUpdateMaintenanceCategoryPayload;
}
export interface IActionGetListRecurringTask extends Action {
  type: ActionTypes.GET_LIST_RECURRING_TASK;
  payload: IActionGetListRecurringTaskPayload;
}

export interface IActionSaveRecurringTasks extends Action {
  type: ActionTypes.SAVE_RECURRING_TASKS;
  payload: IActionSaveRecurringTasksPayload;
}

export interface IActionLoadMoreRecurringTasks extends Action {
  type: ActionTypes.LOAD_MORE_RECURRING_TASKS;
  payload: IActionLoadMoreRecurringTasksPayload;
}

export interface IActionDeleteMaintenanceCategory extends Action {
  type: ActionTypes.DELETE_MAINTENANCE_CATEGORY;
  payload: IActionDeleteMaintenanceCategoryPayload;
}

export interface IActionUpdateRecurringTask extends Action {
  type: ActionTypes.UPDATE_RECURRING_TASK;
  payload: IActionUpdateRecurringTaskPayload;
}

export interface IActionCreateTask extends Action {
  type: ActionTypes.CREATE_TASK;
  payload: IActionCreateTaskPayload;
}

export interface IActionSaveStatus extends Action {
  type: ActionTypes.SAVE_STATUS;
  payload: IActionSaveStatusPayload;
}

export interface IActionDeleteRequest extends Action {
  type: ActionTypes.DELETE_REQUEST;
  payload: IActionDeleteRequestPayload;
}

export interface IActionChangeStatusRequest extends Action {
  type: ActionTypes.CHANGE_STATUS_REQUEST;
  payload: IActionChangeStatusRequestPayload;
}

export interface IActionCreateRequest extends Action {
  type: ActionTypes.CREATE_REQUEST;
  payload: IActionCreateRequestPayload;
}

export interface IActionCreateResidentRequest extends Action {
  type: ActionTypes.CREATE_RESIDENT_REQUEST;
  payload: IActionResidentRequestPayload;
}

export interface IActionAssigneeMaintenanceRequest extends Action {
  type: ActionTypes.ASSIGNEE_MAINTENANCE_REQUEST;
  payload: IActionAssigneeMaintenanceRequestPayload;
}

export type IMaintenanceAction =
  | IActionGetListMaintenanceCategory
  | IActionSaveListMaintenanceCategory
  | IActionLoadMoreListMaintenanceCategory
  | IActionCreateMaintenanceCategory
  | IActionGetListMaintenanceRequest
  | IActionGetListStatusMaintenanceRequest
  | IActionSaveListMaintenanceRequest
  | IActionSaveListStatusMaintenanceRequest
  | IActionResetListStatusMaintenanceRequest
  | IActionLoadMoreListMaintenanceRequest
  | IActionLoadMoreListStatusMaintenanceRequest
  | IActionCreateTask
  | IActionGetGeneral
  | IActionSaveGeneral
  | IActionUpdateMaintenanceCategory
  | IActionGetListRecurringTask
  | IActionSaveRecurringTasks
  | IActionLoadMoreRecurringTasks
  | IActionDeleteMaintenanceCategory
  | IActionUpdateRecurringTask
  | IActionSaveStatus
  | IActionDeleteRequest
  | IActionChangeStatusRequest
  | IActionCreateRequest
  | IActionResetAllState
  | IActionGetResidentRequestGeneral
  | IActionGetListResidentRequest
  | IActionGetListStatusResidentRequest
  | IActionGetListResidentCategory
  | IActionCreateResidentRequest
  | IActionAssigneeMaintenanceRequest;

export { actions, reducer, maintenanceSaga };
