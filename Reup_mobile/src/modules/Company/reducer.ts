import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompany, ICount, IPropertyType } from '@reup/reup-api-sdk/libs/api/company/models';
import { ICompanyAction, ActionTypes } from './index';
import { CommonActionType } from '../auth';
import { ICompanyPosition } from '@reup/reup-api-sdk/libs/api/company/position/model';
import { ICompanyUser } from '@reup/reup-api-sdk/libs/api/company/user/models';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { ICompanyUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { IUnitMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';
import { ICompanyDocument } from '@reup/reup-api-sdk/libs/api/company/document/models';
import { IProperty } from '@reup/reup-api-sdk/src/api/company/property/model';

export interface ICompanyState {
  listCompany: IPagination<ICompany>;
  listPosition: IPagination<ICompanyPosition>;
  listStaff: IPagination<ICompanyUser>;
  countStaff: ICount;
  countResident: ICount;
  listProperty: IPagination<ICompanyProperty>;
  listPropertyType: IPropertyType[];
  listApartment: IPagination<ICompanyUnit>;
  listMyCountry: IPagination<ICountry>;
  listTenant: IPagination<IUnitMember>;
  listDocument: IPagination<ICompanyDocument>;
  listMyProperty: IPagination<IProperty>;
}

const initialState: ICompanyState = {
  listCompany: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listPosition: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listStaff: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listProperty: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listMyProperty: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  countStaff: {
    count: 0,
  },
  countResident: {
    count: 0,
  },
  listPropertyType: [],
  listApartment: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listMyCountry: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listTenant: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listDocument: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
};

const reducer = (state: ICompanyState = initialState, action: ICompanyAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_LIST_COMPANY:
      return {
        ...state,
        listCompany: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_POSITION:
      return {
        ...state,
        listPosition: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_LIST_POSITION:
      return {
        ...state,
        listPosition: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listPosition.results, ...action.payload.results.results],
        },
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    case ActionTypes.SAVE_LIST_STAFF:
      return {
        ...state,
        listStaff: action.payload.results,
      };

    case ActionTypes.LOAD_MORE_LIST_STAFF:
      return {
        ...state,
        listStaff: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listStaff.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_PROPERTTY:
      return {
        ...state,
        listProperty: action.payload.results,
      };

    case ActionTypes.LOAD_MORE_LIST_PROPERTY:
      return {
        ...state,
        listProperty: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listProperty.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_COUNT_LIST_STAFF:
      return {
        ...state,
        countStaff: action.payload.count,
      };
    case ActionTypes.SAVE_COUNT_LIST_RESIDENT:
      return {
        ...state,
        countResident: action.payload.count,
      };
    case ActionTypes.SAVE_LIST_PROPERTY_TYPE:
      return {
        ...state,
        listPropertyType: action.payload.results,
      };
    case ActionTypes.SAVE_LIST_APARTMENT:
      return {
        ...state,
        listApartment: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_LIST_APARTMENT:
      return {
        ...state,
        listApartment: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listApartment.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_MY_COUNTRIES:
      return {
        ...state,
        listMyCountry: action.payload.results,
      };
    case ActionTypes.SAVE_LIST_MY_PROPERTY:
      return {
        ...state,
        listMyProperty: action.payload.results,
      };
    case ActionTypes.SAVE_LIST_TENANT:
      return {
        ...state,
        listTenant: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_LIST_TENANT:
      return {
        ...state,
        listTenant: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.next,
          results: [...state.listTenant.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_DOCUMENTS:
      return {
        ...state,
        listDocument: action.payload.result,
      };
    case ActionTypes.LOAD_MORE_DOCUMENTS:
      return {
        ...state,
        listDocument: {
          count: action.payload.result.count,
          next: action.payload.result.next,
          previous: action.payload.result.previous,
          results: [...state.listDocument.results, ...action.payload.result.results],
        },
      };
    default:
      return state;
  }
};

export default reducer;
