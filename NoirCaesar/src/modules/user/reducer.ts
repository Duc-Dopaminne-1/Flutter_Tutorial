import { ActionTypes, IActionUser, IListUserState, IUserState } from './index';
import { CommonActionType } from '../base';

const initialState: IUserState = {
  profileDetail: {
    user_id: '',
    username: '',
    email: '',
    avatar: '',
    total_follower: 0,
    total_following: 0,
    is_follow: false,
    subscription: false,
    notifications: false,
  },
  listUserBook: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listUserVideo: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listUserAudio: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
};

const reducer = (state: IListUserState = {}, action: IActionUser) => {
  switch (action.type) {
    case ActionTypes.SAVE_PROFILE_DETAIL:
    case ActionTypes.SAVE_USER_LIST_BOOK:
    case ActionTypes.SAVE_LOAD_MORE_USER_LIST_BOOK:
    case ActionTypes.SAVE_USER_LIST_VIDEO:
    case ActionTypes.SAVE_LOAD_MORE_USER_LIST_VIDEO:
    case ActionTypes.SAVE_USER_LIST_AUDIO:
    case ActionTypes.SAVE_LOAD_MORE_USER_LIST_AUDIO:
      return {
        ...state,
        [action.payload.user_id]: handleReducer(state[action.payload.user_id], action),
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
}

const handleReducer = (state: IUserState = initialState, action: IActionUser) => {
  switch (action.type) {
    case ActionTypes.SAVE_PROFILE_DETAIL:
      return {
        ...state,
        profileDetail: action.payload.profileDetail
      }
    case ActionTypes.SAVE_USER_LIST_BOOK:
      return {
        ...state,
        listUserBook: action.payload.results,
      };
    case ActionTypes.SAVE_LOAD_MORE_USER_LIST_BOOK:
      return {
        ...state,
        listUserBook: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listUserBook.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_USER_LIST_VIDEO:
      return {
        ...state,
        listUserVideo: action.payload.results,
      };
    case ActionTypes.SAVE_LOAD_MORE_USER_LIST_VIDEO:
      return {
        ...state,
        listUserVideo: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listUserVideo.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_USER_LIST_AUDIO:
      return {
        ...state,
        listUserAudio: action.payload.results,
      };
    case ActionTypes.SAVE_LOAD_MORE_USER_LIST_AUDIO:
      return {
        ...state,
        listUserAudio: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listUserAudio.results, ...action.payload.results.results],
        },
      };
    default:
      return state;
  }
};

export default reducer;
