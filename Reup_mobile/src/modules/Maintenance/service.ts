import { ApiClient, api } from '@reup/reup-api-sdk';

import { CreateCompanyMaintenanceRecurringTaslParams } from '@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task';
import { CreateCategoryParams } from '@reup/reup-api-sdk/libs/api/company/maintenance/category';
import {
  QueryCompanyMaintenanceRecurringTaslParams,
  UpdateCompanyMaintenanceRecurringTaslParams,
} from '@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task';

import {
  QueryMaintenanceRequestParams,
  QueryMaintenanceRequestGeneralParams,
  ChangeStatusMaintenanceRequest,
  CreateMaintenanceRequest, UpdateMaintenanceRequest
} from '@reup/reup-api-sdk/libs/api/maintenance/request';
import { ResidentQueryMaintenanceRequestGeneralParams, ResidentQueryMaintenanceRequestParams } from '@reup/reup-api-sdk/libs/api/resident/maintenance';
import { isManagerApp } from '@src/utils';

export const wait = (time: number) => new Promise(rs => setTimeout(rs, time));

export const getListMaintenanceRequest: any = async (companyId: string, page: number, limit?: number, q?: QueryMaintenanceRequestParams) => {
  try {
    const response = await api.Maintenance.Request.list(companyId, page, limit, q);
    return { value: response, error: null };
  } catch (error) {
    console.log('Error getListMaintenanceRequest: ', error);
    return { value: null, error };
  }
};
export const getListResidentRequest: any = async (property_id: string, page: number, limit?: number, q?: ResidentQueryMaintenanceRequestParams) => {
  try {
    const response = await api.Resident.ResidentRequest.list(property_id, page, limit, q);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const createTaskRequest: any = async (companyId: string, params: CreateCompanyMaintenanceRecurringTaslParams) => {
  try {
    const response = await api.Company.Maintenance.RecurringTask.create(companyId, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListMaintenanceCategory: any = async (companyId: string, page?: number, limit?: number, params?: any) => {
  try {
    const response = await api.Company.Maintenance.Category.list(companyId, page ? page : 1, limit ? limit : 20, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const getListResidentCategory: any = async (propertyId: string, page: number, limit?: number) => {
  try {
    const response = await api.Resident.ResidentCategory.list(propertyId, page, limit);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const getGeneral: any = async (companyId: string, q?: QueryMaintenanceRequestGeneralParams) => {
  try {
    const response = await api.Maintenance.Request.general(companyId, q);
    return { value: response, error: null };
  } catch (error) {
    console.log('Error getGeneral: ', error);
    return { value: null, error };
  }
};

export const getResidentRequestGeneral: any = async (property_id: string, q?: ResidentQueryMaintenanceRequestGeneralParams) => {
  try {
    const response = await api.Resident.ResidentRequest.general(property_id, q);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const createMaintenanceCategory: any = async (companyId: string, params: CreateCategoryParams) => {
  try {
    const response = await api.Company.Maintenance.Category.create(companyId, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const updateMaintenanceCategory: any = async (companyId: string, id: string, params: CreateCategoryParams) => {
  try {
    const response = await api.Company.Maintenance.Category.update(companyId, id, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const getListRecurringTask: any = async (
  companyId: string,
  page?: number,
  limit?: number,
  params?: QueryCompanyMaintenanceRecurringTaslParams,
) => {
  try {
    const response = await api.Company.Maintenance.RecurringTask.list(companyId, page, limit, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const deleteMaintenanceCategory: any = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.Maintenance.Category.remove(companyId, id);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const updateRecurringTask: any = async (companyId: string, id: string, params: UpdateCompanyMaintenanceRecurringTaslParams) => {
  try {
    const response = await api.Company.Maintenance.RecurringTask.update(companyId, id, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const deleteRequest: any = async (companyId: string, id: string) => {
  try {
    const response = await api.Maintenance.Request.remove(companyId, id);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const changeStatusRequest: any = async (companyId: string, propertyId: string, id: string, params: ChangeStatusMaintenanceRequest) => {
  try {
    const response = isManagerApp() ? await api.Maintenance.Request.changeStatus(companyId, id, params)
      : await api.Resident.ResidentRequest.changeStatus(propertyId, id, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const createRequest: any = async (companyId: string, params: CreateMaintenanceRequest) => {
  try {
    const response = await api.Maintenance.Request.create(companyId, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const createResidentRequest: any = async (propertyId: string, params: CreateMaintenanceRequest) => {
  try {
    const response = await api.Resident.ResidentRequest.create(propertyId, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const assigneeMaintenanceRequest: any = async (companyId: string, id: string, params: UpdateMaintenanceRequest) => {
  try {
    const response = await api.Maintenance.Request.update(companyId, id, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};
