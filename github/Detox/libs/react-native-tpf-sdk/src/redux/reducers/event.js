import { EVENT } from '../actionsType';

const initialState = {
  highlightEvents: [],
  eventList: null,
  eventCount: 0,
  eventListPage: 0,
  eventListLoading: null,
  event: null
};

const event = (state = initialState, action) => {
  switch (action.type) {
    case EVENT.GET_EVENT_LIST.HANDLER: {
      return {
        ...state,
        eventListLoading: true
      };
    }

    case EVENT.GET_HIGHLIGHT_EVENT.SUCCESS: {
      return {
        ...state,
        highlightEvents: [...action.payload.items]
      };
    }

    case EVENT.GET_EVENT_LIST.SUCCESS: {
      const list = action.payload.items || [];

      if ([...list].length === 0) {
        return {
          ...state,
          eventListLoading: null
        };
      }

      if (state.eventList) {
        const newData = [...state.eventList, ...list];
        return {
          ...state,
          eventListLoading: false,
          eventList: newData,
          eventListPage: state.eventListPage + 1
        };
      }

      return {
        ...state,
        eventListLoading: false,
        eventList: [...list],
        eventListPage: state.eventListPage + 1
      };
    }

    case EVENT.GET_EVENT_DETAIL.SUCCESS: {
      return {
        ...state,
        event: action.payload.item
      };
    }

    case EVENT.GET_EVENT_LIST.CLEAR: {
      return {
        ...state,
        eventList: null,
        eventListPage: 0
      };
    }

    default:
      return state;
  }
};

export default event;
