import { EXTRA_SERVICE } from '../actionsType';

const initialState = {
  orderMemo: {},
  list: [],
  loading: null,
  totalCount: 0,
  detail: {},
  orderForm: {},
  createOrderResult: null,
  updateStatusResult: null,
  orderDetail: null,
  orderList: [],
  endOrderList: false,
  orderListLoading: false,
  totalOrderSummary: {}
};

const extraService = (state = initialState, action) => {
  switch (action.type) {
    case EXTRA_SERVICE.SET_LEAD_CONTACT.SUCCESS: {
      return {
        ...state,
        orderMemo: action.payload
      };
    }
    case EXTRA_SERVICE.SET_LEAD_CONTACT.CLEAR: {
      return {
        ...state,
        orderMemo: {}
      };
    }

    case EXTRA_SERVICE.GET_PRODUCT_LIST.HANDLER: {
      return {
        ...state,
        loading: true
      };
    }

    case EXTRA_SERVICE.GET_PRODUCT_LIST.SUCCESS: {
      const { items, totalCount, loadMore } = action.payload;
      const newData = loadMore ? [...state.list, ...items] : items;

      return {
        ...state,
        loading: false,
        list: newData,
        totalCount
      };
    }

    case EXTRA_SERVICE.GET_PRODUCT_LIST.FAILURE: {
      return {
        ...state,
        loading: false
      };
    }
    case EXTRA_SERVICE.GET_PRODUCT_LIST.CLEAR: {
      return {
        ...state,
        list: [],
        totalCount: 0,
        loading: false
      };
    }

    case EXTRA_SERVICE.GET_PRODUCT_DETAIL.SUCCESS: {
      return {
        ...state,
        detail: action.payload.item
      };
    }
    case EXTRA_SERVICE.GET_PRODUCT_DETAIL.CLEAR: {
      return {
        ...state,
        detail: {}
      };
    }

    case EXTRA_SERVICE.GET_ORDER_FORM.SUCCESS: {
      return {
        ...state,
        orderForm: action.payload.data
      };
    }

    case EXTRA_SERVICE.CREATE_ORDER.SUCCESS: {
      return {
        ...state,
        createOrderResult: { ...action.payload.result, isSuccess: true }
      };
    }

    case EXTRA_SERVICE.CREATE_ORDER.FAILURE: {
      return {
        ...state,
        createOrderResult: { isError: true }
      };
    }

    case EXTRA_SERVICE.CREATE_ORDER.CLEAR: {
      return {
        ...state,
        createOrderResult: null
      };
    }

    case EXTRA_SERVICE.GET_ORDER_FORM.CLEAR: {
      return {
        ...state,
        orderForm: {}
      };
    }

    case EXTRA_SERVICE.GET_ORDER_LIST.HANDLER:
      return {
        ...state,
        orderListLoading: true
      };
    case EXTRA_SERVICE.GET_ORDER_LIST.SUCCESS: {
      const { items, skipCount, endList } = action.payload;
      const newData = skipCount > 0 ? [...state.orderList, ...items] : items;
      return {
        ...state,
        orderList: newData,
        endOrderList: endList,
        orderListLoading: false
      };
    }
    case EXTRA_SERVICE.GET_ORDER_LIST.FAILURE:
      return {
        ...state,
        orderListLoading: false
      };
    case EXTRA_SERVICE.GET_ORDER_LIST.CLEAR:
      return {
        ...state,
        orderList: []
      };

    case EXTRA_SERVICE.UPDATE_ORDER_STATUS.HANDLER:
      return {
        ...state
      };

    case EXTRA_SERVICE.UPDATE_ORDER_STATUS.SUCCESS: {
      return {
        ...state,
        updateStatusResult: {
          ...action.payload.item,
          isSuccess: true,
          status: action.payload.status
        }
      };
    }
    case EXTRA_SERVICE.UPDATE_ORDER_STATUS.FAILURE:
      return {
        ...state,
        updateStatusResult: { ...action.payload.item, isError: true }
      };
    case EXTRA_SERVICE.UPDATE_ORDER_STATUS.CLEAR:
      return {
        ...state,
        updateStatusResult: null
      };

    case EXTRA_SERVICE.GET_ORDER_DETAIL.HANDLER:
      return {
        ...state
      };
    case EXTRA_SERVICE.GET_ORDER_DETAIL.SUCCESS: {
      return {
        ...state,
        orderDetail: action.payload.item
      };
    }
    case EXTRA_SERVICE.GET_ORDER_DETAIL.FAILURE:
      return {
        ...state
      };
    case EXTRA_SERVICE.GET_ORDER_DETAIL.CLEAR:
      return {
        ...state,
        orderDetail: null
      };

    case EXTRA_SERVICE.GET_TOTAL_RECORD.SUCCESS: {
      return {
        ...state,
        totalOrderSummary: action.payload
      };
    }

    case EXTRA_SERVICE.GET_TOTAL_RECORD.CLEAR:
      return {
        ...state
      };

    case EXTRA_SERVICE.EDIT_ORDER.SUCCESS: {
      return {
        ...state,
        createOrderResult: { ...action.payload.result, isSuccess: true }
      };
    }

    case EXTRA_SERVICE.EDIT_ORDER.FAILURE: {
      return {
        ...state,
        createOrderResult: { isError: true }
      };
    }

    case EXTRA_SERVICE.GET_ADDED_ORDER_FORM_FOR_CREATE.SUCCESS: {
      return {
        ...state,
        orderForm: action.payload.data
      };
    }

    case EXTRA_SERVICE.GET_ADDED_ORDER_FORM_FOR_CREATE.CLEAR: {
      return {
        ...state,
        orderForm: {}
      };
    }

    default:
      return state;
  }
};

export default extraService;
