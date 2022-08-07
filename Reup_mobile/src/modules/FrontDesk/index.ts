import { IActionCallback } from '@src/models/callback';
import { QueryVisitorRequest, CheckInOutData, CreateVisitorData } from '@reup/reup-api-sdk/libs/api/frontdesk/visitor';
import { Action } from 'redux';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IVisitor } from '@reup/reup-api-sdk/libs/api/frontdesk/visitor/model';
import * as actions from './actions';
import reducer from '@modules/FrontDesk/reducer';
import frontDeskSaga from '@modules/FrontDesk/saga';
import { QueryFacilityParams, CreateFacilityParams, UpdateFacilityParams } from '@reup/reup-api-sdk/libs/api/company/facility';
import { IFacility } from '@reup/reup-api-sdk/libs/api/company/facility/models';
import { QueryDeliveryRequest, CreateDeliveryData } from '@reup/reup-api-sdk/libs/api/frontdesk/delivery';
import { IDelivery } from '@reup/reup-api-sdk/libs/api/frontdesk/delivery/model';
import { IActionResetAllState } from '../auth';
import { SearchParam, ResidentQueryVisitorParams } from '@reup/reup-api-sdk/libs/api/resident/frontdesk';
import { ResidentQueryDeliveryParams } from '@reup/reup-api-sdk/libs/api/resident/frontdesk';

export enum ActionTypes {
  GET_LIST_FACILITIES = 'GET_LIST_FACILITIES',
  LOAD_MORE_FACILITIES = 'LOAD_MORE_FACILITIES',
  SAVE_LIST_FACILITIES = 'SAVE_LIST_FACILITIES',
  CREATE_FACILITY = 'CREATE_FACILITY',
  DELETE_FACILITY = 'DELETE_FACILITY',
  UPDATE_FACILITY = 'UPDATE_FACILITY',
  GET_LIST_VISITOR = 'GET_LIST_VISITOR',
  SAVE_LIST_VISITOR = 'SAVE_LIST_VISITOR',
  LOAD_MORE_VISITORS = 'LOAD_MORE_VISITORS',
  CHECK_IN_OUT_VISITOR = 'CHECK_IN_OUT_VISITOR',
  CREATE_VISITOR = 'CREATE_VISITOR',
  GET_LIST_DELIVERY = 'GET_LIST_DELIVERY',
  LOAD_MORE_LIST_DELIVERY = 'LOAD_MORE_DELIVERY',
  SAVE_LIST_DELIVERY = 'SAVE_LIST_DELIVERY',
  CHECK_SHIPPED_DELIVERY = 'CHECK_SHIPPED_DELIVERY',
  CREATE_DELIVERY = 'CREATE_DELIVERY',
}

// Payload
export interface IActionGetListFacilitiesPayload extends IActionCallback {
  id: string;
  page?: number;
  limit?: number;
  params?: QueryFacilityParams | SearchParam;
  isSave?: boolean;
}

export interface IActionSaveListFacilitiesPayload extends IActionCallback {
  results: IPagination<IFacility>;
}

export interface IActionLoadMoreFacilitiesPayload extends IActionCallback {
  results: IPagination<IFacility>;
}

export interface IActionCreateFacilityPayload extends IActionCallback {
  companyId: string;
  params: CreateFacilityParams;
}

export interface IActionDeleteFacilityPayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionUpdateFacilityPayload extends IActionCallback {
  companyId: string;
  id: string;
  params: UpdateFacilityParams;
}
export interface IActionGetListVisitorPayload extends IActionCallback {
  id: string;
  page?: number;
  limit?: number;
  params?: QueryVisitorRequest | ResidentQueryVisitorParams;
}

export interface IActionSaveListVisitorPayload extends IActionCallback {
  results: IPagination<IVisitor>;
}

export interface IActionLoadMoreVisitorsPayload extends IActionCallback {
  results: IPagination<IVisitor>;
}

export interface IActionCheckInOutVisitorPayload extends IActionCallback {
  companyId: string;
  id: string;
  params: CheckInOutData;
}

export interface IActionCreateVisitorPayload extends IActionCallback {
  id: string;
  params: CreateVisitorData;
}

