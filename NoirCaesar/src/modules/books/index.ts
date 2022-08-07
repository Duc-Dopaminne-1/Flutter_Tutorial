import { Action } from 'redux';
import reducer from './reducer';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { BookListModeEnum, CreateBookData } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book';
import { IBook, IChapter, IGenres } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IComment } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment/models';

export enum ActionTypes {
  SHOW_GENRES_MENU = 'SHOW_GENRES_MENU',
  GET_LIST = 'GET_LIST',
  SAVE_LIST_AZ = 'SAVE_LIST_AZ',
  LOAD_MORE_AZ = 'LOAD_MORE_AZ',
  GET_BOOK = 'GET_BOOK',
  SAVE_BOOK = 'SAVE_BOOK',
  GET_CHAPTER = 'GET_CHAPTER',
  GET_LIST_CHAPTER = 'GET_LIST_CHAPTER',
  SAVE_LIST_CHAPTER = 'SAVE_LIST_CHAPTER',
  LOAD_MORE_CHAPTER = 'LOAD_MORE_CHAPTER',
  GET_GENRES = 'GET_GENRES',
  SAVE_GENRES = 'SAVE_GENRES',
  SET_SELECTED_GENRES = 'SET_SELECTED_GENRES',
  SAVE_MOST_POPULAR = 'SAVE_MOST_POPULAR',
  LOAD_MORE_MOST_POPULAR = 'LOAD_MORE_MOST_POPULAR',
  CREATE_BOOK = 'CREATE_BOOK',
  SAVE_BOOKS_GENRES = 'SAVE_BOOKS_GENRES',
  LOADMORE_BOOKS_GENRES = 'LOADMORE_BOOKS_GENRES',
  PURCHASE_CHAPTER = 'PURCHASE_CHAPTER',
  GET_LIST_COMMENT_BOOK = 'GET_LIST_COMMENT_BOOK',
  CREATE_COMMENT_BOOK = 'CREATE_COMMENT_BOOK',
  SAVE_LIST_COMMENT_BOOK = 'SAVE_LIST_COMMENT_BOOK',
  LOAD_MORE_LIST_COMMENT_BOOK = 'LOAD_MORE_LIST_COMMENT_BOOK',
}

export interface IBookState {
  isShowGenresMenu: boolean;
  listGenres: IGenres[];
  selectedGenres?: IGenres;
  listBookAZ: IPagination<IBook>;
  listMostPopular: IPagination<IBook>;
  listBookGenres: IPagination<IBook>;
  book: IListBookDetailState;
}

export interface IListBookDetailState {
  [id: string]: IBookDetailState
}

export interface IBookDetailState {
  bookDetail: IBook
  listChapter: IPagination<IChapter>;
  listComment: IPagination<IComment>
}

export interface IActionGetlistCommentPayload extends IActionCallback {
  model_id: string;
  page?: number;
  limit?: number;
}

export interface IActionCreateCommentPayload extends IActionCallback {
  model_id: string;
  text: string;
}

export interface IActionSaveListCommentPayload {
  book_id: string;
  results: IPagination<IComment>;
}

export interface IActionLoadMoreListCommentPayload {
  book_id: string;
  results: IPagination<IComment>;
}

// ===================PAYLOADS=========================
export interface IActionShowGenresMenuPayload {
  isShow: boolean;
}

export interface IActionGetListPayload extends IActionCallback {
  mode: BookListModeEnum;
  genres_id?: string;
  page?: number;
  limit?: number;
}

export interface IActionGetListChapterPayload extends IActionCallback {
  book_id: string;
  page?: number;
  limit?: number;
  is_collection?: boolean;
}

export interface IActionSaveListChapterPayload {
  book_id: string;
  results: IPagination<IChapter>;
}

export interface IActionLoadMoreListChapterPayload {
  book_id: string;
  results: IPagination<IChapter>;
}

export interface IActionGetBookPayload extends IActionCallback {
  book_id: string;
  is_collection?: boolean;
}

export interface IActionSaveBookPayload {
  book_id: string;
  book: IBook;
}

export interface IActionSaveListAZPayload {
  results: IPagination<IBook>;
}

export interface IActionLoadMoreAZPayLoad {
  results: IPagination<IBook>;
}

export interface IActionGetChapterPayload extends IActionCallback {
  chapterId: string;
  is_collection?: boolean;
}

export interface IActionSaveListChapterPayload {
  results: IPagination<IChapter>;
}

export interface IActionCreateBookPayload extends IActionCallback {
  data: CreateBookData;
}

export interface IActionSaveGenresPayload {
  results: IGenres[];
}

export interface IActionSetSelectedGenresPayload {
  genres: IGenres;
}

export interface IActionSaveMostPopularListPayload {
  results: IPagination<IBook>;
}
export interface IActionLoadMorePopularPayload {
  results: IPagination<IBook>;
}

