import { ActionTypes, IActionLibraries } from './index';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { CommonActionType } from '../base';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { IEpisode, IStory } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';

export interface ILibraryState {
  purchased: IPagination<IBook | IEpisode | IStory>;
  favorites: IPagination<IBook | IEpisode | IStory>;
}

const initialState: ILibraryState = {
  purchased: {
    count: 0,
    results: []
  },
  favorites: {
    count: 0,
    results: []
  }
};

const reducer = (state: ILibraryState = initialState, action: IActionLibraries) => {
  switch (action.type) {
    case ActionTypes.SAVE_LIST_FAVORITES:
      return {
        ...state,
        favorites: action.payload.favorites
      }
    case ActionTypes.LOAD_MORE_LIST_FAVORITES:
      return {
        ...state,
        favorites: {
          ...action.payload.favorites,
          results: [...state.favorites.results, ...action.payload.favorites.results]
        }
      }
    case ActionTypes.SAVE_LIST_PURCHASE:
      return {
        ...state,
        purchased: action.payload.purchased
      }
    case ActionTypes.LOAD_MORE_LIST_PURCHASE:
      return {
        ...state,
        purchased: {
          ...action.payload.purchased,
          results: [...state.purchased.results, ...action.payload.purchased.results]
        }
      }
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
