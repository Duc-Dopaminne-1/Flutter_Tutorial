import { KPI, MASTER_DATA } from '../actionsType';

const initialState = {
  bank: [],
  region: [],

  // trigger list
  triggers: [],
  listTriggerLoading: false,

  // trigger flow
  action: '',
  flowTriggerLoading: false,
  trigger: null,

  categoryListFlow: [],
  totalCountCategoryListFlow: 0,

  categoryFlow: [],
  totalCountCategoryFlow: 0,

  productListFlow: [],
  totalCountProductListFlow: 0,

  becomeTopenerData: {},

  infoService: {},
  listTrigger: {}
};

const masterData = (state = initialState, action) => {
  switch (action.type) {
    case MASTER_DATA.GET_ALL.SUCCESS: {
      const { bank, region } = action.payload;
      return {
        ...state,
        bank,
        region
      };
    }

    case MASTER_DATA.GET_ALL_TRIGGER.HANDLER: {
      return {
        ...state,
        listTriggerLoading: true
      };
    }
    case MASTER_DATA.GET_ALL_TRIGGER.SUCCESS: {
      const { data } = action.payload;
      return {
        ...state,
        listTriggerLoading: false,
        triggers: data
      };
    }
    case MASTER_DATA.GET_ALL_TRIGGER.FAILURE: {
      return {
        ...state,
        listTriggerLoading: false
      };
    }
    case MASTER_DATA.GET_ALL_TRIGGER.CLEAR: {
      return {
        ...state,
        triggers: []
      };
    }

    case MASTER_DATA.GET_FLOW_BY_TRIGGER_CODE.HANDLER: {
      return {
        ...state,
        flowTriggerLoading: true
      };
    }
    case MASTER_DATA.GET_FLOW_BY_TRIGGER_CODE.SUCCESS: {
      const {
        loadMore,
        trigger,
        categoryListFlow,
        totalCountCategoryListFlow,
        productListFlow,
        totalCountProductListFlow
      } = action.payload;
      const newDataProductListFlow =
        loadMore && productListFlow !== undefined
          ? [...state.productListFlow, ...productListFlow]
          : productListFlow;
      const newDataCategoryListFlow =
        loadMore && categoryListFlow !== undefined
          ? [...state.categoryListFlow, ...categoryListFlow]
          : categoryListFlow;

      return {
        ...state,
        trigger: trigger,
        flowTriggerLoading: false,
        productListFlow: newDataProductListFlow,
        totalCountProductListFlow: totalCountProductListFlow,
        categoryListFlow: newDataCategoryListFlow,
        totalCountCategoryListFlow: totalCountCategoryListFlow,
        loadMore
      };
    }
    case MASTER_DATA.GET_FLOW_BY_TRIGGER_CODE.FAILURE: {
      return {
        ...state,
        flowTriggerLoading: false
      };
    }
    case MASTER_DATA.GET_FLOW_BY_TRIGGER_CODE.CLEAR: {
      return {
        ...state,
        categoryListFlow: [],
        categoryFlow: [],
        productListFlow: [],
        productFlow: []
      };
    }
    case MASTER_DATA.GET_BECOME_TOPENER.SUCCESS: {
      const { link, imageUrl } = action.payload;
      const newData = { link, imageUrl };
      return {
        ...state,
        becomeTopenerData: newData
      };
    }
    case MASTER_DATA.GET_INFO_SERVICE.HANDLER: {
      return {
        ...state,
        infoService: { ...state.infoService, loading: true }
      };
    }
    case MASTER_DATA.GET_INFO_SERVICE.SUCCESS: {
      return {
        ...state,
        infoService: { data: action?.payload, loading: false }
      };
    }
    case MASTER_DATA.GET_INFO_SERVICE.FAILURE: {
      return {
        ...state,
        infoService: { ...state.infoService, loading: false }
      };
    }

    case MASTER_DATA.GET_LIST_TRIGGER.HANDLER: {
      return {
        ...state,
        listTrigger: { ...state.listTrigger, loading: true }
      };
    }
    case MASTER_DATA.GET_LIST_TRIGGER.SUCCESS: {
      return {
        ...state,
        listTrigger: { data: action?.payload, loading: false }
      };
    }
    case MASTER_DATA.GET_LIST_TRIGGER.FAILURE: {
      return {
        ...state,
        listTrigger: { ...state.listTrigger, loading: false }
      };
    }

    default:
      return state;
  }
};

export default masterData;
