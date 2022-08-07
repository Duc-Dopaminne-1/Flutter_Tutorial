import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IEvent } from '@reup/reup-api-sdk/libs/api/calendar/event/models';
import { ICalendarAction, ActionTypes } from './index';
import { CommonActionType } from '../auth';

export interface ICalendarState {
  listEvent: IPagination<IEvent>;
}

const initialState: ICalendarState = {
  listEvent: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
};

const reducer = (state: ICalendarState = initialState, action: ICalendarAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_LIST_EVENT:
      return {
        ...state,
        listEvent: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_LIST_EVENT:
      return {
        ...state,
        listEvent: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listEvent.results, ...action.payload.results.results],
        },
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
