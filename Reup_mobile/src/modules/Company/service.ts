import { api } from '@reup/reup-api-sdk';
import { CreateCompanyParams, ResidentCountParams } from '@reup/reup-api-sdk/libs/api/company';
import {
  CreateCompanyPropertyParams,
  UpdateCompanyPropertyParams,
  QueryCompanyPropertyParams,
} from '@reup/reup-api-sdk/libs/api/company/property';
import { ICompanyUserInvitation } from '@reup/reup-api-sdk/libs/api/company/models';
import { QueryCompanyUnitParams, CreateCompanyUnitParams } from '@reup/reup-api-sdk/libs/api/company/unit';
import { QueryCompanyUserParams } from '@reup/reup-api-sdk/libs/api/company/user';
import { GetCompanyTenantParams } from '@reup/reup-api-sdk/libs/api/company/tenant';
import { ITransferUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { QueryCompanyDocumentParams } from '@reup/reup-api-sdk/libs/api/company/document';
import {
  QueryCompanyPositionParams,
  CreateCompanyPositionParams,
  UpdateCompanyPositionParams,
} from '@reup/reup-api-sdk/libs/api/company/position';
import { isTenantApp, isManagerApp } from '@src/utils';
import { QueryResidentDocumentParams } from '@reup/reup-api-sdk/libs/api/resident/document';

export const wait = (time: number) => new Promise(rs => setTimeout(rs, time));

export const getListCompany: any = async (page?: number, limit?: number) => {
  try {
    const response = await api.Company.list(page, limit);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const createCompany: any = async (params: CreateCompanyParams) => {
  try {
    const response = await api.Company.create(params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListPosition: any = async (companyId: string, page?: number, limit?: number, params?: QueryCompanyPositionParams) => {
  try {
    const response = await api.Company.Position.list(companyId, page, limit, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const createNewPosition: any = async (companyId: string, params: CreateCompanyPositionParams) => {
  try {
    const response = await api.Company.Position.create(companyId, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const updatePosition: any = async (companyId: string, id: string, params: UpdateCompanyPositionParams) => {
  try {
    const response = await api.Company.Position.update(companyId, id, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const deletePosition: any = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.Position.remove(companyId, id);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListStaff: any = async (id: string, page?: number, limit?: number, params?: QueryCompanyUserParams) => {
  try {
    const response = isManagerApp() ?
      await api.Company.User.list(id, page, limit, params)
      : await api.Property.adminList(id, page, limit);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const removeStaff: any = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.User.remove(companyId, id);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const staffCount: any = async (companyId: string, params?: ResidentCountParams) => {
  try {
    const response = await api.Company.staffCount(companyId, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const residentCount: any = async (companyId: string, params?: ResidentCountParams) => {
  try {
    const response = await api.Company.residentCount(companyId, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListProperty: any = async (companyId: string, page?: number, limit?: number, params?: QueryCompanyPropertyParams) => {
  try {
    const response = await api.Company.Property.list(companyId, page ? page : 1, limit ? limit : 20, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const createProperty: any = async (companyId: string, params: CreateCompanyPropertyParams) => {
  try {
    const response = await api.Company.Property.create(companyId, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const detailProperty: any = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.Property.detail(companyId, id);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const updateProperty: any = async (companyId: string, id: string, params: UpdateCompanyPropertyParams) => {
  try {
    const response = await api.Company.Property.update(companyId, id, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const deleteProperty: any = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.Property.remove(companyId, id);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListPropertyType: any = async () => {
  try {
    const response = await api.Company.propertyType();
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListApartment: any = async (companyId: string, page?: number, limit?: number, q?: QueryCompanyUnitParams) => {
  try {
    const response = await api.Company.Unit.list(companyId, page, limit, q);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const detailApartment: any = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.Unit.detail(companyId, id);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const createApartment: any = async (companyId: string, params: CreateCompanyUnitParams) => {
  try {
    const response = await api.Company.Unit.create(companyId, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const inviteStaff: any = async (companyId: string, params: ICompanyUserInvitation) => {
  try {
    const response = await api.Company.invitation(companyId, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getMyListCountry = async (companyId: string, page?: number, limit?: number) => {
  try {
    const response = await api.Country.me(companyId, page, limit);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const getListTenant: any = async (companyId: string, page?: number, limit?: number, params?: GetCompanyTenantParams) => {
  try {
    const response = await api.Company.Tenant.list(companyId, page, limit, params);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const getListPropertyFollowCountry: any = async (companyId: string, countryId: string, page?: number, limit?: number) => {
  try {
    const params: QueryCompanyPropertyParams = {
      country_id: countryId ?? '',
    };
    const response = await api.Company.Property.list(companyId, page, limit, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListMyProperty: any = async (page?: number, limit?: number) => {
  try {
    const response = await api.Property.me(page, limit);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListApartmentFollowCountry: any = async (
  companyId: string,
  propertyId: string,
  countryId: string,
  page?: number,
  limit?: number,
) => {
  try {
    const params: QueryCompanyUnitParams = {
      country_id: countryId ?? '',
      property_id: propertyId ?? '',
    };
    const response = await api.Company.Unit.list(companyId, page, limit, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const transferApartment: any = async (companyId: string, unitFromId: string, unitToId: string) => {
  try {
    const params: ITransferUnit = {
      unit_from: unitFromId,
      unit_to: unitToId,
    };
    const response = await api.Company.Unit.transfer(companyId, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const removeTenant: any = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.Tenant.remove(companyId, id);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListDocument = async (id: string, page?: number, limit?: number, params?: QueryCompanyDocumentParams & QueryResidentDocumentParams) => {
  try {
    const response = isTenantApp()
      ? await api.Resident.ResidentDocument.list(id, page, limit, params)
      : await api.Company.Document.list(id, page, limit, params);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};


export const getUserPermissions: any = async (companyId: string) => {
  try {
    const response = await api.Company.User.permissions(companyId);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
}
