import { SCHEDULE } from '../actionsType';
import SCREENS_NAME from '../../constants/screens';

const initialState = {
  scheduleList: [],
  scheduleCount: 0,
  scheduleListPage: 0,
  scheduleListLoading: null,
  schedule: null,
  scheduleListInLead: [],
  scheduleCountInLead: 0,
  scheduleListInLeadPage: 0,
  scheduleListInLeadLoading: null,
  scheduleListInFinance: [],
  scheduleInFinanceCount: 0,
  scheduleListInFinancePage: 0,
  scheduleListInFinanceLoading: null
};

function sortById(prev, next) {
  if (prev < next) {
    return -1;
  }
  if (prev > next) {
    return 1;
  }
  return 0;
}

const updateOrCreateSchedule = (list, payload, screen, count) => {
  const { schedule, from } = payload || {};
  const cloneList = list || [];
  const objIndex = cloneList.findIndex(obj => obj?.id === schedule?.id);
  if (objIndex !== -1) {
    cloneList[objIndex] = { ...cloneList[objIndex], ...schedule };
  } else {
    if (cloneList?.length === 0) {
      return { list: [...[schedule]], count: count++ };
    } else {
      if (screen === from) {
        return { list: [...cloneList.concat([schedule])], count: count++ };
      }
      return { list: [...cloneList], count };
    }
  }
  return { list: [...cloneList], count };
};

const deleteSchedule = (list, payload, screen) => {
  const { scheduleIds, from } = payload || {};
  const cloneList = list || [];
  if (screen !== from) {
    return { list: [...list] };
  } else {
    cloneList.sort(function (a, b) {
      return sortById(a?.id, b?.id);
    });
    scheduleIds.sort(function (a, b) {
      return sortById(a, b);
    });
    const firstIndex = cloneList.findIndex(obj => obj?.id === scheduleIds[0]);
    cloneList.splice(firstIndex, scheduleIds.length);
    return { list: [...cloneList] };
  }
};

const schedule = (state = initialState, action) => {
  switch (action.type) {
    case SCHEDULE.GET_LIST_IN_FINANCE.HANDLER: {
      return {
        ...state,
        scheduleListInFinanceLoading: true
      };
    }

    case SCHEDULE.GET_LIST_IN_FINANCE.SUCCESS: {
      const list = action.payload.items || [];

      if ([...list].length === 0) {
        return {
          ...state,
          scheduleListInFinanceLoading: null
        };
      }

      if (state.scheduleListInFinance.length !== 0) {
        const newData = [...state.scheduleListInFinance, ...list];
        return {
          ...state,
          scheduleListInFinanceLoading: false,
          scheduleListInFinance: newData,
          scheduleListInFinancePage: state.scheduleListInFinancePage + 1
        };
      }

      return {
        ...state,
        scheduleListInFinanceLoading: false,
        scheduleListInFinance: [...list],
        scheduleListInFinancePage: state.scheduleListInFinancePage + 1
      };
    }

    case SCHEDULE.GET_LIST_IN_FINANCE.CLEAR: {
      return {
        ...state,
        scheduleListInFinance: [],
        scheduleListInFinancePage: 0
      };
    }
    case SCHEDULE.GET_LIST_IN_LEAD.HANDLER: {
      return {
        ...state,
        scheduleListInLeadLoading: true
      };
    }

    case SCHEDULE.GET_LIST_IN_LEAD.SUCCESS: {
      const list = action.payload.items || [];

      if ([...list].length === 0) {
        return {
          ...state,
          scheduleListInLeadLoading: null
        };
      }

      if (state.scheduleListInLead.length !== 0) {
        const newData = [...state.scheduleListInLead, ...list];
        return {
          ...state,
          scheduleListInLeadLoading: false,
          scheduleListInLead: newData,
          scheduleListInLeadPage: state.scheduleListInLeadPage + 1
        };
      }

      return {
        ...state,
        scheduleListInLeadLoading: false,
        scheduleListInLead: [...list],
        scheduleListInLeadPage: state.scheduleListInLeadPage + 1
      };
    }

    case SCHEDULE.GET_LIST_IN_LEAD.CLEAR: {
      return {
        ...state,
        scheduleListInLead: [],
        scheduleListInLeadPage: 0
      };
    }
    case SCHEDULE.GET_LIST.HANDLER: {
      return {
        ...state,
        scheduleListLoading: true
      };
    }

    case SCHEDULE.GET_LIST.SUCCESS: {
      const list = action.payload.items || [];

      if ([...list].length === 0) {
        return {
          ...state,
          scheduleListLoading: null
        };
      }

      if (state.scheduleList.length !== 0) {
        const newData = [...state.scheduleList, ...list];
        return {
          ...state,
          scheduleListLoading: false,
          scheduleList: newData,
          scheduleListPage: state.scheduleListPage + 1
        };
      }

      return {
        ...state,
        scheduleListLoading: false,
        scheduleList: [...list],
        scheduleListPage: state.scheduleListPage + 1
      };
    }

    case SCHEDULE.GET_LIST.CLEAR: {
      return {
        ...state,
        scheduleList: [],
        scheduleListPage: 0
      };
    }

    case SCHEDULE.GET_DETAIL.SUCCESS: {
      return {
        ...state,
        schedule: action.payload
      };
    }

    case SCHEDULE.GET_DETAIL.CLEAR: {
      return {
        ...state,
        schedule: null
      };
    }

    case SCHEDULE.CREATE_OR_EDIT.SUCCESS: {
      return {
        ...state,
        scheduleList: updateOrCreateSchedule(
          state.scheduleList,
          action.payload,
          SCREENS_NAME.SCHEDULE_LIST_SCREEN
        ).list,
        scheduleListInLead: updateOrCreateSchedule(
          state.scheduleListInLead,
          action.payload,
          SCREENS_NAME.LEAD_DETAIL_SCREEN
        ).list,
        scheduleListInFinance: updateOrCreateSchedule(
          state.scheduleListInFinance,
          action.payload,
          SCREENS_NAME.CREDIT_ORDER_DETAIL_SCREEN
        ).list
      };
    }
    case SCHEDULE.DELETE.SUCCESS: {
      return {
        ...state,
        scheduleList: deleteSchedule(
          state.scheduleList,
          action.payload,
          SCREENS_NAME.SCHEDULE_LIST_SCREEN
        ).list,
        scheduleListInLead: deleteSchedule(
          state.scheduleListInLead,
          action.payload,
          SCREENS_NAME.LEAD_DETAIL_SCREEN
        ).list,
        scheduleListInFinance: deleteSchedule(
          state.scheduleListInFinance,
          action.payload,
          SCREENS_NAME.CREDIT_ORDER_DETAIL_SCREEN
        ).list
      };
    }
    case SCHEDULE.EXPORT_FILE.SUCCESS: {
      return {
        ...state
      };
    }
    default:
      return state;
  }
};

export default schedule;
