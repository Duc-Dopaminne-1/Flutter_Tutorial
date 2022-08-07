import * as actions from './actions';
import { Action } from 'redux';
import configSaga from './saga';
import reducer from './reducer';
import { IActionCallback, IError } from '@src/models/callback';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { IDType } from '@reup/reup-api-sdk/libs/api/user/models';
import { IActionResetAllState } from '../auth';

// Action Types
export enum ActionTypes {
  SAVE_COUNTRIES = 'SAVE_COUNTRIES',
  GET_COUNTRIES = 'GET_COUNTRIES',
  GET_LIST_STATE = 'GET_LIST_STATE',
  SAVE_ID_TYPE = 'SAVE_ID_TYPE',
  GET_ID_TYPE = 'GET_ID_TYPE',
  GET_BLOCK = 'GET_BLOCK',
  SAVE_BLOCK = 'SAVE_BLOCK',
  GET_FLOOR = 'GET_FLOOR',
  SAVE_FLOOR = 'SAVE_FLOOR',
}

// Payload
export interface IActionSaveCountriesPayload extends IActionCallback {
  results: IPagination<ICountry>;
}

export interface IActionGetListCountryPayload extends IActionCallback {
  page?: number;
  limit?: number;
}

export interface IActionGetListStatePayload extends IActionCallback {
  countryId: string;
  page?: number;
  limit?: number;
}

export interface IActionSaveIDTypePayload extends IActionCallback {
  results: IDType[];
}

export interface IActionGetListBlockPayload extends IActionCallback {
  property_id: string;
  page?: number;
  limit?: number;
}

export interface IActionSaveListBlockPayload extends IActionCallback {
  results: IPagination<string>;
}

export interface IActionGetListFloorPayload extends IActionCallback {
  property_id: string;
  page?: number;
  limit?: number;
}

export interface IActionSaveListFloorPayload extends IActionCallback {
  results: IPagination<string>;
}

// Actions
export interface IActionSaveCountries extends Action {
  type: ActionTypes.SAVE_COUNTRIES;
  payload: IActionSaveCountriesPayload;
}

export interface IActionListCountry extends Action {
  type: ActionTypes.GET_COUNTRIES;
  payload: IActionGetListCountryPayload;
}

export interface IActionGetListState extends Action {
  type: ActionTypes.GET_LIST_STATE;
  payload: IActionGetListStatePayload;
}

export interface IActionSaveIDType extends Action {
  type: ActionTypes.SAVE_ID_TYPE;
  payload: IActionSaveIDTypePayload;
}

export interface IActionGetIDType extends Action {
  type: ActionTypes.GET_ID_TYPE;
  payload: IActionCallback;
}

export interface IActionGetListBlock extends Action {
  type: ActionTypes.GET_BLOCK;
  payload: IActionGetListBlockPayload;
}

export interface IActionSaveListBlock extends Action {
  type: ActionTypes.SAVE_BLOCK;
  payload: IActionSaveListBlockPayload;
}

export interface IActionGetListFloor extends Action {
  type: ActionTypes.GET_FLOOR;
  payload: IActionGetListFloorPayload;
}

export interface IActionSaveListFloor extends Action {
  type: ActionTypes.SAVE_FLOOR;
  payload: IActionSaveListFloorPayload;
}

export type IConfigAction =
  | IActionSaveCountries
  | IActionListCountry
  | IActionGetListState
  | IActionSaveIDType
  | IActionGetIDType
  | IActionResetAllState
  | IActionGetListBlock
  | IActionSaveListBlock
  | IActionGetListFloor
  | IActionSaveListFloor


export { actions, reducer, configSaga };
