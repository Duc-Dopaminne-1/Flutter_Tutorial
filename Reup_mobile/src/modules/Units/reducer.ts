import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IUnitMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';
import { IUnitVehicle } from '@reup/reup-api-sdk/libs/api/unit/vehicle/models';
import { IUnitPet } from '@reup/reup-api-sdk/libs/api/unit/pet/models';
import { CommonActionType } from '../auth';
import {
  ActionTypes,
  IUnitAction
} from './index';
import { IUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
export interface IUnitState {
  listMember: IPagination<IUnitMember>;
  listVehicle: IPagination<IUnitVehicle>;
  listPet: IPagination<IUnitPet>;
  listMyUnit: IPagination<IUnit>;
}

const initialState: IUnitState = {
  listMember: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listVehicle: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listPet: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listMyUnit: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  }
};

const reducer = (state: IUnitState = initialState, action: IUnitAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_MEMBERS:
      return {
        ...state,
        listMember: action.payload.result,
      };
    case ActionTypes.SAVE_VEHICLES:
      return {
        ...state,
        listVehicle: action.payload.result,
      };
    case ActionTypes.SAVE_PETS:
      return {
        ...state,
        listPet: action.payload.result,
      };
    case ActionTypes.LOAD_MORE_MEMBERS:
      return {
        ...state,
        listMember: {
          count: action.payload.result.count,
          next: action.payload.result.next,
          previous: action.payload.result.previous,
          results: [...state.listMember.results, ...action.payload.result.results],
        },
      };
    case ActionTypes.LOAD_MORE_VEHICLES:
      return {
        ...state,
        listVehicle: {
          count: action.payload.result.count,
          next: action.payload.result.next,
          previous: action.payload.result.previous,
          results: [...state.listVehicle.results, ...action.payload.result.results],
        },
      };
    case ActionTypes.LOAD_MORE_PETS:
      return {
        ...state,
        listPet: {
          count: action.payload.result.count,
          next: action.payload.result.next,
          previous: action.payload.result.previous,
          results: [...state.listPet.results, ...action.payload.result.results],
        },
      };
    case ActionTypes.SAVE_LIST_UNIT_ME:
      return {
        ...state,
        listMyUnit: action.payload.result
      };
    case ActionTypes.LOAD_MORE_UNIT_ME:
      return {
        ...state,
        listMyUnit: {
          count: action.payload.result.count,
          next: action.payload.result.next,
          previous: action.payload.result.previous,
          results: [...state.listMyUnit.results, ...action.payload.result.results],
        }
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
