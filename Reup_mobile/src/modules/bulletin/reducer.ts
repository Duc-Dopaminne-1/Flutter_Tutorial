import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompanyBulletinBoardNotification } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/notification/models';
import { IActionBulletin, ActionTypes } from './index';
import { CommonActionType } from '../auth';
import { ICompanyBulletinBoardForLease } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-lease/models';
import { ICompanyBulletinBoardForSale } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-sale/models';
import { IExpense } from '@reup/reup-api-sdk/libs/api/bulletin/expense/model';
import { IResidentBulletinBoardForLease } from '@reup/reup-api-sdk/libs/api/resident/bulletin/for-lease/models';
import { IResidentBulletinBoardForSale } from '@reup/reup-api-sdk/libs/api/resident/bulletin/for-sale/models';

export interface ITotalMonthlyBill {
  electric_fee: number;
  water_fee: number;
  telecom_fee: number;
  service_fee: number;
  total: number
}

export enum BillType {
  Electric_Fee,
  Water_Fee,
  Telecom_Fee,
  Service_Fee,
  Total,
}

export interface IBulletinState {
  listNotification: IPagination<ICompanyBulletinBoardNotification>;
  listForLease: IPagination<ICompanyBulletinBoardForLease | IResidentBulletinBoardForLease>;
  listForSale: IPagination<ICompanyBulletinBoardForSale | IResidentBulletinBoardForSale>;
  listMonthlyBill: IPagination<IExpense>;
  totalMonthlyBill: ITotalMonthlyBill
}
const getTotalMonthlyBill = (items: IExpense[], billType: BillType) => {
  let total = 0;
  items.forEach(item => {
    switch (billType) {
      case BillType.Electric_Fee:
        total += item.electric_fee;
        break;
      case BillType.Service_Fee:
        total += item.service_fee;
        break;
      case BillType.Telecom_Fee:
        total += item.telecom_fee;
        break;
      case BillType.Total:
        total += item.total;
        break;
      case BillType.Water_Fee:
        total += item.water_fee;
        break;
    }
  });
  return total;
};

const initialState: IBulletinState = {
  listNotification: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listForLease: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listForSale: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listMonthlyBill: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  totalMonthlyBill: {
    electric_fee: 0,
    service_fee: 0,
    telecom_fee: 0,
    water_fee: 0,
    total: 0
  }
};

const reducer = (state: IBulletinState = initialState, action: IActionBulletin) => {
  switch (action.type) {
    case ActionTypes.SAVE_NOTIFICATIONS:
      return {
        ...state,
        listNotification: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_NOTIFICATIONS:
      return {
        ...state,
        listNotification: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listNotification.results, ...action.payload.results.results],
        },
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    case ActionTypes.SAVE_LIST_FOR_LEASE:
      return {
        ...state,
        listForLease: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_FOR_LEASE:
      return {
        ...state,
        listForLease: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listForLease.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_FOR_SALE:
      return {
        ...state,
        listForSale: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_FOR_SALE:
      return {
        ...state,
        listForSale: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listForSale.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_MONTHLY_BILLS:
      return {
        ...state,
        listMonthlyBill: action.payload.results,
        totalMonthlyBill: {
          electric_fee: getTotalMonthlyBill(action.payload.results.results, BillType.Electric_Fee),
          service_fee: getTotalMonthlyBill(action.payload.results.results, BillType.Service_Fee),
          telecom_fee: getTotalMonthlyBill(action.payload.results.results, BillType.Telecom_Fee),
          water_fee: getTotalMonthlyBill(action.payload.results.results, BillType.Water_Fee),
          total: getTotalMonthlyBill(action.payload.results.results, BillType.Total)
        }
      };
    case ActionTypes.LOAD_MORE_MONTHLY_BILLS:
      const { count, next, previous, results } = action.payload.results;
      return {
        ...state,
        listMonthlyBill: {
          count: count,
          next: next,
          previous: previous,
          results: [...state.listMonthlyBill.results, ...results],
        },
        totalMonthlyBill: {
          electric_fee: getTotalMonthlyBill([...state.listMonthlyBill.results, ...results], BillType.Electric_Fee),
          service_fee: getTotalMonthlyBill([...state.listMonthlyBill.results, ...results], BillType.Service_Fee),
          telecom_fee: getTotalMonthlyBill([...state.listMonthlyBill.results, ...results], BillType.Telecom_Fee),
          water_fee: getTotalMonthlyBill([...state.listMonthlyBill.results, ...results], BillType.Water_Fee),
          total: getTotalMonthlyBill([...state.listMonthlyBill.results, ...results], BillType.Total)
        }
      };
    default:
      return state;
  }
};

export default reducer;
