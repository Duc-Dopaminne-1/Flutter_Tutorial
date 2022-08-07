import { Action } from 'redux';
import { IActionCallback } from '@src/models/callback';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import {
  IQueryEventRequest,
  CreateEventParams,
  UpdateEventParams,
  ChangEventStatusRequest,
} from '@reup/reup-api-sdk/libs/api/calendar/event';
import { IEvent } from '@reup/reup-api-sdk/libs/api/calendar/event/models';
import * as actions from './actions';
import reducer from './reducer';
import saga from './saga';
import { IActionResetAllState } from '../auth';
import { IQueryResidentEventRequest } from '@reup/reup-api-sdk/libs/api/resident/calendar';

// Action Types
export enum ActionTypes {
  GET_LIST_EVENT = 'GET_LIST_EVENT',
  SAVE_LIST_EVENT = 'SAVE_LIST_EVENT',
  LOAD_MORE_LIST_EVENT = 'LOAD_MORE_LIST_EVENT',
  CREATE_EVENT = 'CREATE_EVENT',
  DETAIL_EVENT = 'DETAIL_EVENT',
  UPDATE_EVENT = 'UPDATE_EVENT',
  REMOVE_EVENT = 'REMOVE_EVENT',
  CHANGE_STATUS_EVENT = 'CHANGE_STATUS_EVENT',
  CREATE_EVENT_TENANT = 'CREATE_EVENT_TENANT',
}

// Payload
export interface IActionGetListEventPayload extends IActionCallback {
  page: number;
  limit?: number;
  q?: IQueryEventRequest | IQueryResidentEventRequest;
  propertyId?: string;
  isSave?: boolean;
}

export interface IActionSaveListEventPayload extends IActionCallback {
  results: IPagination<IEvent>;
}

export interface IActionLoadMoreListEventPayload extends IActionCallback {
  results: IPagination<IEvent>;
}

export interface IActionCreateEventPayload extends IActionCallback {
  params: CreateEventParams;
}

export interface IActionDetailEventPayload extends IActionCallback {
  id: string;
}

export interface IActionUpdateEventPayload extends IActionCallback {
  id: string;
  params: UpdateEventParams;
}

export interface IActionRemoveEventPayload extends IActionCallback {
  id: string;
}

export interface IActionChangeStatusEventPayload extends IActionCallback {
  id: string;
  params: ChangEventStatusRequest;
}

export interface IActionCreateEventTenantPayload extends IActionCallback {
  propertyId: string;
  params: CreateEventParams;
}

// Actions
export interface IActionGetListEvent extends Action {
  type: ActionTypes.GET_LIST_EVENT;
  payload: IActionGetListEventPayload;
}

export interface IActionSaveListEvent extends Action {
  type: ActionTypes.SAVE_LIST_EVENT;
  payload: IActionSaveListEventPayload;
}

export interface IActionLoadMoreListEvent extends Action {
  type: ActionTypes.LOAD_MORE_LIST_EVENT;
  payload: IActionLoadMoreListEventPayload;
}

export interface IActionCreateEvent extends Action {
  type: ActionTypes.CREATE_EVENT;
  payload: IActionCreateEventPayload;
}

export interface IActionDetailEvent extends Action {
  type: ActionTypes.DETAIL_EVENT;
  payload: IActionDetailEventPayload;
}

export interface IActionUpdateEvent extends Action {
  type: ActionTypes.UPDATE_EVENT;
  payload: IActionUpdateEventPayload;
}

export interface IActionRemoveEvent extends Action {
  type: ActionTypes.REMOVE_EVENT;
  payload: IActionRemoveEventPayload;
}

export interface IActionChangeStatusEvent extends Action {
  type: ActionTypes.CHANGE_STATUS_EVENT;
  payload: IActionChangeStatusEventPayload;
}

export interface IActionCreateEventTenant extends Action {
  type: ActionTypes.CREATE_EVENT_TENANT;
  payload: IActionCreateEventTenantPayload;
}

export type ICalendarAction =
  | IActionGetListEvent
  | IActionSaveListEvent
  | IActionLoadMoreListEvent
  | IActionCreateEvent
  | IActionDetailEvent
  | IActionUpdateEvent
  | IActionRemoveEvent
  | IActionChangeStatusEvent
  | IActionResetAllState
  | IActionCreateEventTenant;

export { actions, reducer, saga };
