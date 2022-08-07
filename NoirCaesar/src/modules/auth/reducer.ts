import { ActionTypes, IAuthAction } from './index';
import moment from 'moment';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { IVideoModel } from '@src/models/media';
import { IEpisode } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { IUser, IPersonType } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import { CommonActionType } from '../base';

export interface IAuthState {
  tryAuthDone: boolean;
  logging: boolean;
  userData: IUser;
  isTokenRefreshing: boolean;
  lastTimeTokenRefreshed?: Date;
  listUserBook: IPagination<IBook>;
  listUserVideo: IPagination<IVideoModel>;
  listUserAudio: IPagination<IEpisode>;
  listPerson: IPersonType[]
}

const initialState: IAuthState = {
  tryAuthDone: false,
  logging: false,
  isTokenRefreshing: false,
  userData: {
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
  listPerson: []
};

const reducer = (state: IAuthState = initialState, action: IAuthAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_USER:
      return {
        ...state,
        logged: true,
        lastTimeTokenRefreshed: state.lastTimeTokenRefreshed || moment().toDate(),
        userData: action.payload.user,
      };
    case ActionTypes.SAVE_LIST_PERSON_TYPES:
      return {
        ...state,
        listPerson: action.payload,
      };
    case ActionTypes.REFRESH_TOKEN:
      return {
        ...state,
        isTokenRefreshing: true,
      };
    case ActionTypes.UPDATE_TOKEN:
      return {
        ...state,
        isTokenRefreshing: false,
        lastTimeTokenRefreshed: moment().toDate(),
      };
    case ActionTypes.SAVE_LIST_BOOK:
      return {
        ...state,
        listUserBook: action.payload.results,
      };
    case ActionTypes.SAVE_LOAD_MORE_LIST_BOOK:
      return {
        ...state,
        listUserBook: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listUserBook.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_VIDEO:
      return {
        ...state,
        listUserVideo: action.payload.results,
      };
    case ActionTypes.SAVE_LOAD_MORE_LIST_VIDEO:
      return {
        ...state,
        listUserVideo: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listUserVideo.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_AUDIO:
      return {
        ...state,
        listUserAudio: action.payload.results,
      };
    case ActionTypes.SAVE_LOAD_MORE_LIST_AUDIO:
      return {
        ...state,
        listUserAudio: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listUserAudio.results, ...action.payload.results.results],
        },
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
