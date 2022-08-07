import { KPI } from '../actionsType';

const initialState = {
  listPersonal: [],
  loadingListPersonal: null,
  loadingPersonalKpiDetail: false,
  personalKpiDetail: [],
  listKpi: [],
  endKpiList: false,
  totalCountPersonalKpiStatus: 0,
  totalCountGroupKpiStatus: 0,
  groupKpiDetail: [],
  loadingGroupKpiDetail: false
};

const kpi = (state = initialState, action) => {
  switch (action.type) {
    case KPI.GET_PERSONAL_KPI_LIST.HANDLER: {
      return {
        ...state,
        loadingListPersonal: true
      };
    }
    case KPI.GET_PERSONAL_KPI_LIST.SUCCESS: {
      const { data, loadMore, endList } = action.payload;
      const newData = loadMore ? [...state.listKpi, ...data] : data;
      return {
        ...state,
        loadingListPersonal: false,
        listPersonal: newData,
        listKpi: newData,
        endKpiList: endList
      };
    }
    case KPI.GET_PERSONAL_KPI_LIST.FAILURE: {
      return {
        ...state,
        loadingListPersonal: false
      };
    }
    case KPI.GET_PERSONAL_KPI_DETAIL.HANDLER: {
      return {
        ...state,
        loadingPersonalKpiDetail: true
      };
    }
    case KPI.GET_PERSONAL_KPI_DETAIL.SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        loadingPersonalKpiDetail: false,
        personalKpiDetail: payload
      };
    }
    case KPI.GET_PERSONAL_KPI_DETAIL.FAILURE: {
      return {
        ...state,
        loadingPersonalKpiDetail: false
      };
    }
    case KPI.GET_PERSONAL_KPI_LIST.CLEAR: {
      return {
        ...state,
        listKpi: [],
        endKpiList: false
      };
    }

    case KPI.GET_GROUP_KPI_LIST.HANDLER: {
      return {
        ...state,
        listGroupLoading: true
      };
    }
    case KPI.GET_GROUP_KPI_LIST.SUCCESS: {
      const { data, loadMore, endList } = action.payload;
      const newData = loadMore ? [...state.listKpi, ...data] : data;
      return {
        ...state,
        listGroupLoading: false,
        listKpi: newData,
        endKpiList: endList
      };
    }
    case KPI.GET_GROUP_KPI_LIST.FAILURE: {
      return {
        ...state,
        listGroupLoading: false
      };
    }
    case KPI.GET_GROUP_KPI_LIST.CLEAR: {
      return {
        ...state,
        listKpi: [],
        endKpiList: false
      };
    }

    case KPI.GET_PERSONAL_KPI_STATUS_SUMARY.HANDLER: {
      return {
        ...state
      };
    }
    case KPI.GET_PERSONAL_KPI_STATUS_SUMARY.SUCCESS: {
      return {
        ...state,
        totalCountPersonalKpiStatus: action.payload.data
      };
    }
    case KPI.GET_PERSONAL_KPI_STATUS_SUMARY.FAILURE: {
      return {
        ...state
      };
    }

    case KPI.GET_GROUP_KPI_STATUS_SUMARY.HANDLER: {
      return {
        ...state
      };
    }
    case KPI.GET_GROUP_KPI_STATUS_SUMARY.SUCCESS: {
      return {
        ...state,
        totalCountGroupKpiStatus: action.payload.data
      };
    }
    case KPI.GET_GROUP_KPI_STATUS_SUMARY.FAILURE: {
      return {
        ...state
      };
    }

    case KPI.GET_GROUP_KPI_DETAIL.HANDLER: {
      return {
        ...state,
        loadingGroupKpiDetail: true
      };
    }
    case KPI.GET_GROUP_KPI_DETAIL.SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        groupKpiDetail: payload,
        loadingGroupKpiDetail: false
      };
    }
    case KPI.GET_GROUP_KPI_DETAIL.FAILURE: {
      return {
        ...state,
        loadingGroupKpiDetail: false
      };
    }
    default:
      return state;
  }
};

export default kpi;
