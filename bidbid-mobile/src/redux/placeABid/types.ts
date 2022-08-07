import { Action } from 'redux';
import { Auction } from '@/models';

// Action Types
export enum PlaceABidActionTypes {
  SET_AUCTION_ID_BIDDING = 'SET_AUCTION_ID_BIDDING',

  SET_PLACE_A_BID = 'SET_PLACE_A_BID',
  GET_PLACE_A_BID = 'GET_PLACE_A_BID',

  SET_CATEGORIES_SELECTED = 'SET_CATEGORIES_SELECTED',
  SET_CATEGORIES_SELECTED_PLACE_A_BID = 'SET_CATEGORIES_SELECTED_PLACE_A_BID',
  SET_PRICE = 'SET_PRICE',
  SET_PRICE_RAFFLE = 'SET_PRICE_RAFFLE',

  SET_AUCTION = 'SET_AUCTION',
  SET_USER_PROFILE_ID = 'SET_USER_PROFILE_ID',

  SET_USER_BIDDED = 'SET_USER_BIDDED',

  CLEAR = 'CLEAR',
}

export interface SetAuctionIdBidingAction extends Action {
  type: PlaceABidActionTypes.SET_AUCTION_ID_BIDDING;
  payload: {
    auctionIdBidding: string;
  };
}

export interface SetPlaceABidAction extends Action {
  type: PlaceABidActionTypes.SET_PLACE_A_BID;
  payload: Auction;
}

export interface GetPlaceABidAction extends Action {
  type: PlaceABidActionTypes.GET_PLACE_A_BID;
}

export interface SetCategoriesSelectedAction extends Action {
  type: PlaceABidActionTypes.SET_CATEGORIES_SELECTED;
  payload: number[];
}

export interface SetCategoriesSelectedPlaceABidAction extends Action {
  type: PlaceABidActionTypes.SET_CATEGORIES_SELECTED_PLACE_A_BID;
  payload: number[];
}

export interface SetPriceRaffleAction extends Action {
  type: PlaceABidActionTypes.SET_PRICE_RAFFLE;
  payload: number;
}

export interface SetPriceAction extends Action {
  type: PlaceABidActionTypes.SET_PRICE;
  payload: string;
}

export interface ClearAction extends Action {
  type: PlaceABidActionTypes.CLEAR;
}

export interface SetAuctionAction extends Action {
  type: PlaceABidActionTypes.SET_AUCTION;
  payload: Auction;
}

export interface SetUserBiddedAction extends Action {
  type: PlaceABidActionTypes.SET_USER_BIDDED;
  payload: boolean;
}

export interface SetUserPrifleIdAction extends Action {
  type: PlaceABidActionTypes.SET_USER_PROFILE_ID;
  payload: {
    userProfileId: string;
  };
}

export type PlaceABidAction =
  | SetAuctionIdBidingAction
  | SetPlaceABidAction
  | SetPriceRaffleAction
  | GetPlaceABidAction
  | SetCategoriesSelectedAction
  | SetPriceAction
  | SetAuctionAction
  | SetUserBiddedAction
  | SetUserPrifleIdAction
  | SetCategoriesSelectedPlaceABidAction
  | ClearAction;
