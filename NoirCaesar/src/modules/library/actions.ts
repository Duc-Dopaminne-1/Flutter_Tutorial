import {
  ActionTypes,
  IActionAddFavoritePayload,
  IActionGetListFavoritesPayload,
  IActionGetListPurchasePayload,
  IActionLoadMoreListFavoritesPayload,
  IActionLoadMoreListPurchasePayload,
  IActionSaveListFavoritesPayload,
  IActionSaveListPurchasePayload,
} from './index';

const addFavorite = (payload: IActionAddFavoritePayload) => ({
  type: ActionTypes.ADD_FAVORITE,
  payload,
});

const getListFavorites = (payload: IActionGetListFavoritesPayload) => ({
  type: ActionTypes.GET_LIST_FAVORITES,
  payload,
});

const loadMoreListFavorites = (payload: IActionLoadMoreListFavoritesPayload) => ({
  type: ActionTypes.LOAD_MORE_LIST_FAVORITES,
  payload,
});

const saveListFavorites = (payload: IActionSaveListFavoritesPayload) => ({
  type: ActionTypes.SAVE_LIST_FAVORITES,
  payload,
});

const getListPurchased = (payload: IActionGetListPurchasePayload) => ({
  type: ActionTypes.GET_LIST_PURCHASE,
  payload,
});

const loadMoreListPurchased = (payload: IActionLoadMoreListPurchasePayload) => ({
  type: ActionTypes.LOAD_MORE_LIST_PURCHASE,
  payload,
});

const saveListPurchased = (payload: IActionSaveListPurchasePayload) => ({
  type: ActionTypes.SAVE_LIST_PURCHASE,
  payload,
});

export {
  addFavorite,
  getListFavorites,
  saveListFavorites,
  loadMoreListFavorites,
  getListPurchased,
  loadMoreListPurchased,
  saveListPurchased
};
