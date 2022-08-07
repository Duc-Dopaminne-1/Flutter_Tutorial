import { IActionCallback } from '@src/models/callback';
import {
  QueryCompanyBulletinBoardNotificationParams,
  CreateCompanyBulletinBoardNotificationParams,
} from '@reup/reup-api-sdk/libs/api/company/bulletin-board/notification';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompanyBulletinBoardNotification } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/notification/models';
import { Action } from 'redux';
import * as actions from './actions';
import reducer from './reducer';
import bulletinSaga from './saga';
import {
  CreateCompanyBulletinBoardForLeaseParams,
  QueryCompanyBulletinBoardForLeaseParams,
} from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-lease';
import {
  CreateCompanyBulletinBoardForSaleParams,
  QueryCompanyBulletinBoardForSaleParams,
} from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-sale';
import { ICompanyBulletinBoardForLease } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-lease/models';
import { ICompanyBulletinBoardForSale } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-sale/models';
import { IActionResetAllState } from '../auth';
import { CreateExpenseData, QueryExpenseRequest, ExpenseStateData, UpdateExpenseData } from '@reup/reup-api-sdk/libs/api/bulletin/expense';
import { IExpense } from '@reup/reup-api-sdk/libs/api/bulletin/expense/model';
import {
  CreateResidentBulletinBoardForLeaseParams,
  QueryResidentBulletinBoardForLeaseParams,
} from '@reup/reup-api-sdk/libs/api/resident/bulletin/for-lease';
import {
  CreateResidentBulletinBoardForSaleParams,
  QueryResidentBulletinBoardForSaleParams,
} from '@reup/reup-api-sdk/libs/api/resident/bulletin/for-sale';
import {
  QueryResidentBulletinBoardNotificationParams,
  CreateResidentBulletinBoardNotificationParams,
} from '@reup/reup-api-sdk/libs/api/resident/bulletin/notification';
import { IResidentBulletinBoardNotification } from '@reup/reup-api-sdk/libs/api/resident/bulletin/notification/models';
import { QueryResidentExpenseRequest } from '@reup/reup-api-sdk/libs/api/resident/bulletin/expense';

// Action Type
export enum ActionTypes {
  GET_LIST_NOTIFICATION = 'GET_LIST_NOTIFICATION',
  LOAD_MORE_NOTIFICATIONS = 'LOAD_MORE_NOTIFICATIONS',
  SAVE_NOTIFICATIONS = 'SAVE_NOTIFICATIONS',
  DENY_NOTIFICATION = 'DENY_NOTIFICATION',
  APPROVE_NOTIFICATION = 'APPROVE_NOTIFICATION',
  CREATE_POST_FOR_LEASE = 'CREATE_POST_FOR_LEASE',
  CREATE_POST_FOR_SALE = 'CREATE_POST_FOR_SALE',
  GET_LIST_FOR_LEASE = 'GET_LIST_FOR_LEASE',
  SAVE_LIST_FOR_LEASE = 'SAVE_LIST_FOR_LEASE',
  LOAD_MORE_FOR_LEASE = 'LOAD_MORE_FOR_LEASE',
  GET_LIST_FOR_SALE = 'GET_LIST_FOR_SALE',
  SAVE_LIST_FOR_SALE = 'SAVE_LIST_FOR_SALE',
  LOAD_MORE_FOR_SALE = 'LOAD_MORE_FOR_SALE',
  ACTIVE_FOR_LEASE = 'ACTIVE_FOR_LEASE',
  DECLINE_FOR_LEASE = 'DECLINE_FOR_LEASE',
  ACTIVE_FOR_SALE = 'ACTIVE_FOR_SALE',
  DECLINE_FOR_SALE = 'DECLINE_FOR_SALE',
  NEW_MONTHLY_BILL = 'NEW_MONTHLY_BILL',
  SAVE_MONTHLY_BILLS = 'SAVE_MONTHLY_BILLS',
  LOAD_MORE_MONTHLY_BILLS = 'LOAD_MORE_MONTHLY_BILLS',
  GET_LIST_MONTHLY_BILL = 'GET_LIST_MONTHLY_BILL',
  APPROVE_MONTHLY_BILL = 'APPROVE_MONTHLY_BILL',
  DELETE_MONTHLY_BILL = 'DELETE_MONTHLY_BILL',
  EDIT_MONTHLY_BILL = 'EDIT_MONTHLY_BILL',
  CHECKOUT_MONTHLY_BILL = 'CHECKOUT_MONTHLY_BILL',
  CREATE_NOTIFICATION = 'CREATE_NOTIFICATION',
}

// PayLoad

