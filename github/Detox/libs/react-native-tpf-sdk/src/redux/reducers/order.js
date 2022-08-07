import { ORDER } from '../actionsType';

const initialState = {
  insuranceOrderList: [],
  endInsuranceOrderList: false,
  insuranceOrderDetail: {},
  insuranceOrderLoading: false,
  updateOrderResult: null,
  totalOrderSummary: {},
  deleteOrderResult: null
};

const order = (state = initialState, action) => {
  switch (action.type) {
    case ORDER.GET_ORDER_LIST.HANDLER: {
      return {
        ...state,
        insuranceOrderLoading: true
      };
    }

    case ORDER.GET_ORDER_LIST.SUCCESS: {
      const { items, skipCount, endList } = action.payload;
      const newData = skipCount > 0 ? [...state.insuranceOrderList, ...items] : items;

      return {
        ...state,
        insuranceOrderLoading: false,
        insuranceOrderList: newData,
        endInsuranceOrderList: endList
      };
    }

    case ORDER.GET_ORDER_LIST.FAILURE: {
      return {
        ...state,
        insuranceOrderLoading: false
      };
    }

    case ORDER.GET_ORDER_LIST.CLEAR: {
      return {
        ...state,
        insuranceOrderList: []
      };
    }

    case ORDER.GET_ORDER_DETAIL.HANDLER: {
      return {
        ...state,
        insuranceOrderLoading: true
      };
    }

    case ORDER.GET_ORDER_DETAIL.SUCCESS: {
      return {
        ...state,
        insuranceOrderLoading: false,
        insuranceOrderDetail: action.payload.item
      };
    }

    case ORDER.GET_ORDER_DETAIL.FAILURE: {
      return {
        ...state,
        insuranceOrderLoading: false
      };
    }

    case ORDER.GET_ORDER_DETAIL.CLEAR: {
      return {
        ...state,
        insuranceOrderDetail: null
      };
    }

    case ORDER.UPDATE_ORDER_STATUS.SUCCESS:
      return {
        ...state,
        updateOrderResult: action.payload
      };

    case ORDER.UPDATE_ORDER_STATUS.FAILURE:
      return {
        ...state,
        updateOrderResult: action.payload
      };

    case ORDER.UPDATE_ORDER_STATUS.CLEAR:
      return {
        ...state,
        updateOrderResult: null
      };

    case ORDER.GET_TOTAL_RECORD.SUCCESS: {
      return {
        ...state,
        totalOrderSummary: action.payload
      };
    }

    case ORDER.GET_TOTAL_RECORD.CLEAR:
      return {
        ...state
      };

    /**
     * Insurance Delete Order Form
     */

    case ORDER.DELETE_ORDER.SUCCESS:
      return {
        ...state,
        deleteOrderResult: action.payload
      };

    case ORDER.DELETE_ORDER.FAILURE:
      return {
        ...state,
        deleteOrderResult: action.payload
      };
    case ORDER.DELETE_ORDER.CLEAR:
      return {
        ...state,
        deleteOrderResult: null
      };

    default:
      return state;
  }
};

export default order;
