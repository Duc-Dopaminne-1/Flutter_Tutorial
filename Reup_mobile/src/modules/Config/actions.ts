import {
  ActionTypes,
  IActionListCountry,
  IActionGetListCountryPayload,
  IActionSaveCountriesPayload,
  IActionGetListStatePayload,
  IActionGetListState,
  IActionSaveIDTypePayload,
  IActionGetIDType,
  IActionGetListBlock,
  IActionGetListFloorPayload,
  IActionGetListFloor,
  IActionSaveListBlockPayload,
  IActionSaveListFloorPayload,
  IActionSaveListFloor,
  IActionSaveListBlock,
  IActionGetListBlockPayload
} from './index';
import { IActionCallback } from '@src/models/callback';

function saveCountry(payload: IActionSaveCountriesPayload) {
  return {
    type: ActionTypes.SAVE_COUNTRIES,
    payload,
  };
}

function getListCountry(payload: IActionGetListCountryPayload): IActionListCountry {
  return {
    type: ActionTypes.GET_COUNTRIES,
    payload,
  };
}

function getListState(payload: IActionGetListStatePayload): IActionGetListState {
  return {
    type: ActionTypes.GET_LIST_STATE,
    payload
  };
}

function saveIDType(payload: IActionSaveIDTypePayload) {
  return {
    type: ActionTypes.SAVE_ID_TYPE,
    payload,
  };
}

function getIDType(payload: IActionCallback): IActionGetIDType {
  return {
    type: ActionTypes.GET_ID_TYPE,
    payload,
  };
}

function getListBlock(payload: IActionGetListBlockPayload): IActionGetListBlock {
  return {
    type: ActionTypes.GET_BLOCK,
    payload,
  };
}

function saveListBlock(payload: IActionSaveListBlockPayload): IActionSaveListBlock {
  return {
    type: ActionTypes.SAVE_BLOCK,
    payload,
  };
}

function getListFloor(payload: IActionGetListFloorPayload): IActionGetListFloor {
  return {
    type: ActionTypes.GET_FLOOR,
    payload,
  };
}

function saveListFloor(payload: IActionSaveListFloorPayload): IActionSaveListFloor {
  return {
    type: ActionTypes.SAVE_FLOOR,
    payload,
  };
}

export {
  saveCountry,
  getListCountry,
  getListState,
  saveIDType,
  getIDType,
  getListBlock,
  saveListBlock,
  getListFloor,
  saveListFloor
};
