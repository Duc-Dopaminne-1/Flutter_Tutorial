import {
  ActionTypes,
  IActionShowGenresMenuPayload,
  IActionGetListPayload,
  IActionSaveListAZPayload,
  IActionGetBookPayload,
  IActionGetListChapterPayload,
  IActionSaveListChapterPayload,
  IActionLoadMoreAZPayLoad,
  IActionSaveBookPayload,
  IActionSaveGenresPayload,
  IActionSetSelectedGenresPayload,
  IActionSaveMostPopularListPayload,
  IActionLoadMorePopularPayload,
  IActionCreateBookPayload,
  IActionSaveListBookGenresPayload,
  IActionLoadMoreListChapterPayload,
  IActionGetChapterPayload,
  IActionPurchaseChapterPayload,
  IActionGetlistCommentPayload,
  IActionCreateCommentPayload,
  IActionSaveListCommentPayload,
  IActionLoadMoreListCommentPayload
} from './index';
import { IActionCallback } from '../base';

const showGenresMenu = (payload: IActionShowGenresMenuPayload) => ({
  type: ActionTypes.SHOW_GENRES_MENU,
  payload,
});

const getList = (payload: IActionGetListPayload) => ({
  type: ActionTypes.GET_LIST,
  payload,
});

const saveListAZ = (payload: IActionSaveListAZPayload) => ({
  type: ActionTypes.SAVE_LIST_AZ,
  payload,
});

const loadMoreListAZ = (payload: IActionLoadMoreAZPayLoad) => ({
  type: ActionTypes.LOAD_MORE_AZ,
  payload,
});

const savePopular = (payload: IActionSaveMostPopularListPayload) => ({
  type: ActionTypes.SAVE_MOST_POPULAR,
  payload,
});

const loadMorePopular = (payload: IActionLoadMorePopularPayload) => ({
  type: ActionTypes.LOAD_MORE_MOST_POPULAR,
  payload,
});

const getBook = (payload: IActionGetBookPayload) => ({
  type: ActionTypes.GET_BOOK,
  payload,
});

const saveBook = (payload: IActionSaveBookPayload) => ({
  type: ActionTypes.SAVE_BOOK,
  payload,
});

const getChapter = (payload: IActionGetChapterPayload) => ({
  type: ActionTypes.GET_CHAPTER,
  payload,
});

const getListChapter = (payload: IActionGetListChapterPayload) => ({
  type: ActionTypes.GET_LIST_CHAPTER,
  payload,
});

const saveListChapter = (payload: IActionSaveListChapterPayload) => ({
  type: ActionTypes.SAVE_LIST_CHAPTER,
  payload,
});

const loadMoreListChapter = (payload: IActionLoadMoreListChapterPayload) => ({
  type: ActionTypes.LOAD_MORE_CHAPTER,
  payload,
});

const getGenres = (payload: IActionCallback) => ({
  type: ActionTypes.GET_GENRES,
  payload,
});

const saveGenres = (payload: IActionSaveGenresPayload) => ({
  type: ActionTypes.SAVE_GENRES,
  payload,
});

const setSelectedGenres = (payload: IActionSetSelectedGenresPayload) => ({
  type: ActionTypes.SET_SELECTED_GENRES,
  payload,
});

const createBook = (payload: IActionCreateBookPayload) => ({
  type: ActionTypes.CREATE_BOOK,
  payload,
});

const saveListBookGenres = (payload: IActionSaveListBookGenresPayload) => ({
  type: ActionTypes.SAVE_BOOKS_GENRES,
  payload,
});

const loadMoreListBookGenres = (payload: IActionSaveListBookGenresPayload) => ({
  type: ActionTypes.LOADMORE_BOOKS_GENRES,
  payload,
});

const purchaseChapter = (payload: IActionPurchaseChapterPayload) => ({
  type: ActionTypes.PURCHASE_CHAPTER,
  payload,
})

const getListComment = (payload: IActionGetlistCommentPayload) => ({
  type: ActionTypes.GET_LIST_COMMENT_BOOK,
  payload,
});

const createComment = (payload: IActionCreateCommentPayload) => ({
  type: ActionTypes.CREATE_COMMENT_BOOK,
  payload,
});

const saveListComment = (payload: IActionSaveListCommentPayload) => ({
  type: ActionTypes.SAVE_LIST_COMMENT_BOOK,
  payload,
});

const loadMoreListComment = (payload: IActionLoadMoreListCommentPayload) => ({
  type: ActionTypes.LOAD_MORE_LIST_COMMENT_BOOK,
  payload,
});

export {
  showGenresMenu,
  getList,
  saveListAZ,
  loadMoreListAZ,
  getBook,
  saveBook,
  getListChapter,
  saveListChapter,
  loadMoreListChapter,
  getGenres,
  saveGenres,
  setSelectedGenres,
  savePopular,
  loadMorePopular,
  createBook,
  saveListBookGenres,
  loadMoreListBookGenres,
  getChapter,
  purchaseChapter,
  getListComment,
  createComment,
  saveListComment,
  loadMoreListComment
};
