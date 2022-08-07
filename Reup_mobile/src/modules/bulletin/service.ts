import {
  QueryCompanyBulletinBoardNotificationParams,
  CreateCompanyBulletinBoardNotificationParams,
} from '@reup/reup-api-sdk/libs/api/company/bulletin-board/notification';
import { api } from '@reup/reup-api-sdk';
import {
  CreateCompanyBulletinBoardForSaleParams,
  QueryCompanyBulletinBoardForSaleParams,
} from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-sale';
import {
  CreateCompanyBulletinBoardForLeaseParams,
  QueryCompanyBulletinBoardForLeaseParams,
} from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-lease';
import { CreateExpenseData, QueryExpenseRequest, ExpenseStateData, UpdateExpenseData } from '@reup/reup-api-sdk/libs/api/bulletin/expense';
import {
  CreateResidentBulletinBoardForLeaseParams,
  QueryResidentBulletinBoardForLeaseParams,
} from '@reup/reup-api-sdk/libs/api/resident/bulletin/for-lease';
import { isTenantApp, isManagerApp } from '@src/utils';
import {
  QueryResidentBulletinBoardNotificationParams,
  CreateResidentBulletinBoardNotificationParams,
} from '@reup/reup-api-sdk/libs/api/resident/bulletin/notification';
import { QueryResidentExpenseRequest } from '@reup/reup-api-sdk/libs/api/resident/bulletin/expense';

export const getListNotification: any = async (
  id: string,
  page?: number,
  limit?: number,
  params?: QueryCompanyBulletinBoardNotificationParams | QueryResidentBulletinBoardNotificationParams,
) => {
  try {
    const value = isManagerApp()
      ? await api.Company.BulletinBoard.Notification.list(id, page, limit, params)
      : await api.Resident.ResidentBulletin.ResidentNotification.list(id, page, limit, params);
    return { value };
  } catch (error) {
    return { error };
  }
};

export const denyNotification: any = async (companyId: string, notificationId: string) => {
  try {
    const value = await api.Company.BulletinBoard.Notification.decline(companyId, notificationId);
    return { value };
  } catch (error) {
    return { error };
  }
};

export const approveNotification: any = async (companyId: string, notificationId: string) => {
  try {
    const value = await api.Company.BulletinBoard.Notification.active(companyId, notificationId);
    return { value };
  } catch (error) {
    return { error };
  }
};

export const createPostForSale: any = async (
  id: string,
  params: CreateCompanyBulletinBoardForSaleParams | CreateResidentBulletinBoardForLeaseParams,
) => {
  try {
    const response = isTenantApp()
      ? await api.Resident.ResidentBulletin.ResidentForSale.create(id, params)
      : await api.Company.BulletinBoard.ForSale.create(id, params as CreateCompanyBulletinBoardForSaleParams);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const createPostForLease: any = async (
  id: string,
  params: CreateCompanyBulletinBoardForSaleParams | CreateCompanyBulletinBoardForLeaseParams,
) => {
  try {
    const response = isTenantApp()
      ? await api.Resident.ResidentBulletin.ResidentForLease.create(id, params)
      : await api.Company.BulletinBoard.ForLease.create(id, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListForLease = async (
  id: string,
  page?: number,
  limit?: number,
  params?: QueryCompanyBulletinBoardForLeaseParams & QueryResidentBulletinBoardForLeaseParams,
) => {
  try {
    const response = isTenantApp()
      ? await api.Resident.ResidentBulletin.ResidentForLease.list(id, page, limit, params)
      : await api.Company.BulletinBoard.ForLease.list(id, page, limit, params);
    return { value: response };
  } catch (error) {
    return { error };
  }
};

export const getListForSale = async (
  id: string,
  page?: number,
  limit?: number,
  params?: QueryCompanyBulletinBoardForSaleParams & QueryCompanyBulletinBoardForSaleParams,
) => {
  try {
    const response = isTenantApp()
      ? await api.Resident.ResidentBulletin.ResidentForSale.list(id, page, limit, params)
      : await api.Company.BulletinBoard.ForSale.list(id, page, limit, params);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const activeForLease = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.BulletinBoard.ForLease.active(companyId, id);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const declineForLease = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.BulletinBoard.ForLease.decline(companyId, id);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const activeForSale = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.BulletinBoard.ForSale.active(companyId, id);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const declineForSale = async (companyId: string, id: string) => {
  try {
    const response = await api.Company.BulletinBoard.ForSale.decline(companyId, id);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const newMonthlyBill = async (params: CreateExpenseData) => {
  try {
    const response = await api.Bulletin.Expense.create(params);
    return { response };
  } catch (error) {
    return { error };
  }
};

export const getListMonthlyBill = async (
  id?: string,
  page?: number,
  limit?: number,
  params?: QueryExpenseRequest | QueryResidentExpenseRequest,
) => {
  try {
    const response = isTenantApp()
      ? await api.Resident.ResidentExpense.list(id ?? '', page ?? 1, limit, params)
      : await api.Bulletin.Expense.list(page, limit, params);
    return { response };
  } catch (error) {
    return { error };
  }
};

export const changeStateMonthlyBill = async (id: string, params: ExpenseStateData, propertyId?: string) => {
  try {
    const response = isTenantApp()
      ? await api.Resident.ResidentExpense.paid(propertyId ?? '', id, params)
      : await api.Bulletin.Expense.changeState(id, params);
    return { response };
  } catch (error) {
    return { error };
  }
};

export const deleteMonthlyBill = async (id: string) => {
  try {
    const response = await api.Bulletin.Expense.remove(id);
    return { response };
  } catch (error) {
    return { error };
  }
};

export const editMonthlyBill = async (id: string, params: UpdateExpenseData) => {
  try {
    const response = await api.Bulletin.Expense.update(id, params);
    return { response };
  } catch (error) {
    return { error };
  }
};

export const createNewNotification: any = async (
  id: string,
  params: CreateCompanyBulletinBoardNotificationParams | CreateResidentBulletinBoardNotificationParams,
) => {
  try {
    const response = isManagerApp()
      ? await api.Company.BulletinBoard.Notification.create(id, params as CreateCompanyBulletinBoardNotificationParams)
      : await api.Resident.ResidentBulletin.ResidentNotification.create(id, params);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};
