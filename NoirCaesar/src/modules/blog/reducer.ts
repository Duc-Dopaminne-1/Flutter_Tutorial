import { ActionTypes, IActionComments, IBlogState } from './index';
import { CommonActionType } from '../base';

const initialState: IBlogState = {
  sliders: [],
  blogList: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  detail: {
    id: '',
    name: '',
  },
};

const reducer = (state: IBlogState = initialState, action: IActionComments) => {
  switch (action.type) {
    case ActionTypes.SAVE_SLIDERS:
      return {
        ...state,
        sliders: action.payload.results,
      };
    case ActionTypes.SAVE_BLOG:
      return {
        ...state,
        blogList: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_BLOG:
      return {
        ...state,
        blogList: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.blogList.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_BLOG_DETAIL:
      return {
        ...state,
        detail: action.payload.results,
      };
    case ActionTypes.RESET_BLOG_DETAIL:
      return {
        ...state,
        detail: initialState,
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
