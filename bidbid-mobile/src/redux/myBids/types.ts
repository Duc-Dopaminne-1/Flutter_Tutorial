import { Action } from 'redux';
import { ActionCallback } from '@/redux/auth';
// import { Gender, SEXUAL_ORIENTATION_MODEL, Category, AuctionStatusModel, INTERESTS_MODEL } from '@/models';

// Action Types
export enum MyBidsActionTypes {
  MY_BIDS_GET_AUCTIONS_WON = 'MY_BIDS_GET_AUCTIONS_WON',
  MY_BIDS_SAVE_AUCTIONS_WON = 'MY_BIDS_SAVE_AUCTIONS_WON',

  MY_BIDS_GET_LIKES_GONE_LIVE = 'MY_BIDS_GET_LIKES_GONE_LIVE',
  MY_BIDS_SAVE_LIKES_GONE_LIVE = 'MY_BIDS_SAVE_LIKES_GONE_LIVE',

  MY_BIDS_GET_AUCTIONS_IN_PROGRESS = 'MY_BIDS_GET_AUCTIONS_IN_PROGRESS',
  MY_BIDS_SAVE_AUCTIONS_IN_PROGRESS = 'MY_BIDS_SAVE_AUCTIONS_IN_PROGRESS',

  MY_BIDS_SAVE_CHARITIES = 'MY_BIDS_SAVE_CHARITIES', //Will remove after when BE update charities into response's auctions won

  MY_BIDS_CANCEL_MEET = 'MY_BIDS_CANCEL_MEET',

  MY_BIDS_AUCTIONS_DETAIL = 'MY_BIDS_AUCTIONS_DETAIL',

  GET_TOKEN_ZOOM = 'GET_TOKEN_ZOOM',

  SET_STATUS_ROOM = 'SET_STATUS_ROOM',

  MY_BIDS_CLEAR_ALL = 'MY_BIDS_CLEAR_ALL',
}

// ----------------------------------------
// Auctions Won
// ----------------------------------------

export interface GetAuctionsWonActionPayload extends ActionCallback {
  currentPage: number;
  perPage: number;
}

export interface GetAuctionsWonAction extends Action {
  type: MyBidsActionTypes.MY_BIDS_GET_AUCTIONS_WON;
  payload: GetAuctionsWonActionPayload;
}

export interface SaveAuctionsWonAction extends Action {
  type: MyBidsActionTypes.MY_BIDS_SAVE_AUCTIONS_WON;
  payload: {
    auctionsWon: any[];
  };
}

// ----------------------------------------
// Likes gone Live
// ----------------------------------------
export interface GetLiveGoneLiveAction extends Action {
  type: MyBidsActionTypes.MY_BIDS_GET_LIKES_GONE_LIVE;
  payload: ActionCallback;
}

export interface SaveLiveGoneLiveAction extends Action {
  type: MyBidsActionTypes.MY_BIDS_SAVE_LIKES_GONE_LIVE;
  payload: {
    likesGoneLive: any[];
  };
}

// ----------------------------------------
// Aucitons In Progress
// ----------------------------------------

export interface GetAuctionsInProgressAction extends Action {
  type: MyBidsActionTypes.MY_BIDS_GET_AUCTIONS_IN_PROGRESS;
  payload: ActionCallback;
}

export interface SaveAuctionsInProgressAction extends Action {
  type: MyBidsActionTypes.MY_BIDS_SAVE_AUCTIONS_IN_PROGRESS;
  payload: {
    auctionsInProgress: any[];
  };
}

export interface SaveCharitiesAction extends Action {
  type: MyBidsActionTypes.MY_BIDS_SAVE_CHARITIES;
  payload: {
    charities: any[];
  };
}

export interface SaveCancelMeetActionPayload extends ActionCallback {
  auctionId: string;
  reason: string;
  note?: string;
}

export interface SaveCancelMeetAction extends Action {
  type: MyBidsActionTypes.MY_BIDS_CANCEL_MEET;
  payload: SaveCancelMeetActionPayload;
}

export interface getAuctionDetailActionPayload extends ActionCallback {
  auctionId: string;
}

export interface getAuctionDetailAction extends Action {
  type: MyBidsActionTypes.MY_BIDS_AUCTIONS_DETAIL;
  payload: getAuctionDetailActionPayload;
}

export interface getTokenZoomActionPayload extends ActionCallback {
  auctionId: string;
}

export interface setStatusRoomActionPayload extends ActionCallback {
  auctionId: string;
}

export interface getTokenZoomAction extends Action {
  type: MyBidsActionTypes.GET_TOKEN_ZOOM;
  payload: getTokenZoomActionPayload;
}

export interface setStatusRoomAction extends Action {
  type: MyBidsActionTypes.SET_STATUS_ROOM;
  payload: setStatusRoomActionPayload;
}

export type MyBidsAction =
  | GetAuctionsWonAction
  | SaveAuctionsWonAction
  | GetLiveGoneLiveAction
  | SaveLiveGoneLiveAction
  | GetAuctionsInProgressAction
  | SaveCancelMeetAction
  | SaveAuctionsInProgressAction
  | SaveCharitiesAction;
