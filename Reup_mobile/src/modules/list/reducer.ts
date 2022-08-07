import { ActionTypes, IListAction, IListItemState, IListState } from './interface';
import _ from 'lodash';
import { LimitLoadMore } from '@src/constants/vars';

export const initialListState: IListItemState = {
  inited: false,
  data: [],
  pageNumber: 1,
  limit: LimitLoadMore,
  loading: false,
  refreshing: false,
  canLoadMore: true,
  error: null,
};

const initialState: IListState = {};

const itemReducer = (state: IListItemState = initialListState, action: IListAction): IListItemState => {
  switch (action.type) {
    case ActionTypes.LIST_INIT:
      return {
        ...initialListState,
        inited: true,
        limit: action.payload.limit,
        onLoad: action.payload.onLoad,
      };
    case ActionTypes.LIST_LOAD_REQUEST:
      return {
        ...state,
        loading: !action.payload.isRefresh,
        refreshing: Boolean(action.payload.isRefresh),
        error: null,
      };
    case ActionTypes.LIST_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        refreshing: false,
        data: action.payload.isRefresh ? action.payload.data : _.union([...state.data, ...action.payload.data]),
        canLoadMore: action.payload.canLoadMore,
        pageNumber: action.payload.isRefresh ? 1 : state.pageNumber + 1,
      };
    case ActionTypes.LIST_LOAD_FAILURE:
      return {
        ...state,
        loading: false,
        refreshing: false,
        error: action.payload.error,
        canLoadMore: false,
      };
    case ActionTypes.LIST_ADD_ITEM:
      return {
        ...state,
        data: _.union([action.payload.id, ...state.data]),
      };
    case ActionTypes.LIST_REMOVE_ITEM:
      return {
        ...state,
        data: state.data.filter(item => item !== action.payload.id),
      };
    case ActionTypes.LIST_CLEAR:
      return initialListState;
    case ActionTypes.LOGOUT:
    default: {
      return state;
    }
  }
};

export const reducer = (state: IListState = initialState, action: IListAction): IListState => {
  switch (action.type) {
    case ActionTypes.LIST_INIT:
      return {
        ...state,
        [action.payload.listName]: itemReducer(state[action.payload.listName], action),
      };
    case ActionTypes.LIST_LOAD_REQUEST:
    case ActionTypes.LIST_LOAD_SUCCESS:
    case ActionTypes.LIST_LOAD_FAILURE:
    case ActionTypes.LIST_ADD_ITEM:
    case ActionTypes.LIST_REMOVE_ITEM:
    case ActionTypes.LIST_CLEAR:
      if (action.payload.listName === '*') {
        return {
          ...Object.keys(state).reduce((prevValue: IListState, current: string) => {
            return {
              ...prevValue,
              [current]: itemReducer(state[current], action),
            };
          }, {}),
        };
      }
      if (state[action.payload.listName]) {
        return {
          ...state,
          [action.payload.listName]: itemReducer(state[action.payload.listName], action),
        };
      }
      return state;
    case ActionTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
