import { ICompanyMaintenanceCategory } from '@reup/reup-api-sdk/libs/api/company/maintenance/category/models';
import { IMaintenanceAction, ActionTypes } from './index';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompanyMaintenanceRecurringTask } from '@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task/models';
import { IRequest, IGeneralRequestStatus } from '@reup/reup-api-sdk/libs/api/maintenance/request/model';

import { StatusMaintenanceRequest } from '@reup/reup-api-sdk/libs/api/enum';
import { CommonActionType } from '../auth';
export interface IMaintenanceState {
  listMaintenanceCategory: IPagination<ICompanyMaintenanceCategory>;
  listMaintenanceRequest: IPagination<IRequest>;
  listStatusMaintenanceRequest: IPagination<IRequest>;
  general: IGeneralRequestStatus;
  listRecurringTask: IPagination<ICompanyMaintenanceRecurringTask>;
  status: StatusMaintenanceRequest | null | undefined;
}

const initialState: IMaintenanceState = {
  listMaintenanceCategory: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listMaintenanceRequest: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listStatusMaintenanceRequest: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  general: {
    waiting_count: 0,
    pending_count: 0,
    in_progress_count: 0,
    done_count: 0,
  },
  listRecurringTask: {
    results: [],
    next: '',
    previous: '',
    count: 0,
  },
  status: null,
};

const reducer = (state: IMaintenanceState = initialState, action: IMaintenanceAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_LIST_MAINTENANCE_CATEGORY:
      return {
        ...state,
        listMaintenanceCategory: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_MAINTENANCE_CATEGORY:
      return {
        ...state,
        listMaintenanceCategory: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listMaintenanceCategory.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_MAINTENANCE_REQUEST:
      return {
        ...state,
        listMaintenanceRequest: action.payload.results,
      };

    case ActionTypes.SAVE_LIST_STATUS_MAINTENANCE_REQUEST:
      return {
        ...state,
        listStatusMaintenanceRequest: action.payload.results,
      };
    case ActionTypes.RESET_LIST_STATUS_MAINTENANCE_REQUEST:
      return {
        ...state,
        listStatusMaintenanceRequest: initialState.listStatusMaintenanceRequest,
      };
    case ActionTypes.SAVE_GENERAL:
      return {
        ...state,
        general: action.payload.results,
      };
    case ActionTypes.SAVE_RECURRING_TASKS:
      return {
        ...state,
        listRecurringTask: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_RECURRING_TASKS:
      const { count, results, next, previous } = action.payload.results;
      return {
        ...state,
        listRecurringTask: {
          count: count,
          next: next,
          previous: previous,
          results: [...state.listRecurringTask.results, ...results],
        },
      };
    case ActionTypes.LOAD_MORE_LIST_MAINTENANCE_REQUEST:
      return {
        ...state,
        listMaintenanceRequest: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listMaintenanceRequest.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.LOAD_MORE_LIST_STATUS_MAINTENANCE_REQUEST:
      return {
        ...state,
        listStatusMaintenanceRequest: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listStatusMaintenanceRequest.results, ...action.payload.results.results],
        },
      };

    case ActionTypes.SAVE_STATUS:
      return {
        ...state,
        status: action.payload.results,
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
