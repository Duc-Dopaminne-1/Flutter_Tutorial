import { ActionTypes, IConfigAction } from './index';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { IDType } from '@reup/reup-api-sdk/libs/api/user/models';
import { CommonActionType } from '../auth';

export interface IConfigState {
  listCountry: IPagination<ICountry>;
  idType: IDType[];
  listBlock: IPagination<string>;
  listFloor: IPagination<string>;
}

const initialState: IConfigState = {
  listCountry: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  idType: [],
  listBlock: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listFloor: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
};

const reducer = (state: IConfigState = initialState, action: IConfigAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_COUNTRIES:
      const { count, results, next, previous } = action.payload.results;
      return {
        ...state,
        listCountry: {
          count: count,
          results: results,
          next: next,
          previous: previous,
        },
      };
    case ActionTypes.SAVE_ID_TYPE:
      return {
        ...state,
        idType: action.payload,
      };

    case ActionTypes.SAVE_BLOCK:
      return {
        ...state,
        listBlock: action.payload.results,
      };

    case ActionTypes.SAVE_FLOOR:
      return {
        ...state,
        listFloor: action.payload.results,
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