export interface IActionGetListNotificationPayLoad extends IActionCallback {
  id: string;
  page?: number;
  limit?: number;
  params?: QueryCompanyBulletinBoardNotificationParams | QueryResidentBulletinBoardNotificationParams;
}

export interface IActionSaveNotificationsPayload extends IActionCallback {
  results?: IPagination<ICompanyBulletinBoardNotification>;
}

export interface IActionLoadMoreNotificationsPayload extends IActionCallback {
  results: IPagination<ICompanyBulletinBoardNotification>;
}

export interface IActionDenyNotificationPayload extends IActionCallback {
  companyId: string;
  notificationId: string;
}

export interface IActionApproveNotificationPayload extends IActionCallback {
  companyId: string;
  notificationId: string;
}

export interface IActionCreatePostForLeasePayload extends IActionCallback {
  id: string;
  params: CreateCompanyBulletinBoardForLeaseParams | CreateResidentBulletinBoardForLeaseParams;
}

export interface IActionCreatePostForSalePayload extends IActionCallback {
  id: string;
  params: CreateCompanyBulletinBoardForSaleParams | CreateResidentBulletinBoardForSaleParams;
}
export interface IActionGetListForLeasePayload extends IActionCallback {
  id: string;
  page?: number;
  limit?: number;
  params?: QueryCompanyBulletinBoardForLeaseParams | QueryResidentBulletinBoardForLeaseParams;
}

export interface IActionSaveListForLeasePayload extends IActionCallback {
  results: IPagination<ICompanyBulletinBoardForLease>;
}

export interface IActionLoadMoreListForLeasePayload extends IActionCallback {
  results: IPagination<ICompanyBulletinBoardForLease>;
}

export interface IActionGetListForSalePayload extends IActionCallback {
  id: string;
  page?: number;
  limit?: number;
  params?: QueryCompanyBulletinBoardForSaleParams | QueryResidentBulletinBoardForSaleParams;
}

export interface IActionSaveListForSalePayload extends IActionCallback {
  results: IPagination<ICompanyBulletinBoardForSale>;
}

export interface IActionLoadMoreListForSalePayload extends IActionCallback {
  results: IPagination<ICompanyBulletinBoardForSale>;
}

export interface IActionActiveForLeasePayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionDeclineForLeasePayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionActiveForSalePayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionDeclineForSalePayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionNewMonthlyBillPayload extends IActionCallback {
  params: CreateExpenseData;
}

export interface IActionGetListMonthlyBillPayload extends IActionCallback {
  id?: string;
  page?: number;
  limit?: number;
  params?: QueryExpenseRequest | QueryResidentExpenseRequest;
  isSave?: boolean;
}

export interface IActionSaveMonthlyBillsPayload extends IActionCallback {
  results: IPagination<IExpense>;
}

export interface IActionLoadMoreMonthlyBillsPayload extends IActionCallback {
  results: IPagination<IExpense>;
}

export interface IActionApproveMonthlyBillPayload extends IActionCallback {
  params: ExpenseStateData;
  id: string;
}

export interface IActionDeleteMonthlyBillPayload extends IActionCallback {
  id: string;
}

export interface IActionEditMonthlyBillPayload extends IActionCallback {
  id: string;
  params: UpdateExpenseData;
}

export interface IActionCheckoutMonthlyBillPayload extends IActionCallback {
  params: ExpenseStateData;
  id: string;
  propertyId?: string;
}

export interface IActionCreateNotificationPayload extends IActionCallback {
  id: string;
  params: CreateCompanyBulletinBoardNotificationParams | CreateResidentBulletinBoardNotificationParams;
}

// Action

export interface IActionGetListNotification extends Action {
  type: ActionTypes.GET_LIST_NOTIFICATION;
  payload: IActionGetListNotificationPayLoad;
}

export interface IActionSaveNotifications extends Action {
  type: ActionTypes.SAVE_NOTIFICATIONS;
  payload: IActionSaveNotificationsPayload;
}

export interface IActionLoadMoreNotifications extends Action {
  type: ActionTypes.LOAD_MORE_NOTIFICATIONS;
  payload: IActionLoadMoreNotificationsPayload;
}

export interface IActionDenyNotification extends Action {
  type: ActionTypes.DENY_NOTIFICATION;
  payload: IActionDenyNotificationPayload;
}

export interface IActionApproveNotification extends Action {
  type: ActionTypes.APPROVE_NOTIFICATION;
  payload: IActionApproveNotificationPayload;
}

export interface IActionCreatePostForLease extends Action {
  type: ActionTypes.CREATE_POST_FOR_LEASE;
  payload: IActionCreatePostForLeasePayload;
}

