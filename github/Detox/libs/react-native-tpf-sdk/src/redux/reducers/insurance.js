import { INSURANCE } from '../actionsType';

const initialState = {
  leadId: null,
  contactId: null,
  highlightInsuranceCategory: [],
  insuranceCategoriesList: [],
  insuranceCategoriesTotalCount: 0,
  insuranceCategoriesLoading: false,
  insuranceByCategoryLoading: false,
  insuranceProduct: {},
  insuranceProductCount: {},
  insuranceProductDetail: {},
  insuranceOrderForm: {},
  insuranceCreateOrEditOrderResult: {},
  insuranceListResponses: [],
  insuranceListResponsesLoading: false,
  depositMoney: 0,
  depositMethod: {},
  expectedDepositRefundCompleted: 0,
  insuranceOrderFormCreate: {},
  insuranceOrderFormEdit: {}
};

const insuranceReducer = (state = initialState, action) => {
  switch (action.type) {
    case INSURANCE.GET_LIST_RESPONSES.FAILURE: {
      return {
        ...state,
        insuranceListResponsesLoading: false
      };
    }
    case INSURANCE.GET_LIST_RESPONSES.HANDLER: {
      return {
        ...state,
        insuranceListResponsesLoading: true
      };
    }
    case INSURANCE.GET_LIST_RESPONSES.SUCCESS: {
      return {
        ...state,
        insuranceListResponses: action.payload,
        insuranceListResponsesLoading: false
      };
    }
    case INSURANCE.GET_LIST_RESPONSES.CLEAR: {
      return {
        ...state,
        insuranceListResponses: []
      };
    }
    case INSURANCE.SET_LEAD_CONTACT.SUCCESS: {
      const info = action.payload || {};
      return {
        ...state,
        ...info
      };
    }
    case INSURANCE.SET_LEAD_CONTACT.CLEAR: {
      return {
        ...state,
        leadId: null,
        contactId: null
      };
    }
    /**
     * Insurance Categories
     */
    case INSURANCE.GET_INSURANCE_CATEGORIES.HANDLER:
      return {
        ...state,
        insuranceCategoriesLoading: true
      };

    case INSURANCE.GET_INSURANCE_CATEGORIES.SUCCESS: {
      const tempCategoriesList = action.payload.loadMore
        ? [...state.insuranceCategoriesList, ...action.payload.items]
        : [...action.payload.items];

      return {
        ...state,
        insuranceCategoriesList: tempCategoriesList,
        insuranceCategoriesTotalCount: action.payload.totalCount,
        insuranceCategoriesLoading: false
      };
    }

    case INSURANCE.GET_INSURANCE_CATEGORIES.FAILURE: {
      return {
        ...state,
        insuranceCategoriesLoading: false
      };
    }

    case INSURANCE.GET_INSURANCE_CATEGORIES.CLEAR:
      return {
        ...state,
        insuranceCategoriesList: [],
        insuranceCategoriesTotalCount: 0
      };

    /**
     * Insurance Product By Category
     */
    case INSURANCE.GET_INSURANCE_BY_CATEGORY.HANDLER:
      return {
        ...state,
        insuranceByCategoryLoading: true
      };

    case INSURANCE.GET_INSURANCE_BY_CATEGORY.SUCCESS: {
      const { categoryId, items, totalCount, loadMore } = action.payload;
      const oldList = state.insuranceProduct['' + categoryId];

      let newList = loadMore ? [...oldList, ...items] : [...items];

      let newInsuranceProduct = { ...state.insuranceProduct };
      newInsuranceProduct['' + categoryId] = newList;
      let newInsuranceProductCount = { ...state.insuranceProductCount };
      newInsuranceProductCount['' + categoryId] = totalCount;

      return {
        ...state,
        insuranceProduct: newInsuranceProduct,
        insuranceProductCount: newInsuranceProductCount,
        insuranceByCategoryLoading: false
      };
    }

    case INSURANCE.GET_INSURANCE_BY_CATEGORY.FAILURE: {
      return {
        ...state,
        insuranceByCategoryLoading: false
      };
    }

    case INSURANCE.GET_INSURANCE_BY_CATEGORY.CLEAR:
      return {
        ...state,
        insuranceProduct: {},
        insuranceProductCount: {},
        insuranceByCategoryLoading: false
      };

    /**
     * Highlight Insurance Product
     */
    case INSURANCE.GET_HIGHLIGHT_INSURANCE_CATEGORIES.HANDLER:
      return {
        ...state
      };
    case INSURANCE.GET_HIGHLIGHT_INSURANCE_CATEGORIES.SUCCESS: {
      return {
        ...state,
        highlightInsuranceCategory: action.payload.items
      };
    }

    /**
     * Insurance Product Detail
     */

    case INSURANCE.GET_INSURANCE_DETAIL.SUCCESS:
      return {
        ...state,
        insuranceProductDetail: action.payload
      };
    case INSURANCE.GET_INSURANCE_DETAIL.CLEAR:
      return {
        ...state,
        insuranceProductDetail: {}
      };

    /**
     * Insurance Order Form
     */

    case INSURANCE.GET_INSURANCE_ORDER_FORM.SUCCESS:
      return {
        ...state,
        insuranceOrderForm: action.payload
      };
    case INSURANCE.GET_INSURANCE_ORDER_FORM.CLEAR:
      return {
        ...state,
        insuranceOrderForm: {}
      };

    case INSURANCE.GET_INSUARANCE_REFUND_CONFIG.SUCCESS: {
      const data = action.payload.rs || {};

      return {
        ...state,
        depositMoney: data.depositeValue,
        expectedDepositRefundCompleted: data.expectedDepositRefundCompleted,
        depositMethod: data.depositMethod
      };
    }

    case INSURANCE.CREATE_INSURANCE_ORDER.SUCCESS:
      return {
        ...state,
        insuranceCreateOrEditOrderResult: action.payload
      };

    case INSURANCE.CREATE_INSURANCE_ORDER.FAILURE:
      return {
        ...state,
        insuranceCreateOrEditOrderResult: action.payload
      };

    case INSURANCE.CREATE_INSURANCE_ORDER.CLEAR:
      return {
        ...state,
        insuranceCreateOrEditOrderResult: null
      };

    case INSURANCE.EDIT_INSURANCE_ORDER.SUCCESS:
      return {
        ...state,
        insuranceCreateOrEditOrderResult: action.payload
      };

    case INSURANCE.EDIT_INSURANCE_ORDER.FAILURE:
      return {
        ...state,
        insuranceCreateOrEditOrderResult: action.payload
      };

    /**
     * Insurance Order Form Create
     */

    case INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_CREATE.SUCCESS:
      return {
        ...state,
        insuranceOrderFormCreate: action.payload
      };
    case INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_CREATE.CLEAR:
      return {
        ...state,
        insuranceOrderFormCreate: {}
      };

    /**
     * Insurance Order Form Edit
     */

    case INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_EDIT.SUCCESS:
      return {
        ...state,
        insuranceOrderFormEdit: action.payload
      };
    case INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_EDIT.CLEAR:
      return {
        ...state,
        insuranceOrderFormEdit: {}
      };

    default:
      return state;
  }
};

export default insuranceReducer;
