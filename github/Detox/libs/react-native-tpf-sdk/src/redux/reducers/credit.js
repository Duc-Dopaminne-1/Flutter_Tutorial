import { CREDIT, INSURANCE } from '../actionsType';

const initialState = {
  orderMemo: {},
  list: null,
  totalCount: 0,
  loading: null,
  listCategory: [],
  loanDetail: {},
  productFilter: {},
  financeDealOrderForm: {},
  createOrEditResult: null,
  orderList: [],
  orderListLoading: false,
  endOrderList: false,
  feedbackList: [],
  compareProducts: [],
  action: '',
  credit: {},
  confirmRefundRequest: {
    isSuccess: false
  },
  deleteDealSuccess: false,
  totalOrderSummary: {},
  isNeedSupport: false,
  isMyDeal: false,
  creditByCategoryLoading: false,
  creditProduct: {},
  creditProductCount: {}
};

const credit = (state = initialState, action) => {
  switch (action.type) {
    case CREDIT.SET_LEAD_CONTACT.SUCCESS: {
      const info = action.payload || {};
      return {
        ...state,
        orderMemo: info
      };
    }
    case CREDIT.SET_LEAD_CONTACT.CLEAR: {
      return {
        ...state,
        orderMemo: {}
      };
    }
    case CREDIT.SET_PRODUCT_FILTER.SUCCESS: {
      return {
        ...state,
        productFilter: action.payload
      };
    }
    case CREDIT.SET_PRODUCT_FILTER.CLEAR: {
      return {
        ...state,
        productFilter: {}
      };
    }

    case CREDIT.GET_LOAN_PRODUCT_LIST.HANDLER: {
      return {
        ...state,
        loading: true
      };
    }

    case CREDIT.GET_LOAN_PRODUCT_LIST.SUCCESS: {
      const { items, totalCount, loadMore } = action.payload;
      const newData = loadMore ? [...state.list, ...items] : items;
      return {
        ...state,
        list: newData,
        totalCount: totalCount,
        loading: false
      };
    }

    case CREDIT.GET_LOAN_PRODUCT_LIST.FAILURE: {
      return {
        ...state,
        loading: false
      };
    }

    case CREDIT.GET_ALL_CATEGORY.SUCCESS: {
      return {
        ...state,
        listCategory: action.payload.data
      };
    }

    case CREDIT.GET_LOAN_PRODUCT_DETAIL.SUCCESS: {
      return {
        ...state,
        loanDetail: action.payload.data
      };
    }

    case CREDIT.GET_LOAN_PRODUCT_DETAIL.CLEAR: {
      return {
        ...state,
        loanDetail: {}
      };
    }

    case CREDIT.GET_LOAN_PRODUCT_LIST.CLEAR: {
      return {
        ...state,
        list: null,
        page: 0
      };
    }

    /**
     * FinanceDeal Order Form
     */

    case CREDIT.GET_FINANCEDEAL_ORDER_FORM.SUCCESS:
      return {
        ...state,
        financeDealOrderForm: action.payload
      };
    case CREDIT.GET_FINANCEDEAL_ORDER_FORM.CLEAR:
      return {
        ...state,
        financeDealOrderForm: {}
      };

    case CREDIT.GET_ORDER_LIST.HANDLER:
      return {
        ...state,
        orderListLoading: true
      };
    case CREDIT.GET_ORDER_LIST.SUCCESS: {
      const { items, skipCount, endList } = action.payload;
      const newData = skipCount > 0 ? [...state.orderList, ...items] : items;

      return {
        ...state,
        orderList: newData,
        endOrderList: endList,
        orderListLoading: false
      };
    }
    case CREDIT.GET_ORDER_LIST.FAILURE:
      return {
        ...state,
        orderListLoading: false
      };
    case CREDIT.GET_ORDER_LIST.CLEAR:
      return {
        ...state,
        orderList: [],
        endOrderList: false
      };

    case CREDIT.GET_LIST_RESPONSES.SUCCESS: {
      return {
        ...state,
        feedbackList: action.payload.data,
        feedbackLoading: false
      };
    }

    case CREDIT.COMPARE_PRODUCTS.SUCCESS: {
      return {
        ...state,
        compareProducts: action.payload.data,
        action: action.payload.action
      };
    }

    case CREDIT.COMPARE_PRODUCTS.CLEAR: {
      return {
        ...state,
        compareProducts: [],
        action: ''
      };
    }

    case CREDIT.GET_TOTAL_RECORD.SUCCESS: {
      return {
        ...state,
        totalOrderSummary: action.payload
      };
    }

    case CREDIT.GET_TOTAL_RECORD.CLEAR:
      return {
        ...state
      };

    case CREDIT.DELETE_DEAL.SUCCESS:
      return {
        ...state,
        deleteDealSuccess: true
      };

    case CREDIT.DELETE_DEAL.FAILURE:
      return {
        ...state,
        deleteDealSuccess: false
      };

    case CREDIT.NEED_SUPPORT.SUCCESS:
      return {
        ...state,
        isNeedSupport: action.payload.isNeedSupport,
        isMyDeal: action.payload.action
      };
    case CREDIT.NEED_SUPPORT.CLEAR:
      return {
        ...state,
        isNeedSupport: false,
        isMyDeal: false
      };

    case CREDIT.GET_CREDIT_BY_CATEGORY.HANDLER:
      return {
        ...state,
        creditByCategoryLoading: true
      };

    case CREDIT.GET_CREDIT_BY_CATEGORY.SUCCESS: {
      const { categoryId, items, totalCount, loadMore } = action.payload;
      const oldList = state.creditProduct['' + categoryId];

      let newList = loadMore ? [...oldList, ...items] : [...items];

      let newCreditProduct = { ...state.creditProduct };
      newCreditProduct['' + categoryId] = newList;
      let newCreditProductCount = { ...state.creditProductCount };
      newCreditProductCount['' + categoryId] = totalCount;

      return {
        ...state,
        creditProduct: newCreditProduct,
        creditProductCount: newCreditProductCount,
        creditByCategoryLoading: false
      };
    }

    case CREDIT.GET_CREDIT_BY_CATEGORY.FAILURE: {
      return {
        ...state,
        creditByCategoryLoading: false
      };
    }

    case CREDIT.GET_CREDIT_BY_CATEGORY.CLEAR:
      return {
        ...state,
        creditProduct: {},
        creditProductCount: {},
        creditByCategoryLoading: false
      };

    // CREATE DEAL

    case CREDIT.CREATE_FINANE_DEAL_ORDER.SUCCESS:
      return {
        ...state,
        financeDealOrderForm: action.payload.resultForm,
        createOrEditResult: {
          isSuccess: true,
          action: action.payload.action,
          orderId: action.payload.resultForm.id,
          step: action.payload.step
        }
      };

    case CREDIT.CREATE_FINANE_DEAL_ORDER.FAILURE:
      return {
        ...state,
        createOrEditResult: { isError: true }
      };

    case CREDIT.CREATE_FINANE_DEAL_ORDER.CLEAR:
      return {
        ...state,
        createOrEditResult: null
      };

    // EDIT DEAL
    case CREDIT.EDIT_DEAL.SUCCESS:
      return {
        ...state,
        financeDealOrderForm: action.payload.resultForm,
        createOrEditResult: {
          isSuccess: true,
          action: action.payload.action,
          orderId: action.payload.resultForm.id,
          step: action.payload.step
        }
      };
    case CREDIT.EDIT_DEAL.FAILURE:
      return {
        ...state,
        createOrEditResult: { isError: true }
      };

    case CREDIT.GET_CREATE_DEAL_ORDER_FORM.SUCCESS:
      return {
        ...state,
        financeDealOrderForm: action.payload
      };
    case CREDIT.GET_CREATE_DEAL_ORDER_FORM.CLEAR:
      return {
        ...state,
        financeDealOrderForm: {}
      };

    case CREDIT.DELETE_FINANE_DEAL_ORDER.SUCCESS:
      return {
        ...state,
        createOrEditResult: {
          isSuccess: true,
          action: action.payload.action
        }
      };

    case CREDIT.DELETE_FINANE_DEAL_ORDER.FAILURE:
      return {
        ...state,
        createOrEditResult: { isError: true }
      };

    default:
      return state;
  }
};

export default credit;