export interface IActionCreatePostForSale extends Action {
  type: ActionTypes.CREATE_POST_FOR_SALE;
  payload: IActionCreatePostForSalePayload;
}

export interface IActionGetListForLease extends Action {
  type: ActionTypes.GET_LIST_FOR_LEASE;
  payload: IActionGetListForLeasePayload;
}

export interface IActionSaveListForLease extends Action {
  type: ActionTypes.SAVE_LIST_FOR_LEASE;
  payload: IActionSaveListForLeasePayload;
}

export interface IActionLoadMoreListForLease extends Action {
  type: ActionTypes.LOAD_MORE_FOR_LEASE;
  payload: IActionLoadMoreListForLeasePayload;
}

export interface IActionGetListForSale extends Action {
  type: ActionTypes.GET_LIST_FOR_SALE;
  payload: IActionGetListForSalePayload;
}

export interface IActionSaveListForSale extends Action {
  type: ActionTypes.SAVE_LIST_FOR_SALE;
  payload: IActionSaveListForSalePayload;
}

export interface IActionLoadMoreListForSale extends Action {
  type: ActionTypes.LOAD_MORE_FOR_SALE;
  payload: IActionLoadMoreListForSalePayload;
}

export interface IActionActiveForLease extends Action {
  type: ActionTypes.ACTIVE_FOR_LEASE;
  payload: IActionActiveForLeasePayload;
}

export interface IActionDeclineForLease extends Action {
  type: ActionTypes.DECLINE_FOR_LEASE;
  payload: IActionDeclineForLeasePayload;
}

export interface IActionActiveForSale extends Action {
  type: ActionTypes.ACTIVE_FOR_SALE;
  payload: IActionActiveForSalePayload;
}

export interface IActionDeclineForSale extends Action {
  type: ActionTypes.DECLINE_FOR_SALE;
  payload: IActionDeclineForSalePayload;
}

export interface IActionNewMonthlyBill extends Action {
  type: ActionTypes.NEW_MONTHLY_BILL;
  payload: IActionNewMonthlyBillPayload;
}

export interface IActionGetListMonthlyBill extends Action {
  type: ActionTypes.GET_LIST_MONTHLY_BILL;
  payload: IActionGetListMonthlyBillPayload;
}

export interface IActionSaveMonthlyBills extends Action {
  type: ActionTypes.SAVE_MONTHLY_BILLS;
  payload: IActionSaveMonthlyBillsPayload;
}

export interface IActionLoadMoreMonthlyBills extends Action {
  type: ActionTypes.LOAD_MORE_MONTHLY_BILLS;
  payload: IActionLoadMoreMonthlyBillsPayload;
}

export interface IActionApproveMonthlyBill extends Action {
  type: ActionTypes.APPROVE_MONTHLY_BILL;
  payload: IActionApproveMonthlyBillPayload;
}

export interface IActionDeleteMonthlyBill extends Action {
  type: ActionTypes.DELETE_MONTHLY_BILL;
  payload: IActionDeleteMonthlyBillPayload;
}

export interface IActionEditMonthlyBill extends Action {
  type: ActionTypes.EDIT_MONTHLY_BILL;
  payload: IActionEditMonthlyBillPayload;
}

export interface IActionCheckoutMonthlyBill extends Action {
  type: ActionTypes.CHECKOUT_MONTHLY_BILL;
  payload: IActionCheckoutMonthlyBillPayload;
}

export interface IActionCreateNotification extends Action {
  type: ActionTypes.CREATE_NOTIFICATION;
  payload: IActionCreateNotificationPayload;
}

export type IActionBulletin =
  | IActionGetListNotification
  | IActionSaveNotifications
  | IActionLoadMoreNotifications
  | IActionApproveNotification
  | IActionDenyNotification
  | IActionCreatePostForLease
  | IActionCreatePostForSale
  | IActionGetListForLease
  | IActionSaveListForLease
  | IActionLoadMoreListForLease
  | IActionGetListForSale
  | IActionSaveListForSale
  | IActionLoadMoreListForSale
  | IActionActiveForLease
  | IActionDeclineForLease
  | IActionActiveForSale
  | IActionDeclineForSale
  | IActionResetAllState
  | IActionNewMonthlyBill
  | IActionGetListMonthlyBill
  | IActionSaveMonthlyBills
  | IActionLoadMoreMonthlyBills
  | IActionEditMonthlyBill
  | IActionDeleteMonthlyBill
  | IActionApproveMonthlyBill
  | IActionCheckoutMonthlyBill
  | IActionCreateNotification;

export { actions, reducer, bulletinSaga };
