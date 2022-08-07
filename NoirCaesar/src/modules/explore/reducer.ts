import { ActionTypes, IExploreState, IActionExplore } from './index';
import { CommonActionType } from '../base';

const initialState: IExploreState = {
  listEpisode: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listExplore: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listSlider: []
};

const reducer = (state: IExploreState = initialState, action: IActionExplore) => {
  switch (action.type) {
    case ActionTypes.SAVE_EPISODE_LIST:
      return {
        ...state,
        listEpisode: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_EPISODE_LIST:
      return {
        ...state,
        listEpisode: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listEpisode.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_EXPLORE_LIST:
      return {
        ...state,
        listExplore: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_EXPLORE_LIST:
      return {
        ...state,
        listExplore: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listExplore.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.CLEAR_EXPLORE_LIST:
      return {
        ...state,
        listExplore: {
          count: 0,
          next: '',
          previous: '',
          results: [],
        },
      };
    case ActionTypes.SAVE_EXPLORE_SLIDER:
      return {
        ...state,
        listSlider: action.payload.results,
      }
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
