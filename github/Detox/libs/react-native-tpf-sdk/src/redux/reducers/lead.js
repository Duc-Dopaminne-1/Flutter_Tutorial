import { LEAD } from '../actionsType';

const initialState = {
  list: [],
  totalCount: 0,
  loading: null,
  lead: {},
  getLeadDetailSuccess: null,
  createEditLeadSuccess: null,
  deleteLeadResult: null,
  totalCountLeadStatus: 0,
  endLeadList: false,
  leadList: {}
};

const lead = (state = initialState, action) => {
  switch (action.type) {
    case LEAD.GET_LEAD_LIST.HANDLER: {
      return {
        ...state,
        loading: true
      };
    }

    case LEAD.GET_LEAD_LIST.SUCCESS: {
      const { items, totalCount, loadMore, endList, tabIndex } = action.payload;
      const newData = loadMore ? [...state.list, ...items] : items;
      return {
        ...state,
        loading: false,
        list: newData,
        leadList: {
          ...state.leadList,
          [tabIndex]: newData
        },
        endLeadList: endList,
        totalCount
      };
    }
    case LEAD.GET_LEAD_LIST.FAILURE: {
      return {
        ...state,
        loading: false
      };
    }
    case LEAD.GET_LEAD_LIST.CLEAR: {
      return {
        ...state,
        list: [],
        endLeadList: false
      };
    }
    case LEAD.GET_LEAD_DETAIL.HANDLER: {
      return {
        ...state,
        lead: {},
        getLeadDetailSuccess: null,
        createEditLeadSuccess: null
      };
    }
    case LEAD.GET_LEAD_DETAIL.SUCCESS: {
      return {
        ...state,
        lead: action.payload.item,
        getLeadDetailSuccess: true
      };
    }
    case LEAD.GET_LEAD_DETAIL.FAILURE: {
      return {
        ...state,
        lead: {},
        getLeadDetailSuccess: false
      };
    }
    case LEAD.GET_LEAD_DETAIL.CLEAR: {
      return {
        ...state,
        lead: {},
        getLeadDetailSuccess: null,
        createEditLeadSuccess: null
      };
    }
    case LEAD.CREATE_OR_EDIT.HANDLER: {
      return {
        ...state,
        createEditLeadSuccess: null
      };
    }
    case LEAD.CREATE_OR_EDIT.SUCCESS: {
      return {
        ...state,
        createEditLeadSuccess: true,
        lead: action.payload.item
      };
    }
    case LEAD.CREATE_OR_EDIT.FAILURE: {
      return {
        ...state,
        createEditLeadSuccess: false
      };
    }
    case LEAD.CREATE_OR_EDIT.CLEAR: {
      return {
        ...state,
        createEditLeadSuccess: null
      };
    }

    case LEAD.DELETE_LEAD.HANDLER: {
      return {
        ...state,
        deleteLeadResult: null
      };
    }
    case LEAD.DELETE_LEAD.SUCCESS: {
      return {
        ...state,
        deleteLeadResult: action.payload
      };
    }
    case LEAD.DELETE_LEAD.FAILURE: {
      return {
        ...state,
        deleteLeadResult: action.payload
      };
    }
    case LEAD.DELETE_LEAD.CLEAR: {
      return {
        ...state,
        deleteLeadResult: null
      };
    }

    case LEAD.GET_LEAD_STATUS_SUMMARY.HANDLER: {
      return {
        ...state
      };
    }

    case LEAD.GET_LEAD_STATUS_SUMMARY.SUCCESS: {
      return {
        ...state,
        totalCountLeadStatus: action.payload.data
      };
    }
    case LEAD.GET_LEAD_STATUS_SUMMARY.FAILURE: {
      return {
        ...state
      };
    }

    default:
      return state;
  }
};

export default lead;
