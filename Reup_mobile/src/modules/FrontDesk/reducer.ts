import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { FrontDeskAction, ActionTypes } from './index';
import { IVisitor } from '@reup/reup-api-sdk/libs/api/frontdesk/visitor/model';
import { IFacility } from '@reup/reup-api-sdk/libs/api/company/facility/models';
import { IDelivery } from '@reup/reup-api-sdk/libs/api/frontdesk/delivery/model';
import { CommonActionType } from '../auth';

export interface IFrontDeskState {
  listFacilities: IPagination<IFacility>;
  listVisitor: IPagination<IVisitor>;
  listDelivery: IPagination<IDelivery>;
}
const initialState: IFrontDeskState = {
  listFacilities: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listVisitor: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listDelivery: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
};
const reducer = (state: IFrontDeskState = initialState, action: FrontDeskAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_LIST_FACILITIES:
      return {
        ...state,
        listFacilities: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_FACILITIES:
      return {
        ...state,
        listFacilities: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listFacilities.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_VISITOR:
      return {
        ...state,
        listVisitor: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_VISITORS:
      return {
        ...state,
        listVisitor: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listVisitor.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_DELIVERY:
      return {
        ...state,
        listDelivery: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_LIST_DELIVERY:
      return {
        ...state,
        listDelivery: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listDelivery.results, ...action.payload.results.results],
        },
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
