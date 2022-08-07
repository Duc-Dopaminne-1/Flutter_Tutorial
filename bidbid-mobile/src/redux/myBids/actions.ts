import {
  getAuctionDetailAction,
  getAuctionDetailActionPayload,
  GetAuctionsWonActionPayload,
  getTokenZoomAction,
  getTokenZoomActionPayload,
  MyBidsAction,
  MyBidsActionTypes,
  SaveCancelMeetAction,
  SaveCancelMeetActionPayload,
  setStatusRoomAction,
  setStatusRoomActionPayload,
} from './types';
import { ActionCallback } from '@/redux/auth';

// ----------------------------------------
// Auctions Won
// ----------------------------------------
const getAuctionsWon = (payload: GetAuctionsWonActionPayload): MyBidsAction => ({
  type: MyBidsActionTypes.MY_BIDS_GET_AUCTIONS_WON,
  payload,
});

const saveAuctionsWon = (auctionsWon: any[]): MyBidsAction => ({
  type: MyBidsActionTypes.MY_BIDS_SAVE_AUCTIONS_WON,
  payload: {
    auctionsWon: auctionsWon,
  },
});

// ----------------------------------------
// Likes Gone Live
// ----------------------------------------
const getLikesGoneLive = (payload: ActionCallback): MyBidsAction => ({
  type: MyBidsActionTypes.MY_BIDS_GET_LIKES_GONE_LIVE,
  payload,
});

const saveLikesGoneLive = (likesGoneLive: any[]): MyBidsAction => ({
  type: MyBidsActionTypes.MY_BIDS_SAVE_LIKES_GONE_LIVE,
  payload: {
    likesGoneLive: likesGoneLive,
  },
});

// ----------------------------------------
// Auctions In Progress
// ----------------------------------------
const getAuctionsInProgress = (payload: ActionCallback): MyBidsAction => ({
  type: MyBidsActionTypes.MY_BIDS_GET_AUCTIONS_IN_PROGRESS,
  payload,
});

const saveAuctionsInProgress = (auctionsInProgress: any[]): MyBidsAction => ({
  type: MyBidsActionTypes.MY_BIDS_SAVE_AUCTIONS_IN_PROGRESS,
  payload: {
    auctionsInProgress: auctionsInProgress,
  },
});

const saveCharities = (charities: any[]): MyBidsAction => ({
  type: MyBidsActionTypes.MY_BIDS_SAVE_CHARITIES,
  payload: {
    charities: charities,
  },
});

const cancelMeet = (payload: SaveCancelMeetActionPayload): SaveCancelMeetAction => ({
  type: MyBidsActionTypes.MY_BIDS_CANCEL_MEET,
  payload,
});

const getAuctionDetail = (payload: getAuctionDetailActionPayload): getAuctionDetailAction => ({
  type: MyBidsActionTypes.MY_BIDS_AUCTIONS_DETAIL,
  payload,
});

const getTokenZoom = (payload: getTokenZoomActionPayload): getTokenZoomAction => ({
  type: MyBidsActionTypes.GET_TOKEN_ZOOM,
  payload,
});

const setStatusRoom = (payload: setStatusRoomActionPayload): setStatusRoomAction => ({
  type: MyBidsActionTypes.SET_STATUS_ROOM,
  payload,
});

export {
  setStatusRoom,
  getTokenZoom,
  getAuctionDetail,
  getAuctionsWon,
  saveAuctionsWon,
  getLikesGoneLive,
  saveLikesGoneLive,
  getAuctionsInProgress,
  saveAuctionsInProgress,
  saveCharities,
  cancelMeet,
};
