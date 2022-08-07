import { ActionTypes, IBookState, IActionBooks, IBookDetailState } from './index';
import { CommonActionType } from '../base';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';

const initialState: IBookState = {
  isShowGenresMenu: false,
  listGenres: [],
  listBookAZ: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  book: {},
  listMostPopular: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listBookGenres: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
};

const reducer = (state: IBookState = initialState, action: IActionBooks) => {
  switch (action.type) {
    case ActionTypes.SHOW_GENRES_MENU:
      return {
        ...state,
        isShowGenresMenu: action.payload.isShow,
      };
    case ActionTypes.SAVE_LIST_AZ:
      return {
        ...state,
        listBookAZ: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_AZ:
      return {
        ...state,
        listBookAZ: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listBookAZ.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_BOOK:
    case ActionTypes.SAVE_LIST_CHAPTER:
    case ActionTypes.LOAD_MORE_CHAPTER:
    case ActionTypes.SAVE_LIST_COMMENT_BOOK:
    case ActionTypes.LOAD_MORE_LIST_COMMENT_BOOK:
      return {
        ...state,
        book: {
          ...state.book,
          [action.payload.book_id]: handleBookDetail(state.book[action.payload.book_id], action)
        },
      };
    case ActionTypes.SAVE_GENRES:
      return {
        ...state,
        listGenres: action.payload.results,
      };
    case ActionTypes.SET_SELECTED_GENRES:
      return {
        ...state,
        selectedGenres: action.payload.genres,
      };
    case ActionTypes.SAVE_MOST_POPULAR:
      return {
        ...state,
        listMostPopular: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_MOST_POPULAR:
      return {
        ...state,
        listMostPopular: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listMostPopular.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_BOOKS_GENRES:
      return {
        ...state,
        listBookGenres: action.payload.books,
      };
    case ActionTypes.LOADMORE_BOOKS_GENRES:
      return {
        ...state,
        listBookGenres: {
          count: action.payload.books.count,
          next: action.payload.books.next,
          previous: action.payload.books.previous,
          results: [...state.listBookGenres.results, ...action.payload.books.results],
        },
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

const bookDetailInitialState: IBookDetailState = {
  bookDetail: {
    id: '',
    name: '',
    description: '',
    image: '',
    image_thumb: '',
  },
  listChapter: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listComment: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  }
}

const handleBookDetail = (state: IBookDetailState = bookDetailInitialState, action: IActionBooks) => {
  switch (action.type) {
    case ActionTypes.SAVE_BOOK:
      return {
        ...state,
        bookDetail: action.payload.book
      }
    case ActionTypes.SAVE_LIST_CHAPTER:
      return {
        ...state,
        listChapter: action.payload.results
      }
    case ActionTypes.LOAD_MORE_CHAPTER:
      return {
        ...state,
        listChapter: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listChapter.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_COMMENT_BOOK:
      return {
        ...state,
        listComment: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_LIST_COMMENT_BOOK:
      return {
        ...state,
        listComment: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listComment.results, ...action.payload.results.results],
        },
      };
    default:
      return state;
  }
}

export default reducer;