export interface IActionGetListDeliveryPayload extends IActionCallback {
  id: string;
  page?: number;
  limit?: number;
  params?: QueryDeliveryRequest | ResidentQueryDeliveryParams;
}

export interface IActionSaveListDeliveryPayload extends IActionCallback {
  results: IPagination<IDelivery>;
}

export interface IActionLoadMoreListDeliveryPayload extends IActionCallback {
  results: IPagination<IDelivery>;
}

export interface IActionCheckShippedDeliveryPayload extends IActionCallback {
  from: string;
  to: string;
}

export interface IActionCreateDeliveryPayload extends IActionCallback {
  companyId: string;
  params: CreateDeliveryData;
}

// Action
export interface IActionGetListFacilities extends Action {
  type: ActionTypes.GET_LIST_FACILITIES;
  payload: IActionGetListFacilitiesPayload;
}

export interface IActionSaveListFacilities extends Action {
  type: ActionTypes.SAVE_LIST_FACILITIES;
  payload: IActionSaveListFacilitiesPayload;
}

export interface IActionLoadMoreFacilities extends Action {
  type: ActionTypes.LOAD_MORE_FACILITIES;
  payload: IActionLoadMoreFacilitiesPayload;
}

export interface IActionCreateFacility extends Action {
  type: ActionTypes.CREATE_FACILITY;
  payload: IActionCreateFacilityPayload;
}

export interface IActionDeleteFacility extends Action {
  type: ActionTypes.DELETE_FACILITY;
  payload: IActionDeleteFacilityPayload;
}

export interface IActionUpdateFacility extends Action {
  type: ActionTypes.UPDATE_FACILITY;
  payload: IActionUpdateFacilityPayload;
}
export interface IActionGetListVisitor extends Action {
  type: ActionTypes.GET_LIST_VISITOR;
  payload: IActionGetListVisitorPayload;
}

export interface IActionSaveListVisitor extends Action {
  type: ActionTypes.SAVE_LIST_VISITOR;
  payload: IActionSaveListVisitorPayload;
}

export interface IActionLoadMoreVisitors extends Action {
  type: ActionTypes.LOAD_MORE_VISITORS;
  payload: IActionLoadMoreVisitorsPayload;
}

export interface IActionCheckInOutVisitor extends Action {
  type: ActionTypes.CHECK_IN_OUT_VISITOR;
  payload: IActionCheckInOutVisitorPayload;
}

export interface IActionCreateVisitor extends Action {
  type: ActionTypes.CREATE_VISITOR;
  payload: IActionCreateVisitorPayload;
}

export interface IActionGetListDelivery extends Action {
  type: ActionTypes.GET_LIST_DELIVERY;
  payload: IActionGetListDeliveryPayload;
}

export interface IActionSaveListDelivery extends Action {
  type: ActionTypes.SAVE_LIST_DELIVERY;
  payload: IActionSaveListDeliveryPayload;
}

export interface IActionLoadMoreListDelivery extends Action {
  type: ActionTypes.LOAD_MORE_LIST_DELIVERY;
  payload: IActionLoadMoreListDeliveryPayload;
}

export interface IActionCheckShippedDelivery extends Action {
  type: ActionTypes.CHECK_SHIPPED_DELIVERY;
  payload: IActionCheckShippedDeliveryPayload;
}

export interface IActionCreateDelivery extends Action {
  type: ActionTypes.CREATE_DELIVERY;
  payload: IActionCreateDeliveryPayload;
}

export type FrontDeskAction =
  | IActionGetListFacilities
  | IActionSaveListFacilities
  | IActionLoadMoreFacilities
  | IActionCreateFacility
  | IActionDeleteFacility
  | IActionUpdateFacility
  | IActionGetListVisitor
  | IActionSaveListVisitor
  | IActionLoadMoreVisitors
  | IActionCheckInOutVisitor
  | IActionCreateVisitor
  | IActionGetListDelivery
  | IActionSaveListDelivery
  | IActionLoadMoreListDelivery
  | IActionCheckShippedDelivery
  | IActionCreateDelivery
  | IActionResetAllState;

export { actions, reducer, frontDeskSaga };
