import { QueryVisitorRequest, CheckInOutData, CreateVisitorData } from '@reup/reup-api-sdk/libs/api/frontdesk/visitor';
import { api } from '@reup/reup-api-sdk';
import { CreateFacilityParams, UpdateFacilityParams, QueryFacilityParams } from '@reup/reup-api-sdk/libs/api/company/facility';
import { QueryDeliveryRequest, CreateDeliveryData } from '@reup/reup-api-sdk/libs/api/frontdesk/delivery';
import { SearchParam, ResidentQueryVisitorParams } from '@reup/reup-api-sdk/libs/api/resident/frontdesk';
import { isTenantApp, isManagerApp } from '@src/utils';
import { ResidentQueryDeliveryParams } from '@reup/reup-api-sdk/libs/api/resident/frontdesk';
import { LimitLoadMore } from '@src/constants/vars';

export const wait = (time: number) => new Promise(rs => setTimeout(rs, time));

export const getListFacilities = async (id: string, page?: number, limit?: number, params?: QueryFacilityParams | SearchParam) => {
  try {
    const response = isManagerApp()
      ? await api.Company.Facility.list(id, page, limit, params)
      : await api.Resident.ResidentFacility.list(id, page ? page : 1, limit, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const createFacility = async (companyId: string, params: CreateFacilityParams) => {
  try {
    const response = await api.Company.Facility.create(companyId, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const deleteFacility = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.Facility.remove(companyId, id);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const updateFacility = async (companyId: string, id: string, params: UpdateFacilityParams) => {
  try {
    const response = await api.Company.Facility.update(companyId, id, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListVisitor: any = async (
  id: string,
  page?: number,
  limit?: number,
  params?: QueryVisitorRequest | ResidentQueryVisitorParams,
) => {
  try {
    const response = isManagerApp()
      ? await api.FrontDesk.Visitor.list(id, page ? page : 1, limit ? limit : LimitLoadMore, params)
      : await api.Resident.ResidentVisitor.list(id, page ? page : 1, limit ? limit : LimitLoadMore, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const checkInOut: any = async (companyId: string, id: string, params: CheckInOutData) => {
  try {
    const response = await api.FrontDesk.Visitor.checkInOut(companyId, id, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const createVisitor: any = async (id: string, params: CreateVisitorData) => {
  try {
    const response = isManagerApp()
      ? await api.FrontDesk.Visitor.create(id, params)
      : await api.Resident.ResidentVisitor.create(id, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const getListDelivery: any = async (
  id: string,
  page?: number,
  limit?: number,
  params?: QueryDeliveryRequest | ResidentQueryDeliveryParams,
) => {
  try {
    const response = isTenantApp()
      ? await api.Resident.ResidentDelivery.list(id, page, limit, params)
      : await api.FrontDesk.Delivery.list(id, page, limit, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const checkShippedDelivery = async (from: string, to: string) => {
  try {
    const response = isTenantApp() ? await api.Resident.ResidentDelivery.receive(to, from) : await api.FrontDesk.Delivery.ship(from, to);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const createDelivery = async (companyId: string, params: CreateDeliveryData) => {
  try {
    const response = await api.FrontDesk.Delivery.create(companyId, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};