export interface IActionSaveListBookGenresPayload {
  books: IPagination<IBook>;
}

export interface IActionPurchaseChapterPayload extends IActionCallback {
  chapter_id: string;
}

// ===================ACTIONS===================================================
export interface IActionShowGenresMenu extends Action {
  type: ActionTypes.SHOW_GENRES_MENU;
  payload: IActionShowGenresMenuPayload;
}

export interface IActionGetList extends Action {
  type: ActionTypes.GET_LIST;
  payload: IActionGetListPayload;
}

export interface IActionGetListChapter extends Action {
  type: ActionTypes.GET_LIST_CHAPTER;
  payload: IActionGetListChapterPayload;
}

export interface IActionGetBook extends Action {
  type: ActionTypes.GET_BOOK;
  payload: IActionGetBookPayload;
}

export interface IActionSaveBook extends Action {
  type: ActionTypes.SAVE_BOOK;
  payload: IActionSaveBookPayload;
}

export interface IActionSaveListAZ extends Action {
  type: ActionTypes.SAVE_LIST_AZ;
  payload: IActionSaveListAZPayload;
}

export interface IActionLoadMoreAZ extends Action {
  type: ActionTypes.LOAD_MORE_AZ;
  payload: IActionLoadMoreAZPayLoad;
}

export interface IActionGetChapter extends Action {
  type: ActionTypes.GET_CHAPTER;
  payload: IActionGetChapterPayload;
}

export interface IActionSaveListChapter extends Action {
  type: ActionTypes.SAVE_LIST_CHAPTER;
  payload: IActionSaveListChapterPayload;
}

export interface IActionLoadMoreListChapter extends Action {
  type: ActionTypes.LOAD_MORE_CHAPTER;
  payload: IActionLoadMoreListChapterPayload;
}

export interface IActionGetGenres extends Action {
  type: ActionTypes.GET_GENRES;
  payload: IActionCallback;
}

export interface IActionCreateBook extends Action {
  type: ActionTypes.CREATE_BOOK;
  payload: IActionCreateBookPayload;
}

export interface IActionSaveGenres extends Action {
  type: ActionTypes.SAVE_GENRES;
  payload: IActionSaveGenresPayload;
}

export interface IActionSetSelectedGenres extends Action {
  type: ActionTypes.SET_SELECTED_GENRES;
  payload: IActionSetSelectedGenresPayload;
}

export interface IActionSaveMostPopularList extends Action {
  type: ActionTypes.SAVE_MOST_POPULAR;
  payload: IActionSaveMostPopularListPayload;
}

export interface IActionLoadMorePopular extends Action {
  type: ActionTypes.LOAD_MORE_MOST_POPULAR;
  payload: IActionLoadMorePopularPayload;
}

export interface IActionSaveListBookGenres extends Action {
  type: ActionTypes.SAVE_BOOKS_GENRES;
  payload: IActionSaveListBookGenresPayload;
}

export interface IActionLoadMoreListBookGenres extends Action {
  type: ActionTypes.LOADMORE_BOOKS_GENRES;
  payload: IActionSaveListBookGenresPayload;
}

export interface IActionPurchaseChapter extends Action {
  type: ActionTypes.PURCHASE_CHAPTER;
  payload: IActionPurchaseChapterPayload
}

export interface IActionGetListComment extends Action {
  type: ActionTypes.GET_LIST_COMMENT_BOOK;
  payload: IActionGetlistCommentPayload;
}

export interface IActionCreateComment extends Action {
  type: ActionTypes.CREATE_COMMENT_BOOK;
  payload: IActionCreateCommentPayload;
}

export interface IActionSaveListComment extends Action {
  type: ActionTypes.SAVE_LIST_COMMENT_BOOK;
  payload: IActionSaveListCommentPayload;
}

export interface IActionLoadMoreListComment extends Action {
  type: ActionTypes.LOAD_MORE_LIST_COMMENT_BOOK;
  payload: IActionLoadMoreListCommentPayload;
}

export type IActionBooks =
  | IActionShowGenresMenu
  | IActionResetAllState
  | IActionGetList
  | IActionSaveListAZ
  | IActionLoadMoreAZ
  | IActionGetBook
  | IActionSaveBook
  | IActionGetListChapter
  | IActionSaveListChapter
  | IActionLoadMoreListChapter
  | IActionGetGenres
  | IActionSaveGenres
  | IActionSetSelectedGenres
  | IActionSaveMostPopularList
  | IActionLoadMorePopular
  | IActionCreateBook
  | IActionSaveListBookGenres
  | IActionLoadMoreListBookGenres
  | IActionPurchaseChapter
  | IActionGetListComment
  | IActionCreateComment
  | IActionSaveListComment
  | IActionLoadMoreListComment;

export { reducer };
