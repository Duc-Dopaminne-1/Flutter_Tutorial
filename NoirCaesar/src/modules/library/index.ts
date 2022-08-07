import reducer from './reducer';
import { Action } from 'redux';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { ObjectTypeEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/library';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { IEpisode, IStory } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';

export enum ActionTypes {
  ADD_FAVORITE = 'ADD_FAVORITE',
  GET_LIST_FAVORITES = 'GET_LIST_FAVORITES',
  SAVE_LIST_FAVORITES = 'SAVE_LIST_FAVORITES',
  LOAD_MORE_LIST_FAVORITES = 'LOAD_MORE_LIST_FAVORITES',
  GET_LIST_PURCHASE = 'GET_LIST_PURCHASE',
  SAVE_LIST_PURCHASE = 'SAVE_LIST_PURCHASE',
  LOAD_MORE_LIST_PURCHASE = 'LOAD_MORE_LIST_PURCHASE',
}

// Payloads
export interface IActionAddFavoritePayload extends IActionCallback {
  id: string;
  type: ObjectTypeEnum;
}

export interface IActionGetListFavoritesPayload extends IActionCallback {
  name?: string;
  page?: number;
  limit?: number;
}

export interface IActionLoadMoreListFavoritesPayload extends IActionCallback {
  favorites: IPagination<IBook | IEpisode | IStory>;
}

export interface IActionSaveListFavoritesPayload extends IActionCallback {
  favorites: IPagination<IBook | IEpisode | IStory>;
}

export interface IActionGetListPurchasePayload extends IActionCallback {
  name?: string;
  page?: number;
  limit?: number;
}

export interface IActionLoadMoreListPurchasePayload extends IActionCallback {
  purchased: IPagination<IBook | IEpisode | IStory>;
}

export interface IActionSaveListPurchasePayload extends IActionCallback {
  purchased: IPagination<IBook | IEpisode | IStory>;
}

// Actions
export interface IActionAddFavorite extends Action {
  type: ActionTypes.ADD_FAVORITE;
  payload: IActionAddFavoritePayload;
}

export interface IActionGetListFavorites extends Action {
  type: ActionTypes.GET_LIST_FAVORITES;
  payload: IActionGetListFavoritesPayload;
}

export interface IActionLoadMoreListFavorites extends Action {
  type: ActionTypes.LOAD_MORE_LIST_FAVORITES;
  payload: IActionLoadMoreListFavoritesPayload;
}

export interface IActionSaveListFavorites extends Action {
  type: ActionTypes.SAVE_LIST_FAVORITES;
  payload: IActionSaveListFavoritesPayload;
}

export interface IActionGetListPurchase extends Action {
  type: ActionTypes.GET_LIST_PURCHASE;
  payload: IActionGetListPurchasePayload;
}

export interface IActionLoadMoreListPurchase extends Action {
  type: ActionTypes.LOAD_MORE_LIST_PURCHASE;
  payload: IActionLoadMoreListPurchasePayload;
}

export interface IActionSaveListPurchase extends Action {
  type: ActionTypes.SAVE_LIST_PURCHASE;
  payload: IActionSaveListPurchasePayload;
}

export type IActionLibraries =
  | IActionAddFavorite
  | IActionGetListFavorites
  | IActionLoadMoreListFavorites
  | IActionSaveListFavorites
  | IActionGetListPurchase
  | IActionLoadMoreListPurchase
  | IActionSaveListPurchase
  | IActionResetAllState;

export { reducer };
