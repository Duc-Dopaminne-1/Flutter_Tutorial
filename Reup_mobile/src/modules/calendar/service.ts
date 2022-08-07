import { isTenantApp } from '@src/utils';
import { api } from '@reup/reup-api-sdk';
import {
  IQueryEventRequest,
  CreateEventParams,
  UpdateEventParams,
  ChangEventStatusRequest,
} from '@reup/reup-api-sdk/libs/api/calendar/event';
import { IQueryResidentEventRequest } from '@reup/reup-api-sdk/libs/api/resident/calendar';

export const getListEvent: any = async (
  page: number,
  limit?: number,
  q?: IQueryEventRequest | IQueryResidentEventRequest,
  propertyId?: string,
) => {
  try {
    const response = isTenantApp()
      ? await api.Resident.ResidentEvent.list(propertyId ?? '', page, limit, q)
      : await api.Calendar.Event.list(page, limit, q);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const createEvent: any = async (params: CreateEventParams) => {
  try {
    const response = await api.Calendar.Event.create(params);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const detailEvent: any = async (id: string) => {
  try {
    const response = await api.Calendar.Event.detail(id);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const updateEvent: any = async (id: string, params: UpdateEventParams) => {
  try {
    const response = await api.Calendar.Event.update(id, params);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const removeEvent: any = async (id: string) => {
  try {
    const response = await api.Calendar.Event.remove(id);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const changeStatusEvent: any = async (id: string, params: ChangEventStatusRequest) => {
  try {
    const response = await api.Calendar.Event.changeStatus(id, params);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const getListEventTenant: any = async (propertyId: string, page: number, limit?: number, q?: IQueryResidentEventRequest) => {
  try {
    const response = await api.Resident.ResidentEvent.list(propertyId, page, limit, q);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const createEventTenant: any = async (propertyId: string, params: CreateEventParams) => {
  try {
    const response = await api.Resident.ResidentEvent.create(propertyId, params);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};
