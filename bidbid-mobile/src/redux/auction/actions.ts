import {
  ActionTypes,
  ActionCategories,
  ActionCharities,
  ActionCreateAuction,
  ActionCreateAuctionPayload,
  ActionDonatePercents,
  ActionDurations,
  ActionGetAuction,
  ActionSearchCity,
  ActionSearchCityPayload,
  ActionSearchNearPlace,
  ActionSearchNearPlacePayload,
  AuctionAction,
  RequestAdditionalCharityPayload,
  RequestAdditionalCharityAction,
  GetMyAuctionHistoryPayload,
  ActionUpdateStatusAuction,
  ActionUpdateStatusAuctionPayload,
  ActionSetDurations,
  ActionSetDurationsPayload,
  SaveAuctionDetailActionPayload,
} from './index';
import { ActionCallback } from '@/redux/auth';
import { Auction } from '@/models';

function getDurations(payload: ActionCallback): ActionDurations {
  return {
    type: ActionTypes.GET_DURATIONS,
    payload,
  };
}

function setDurations(payload: ActionSetDurationsPayload): ActionSetDurations {
  return {
    type: ActionTypes.SET_DURATIONS,
    payload,
  };
}

function getCategories(payload: ActionCallback): ActionCategories {
  return {
    type: ActionTypes.GET_CATEGORIES,
    payload,
  };
}

const saveAuctionsDetail = (payload: SaveAuctionDetailActionPayload): AuctionAction => ({
  type: ActionTypes.SET_AUCTION_DETAIL,
  payload,
});

function getDonatePercents(payload: ActionCallback): ActionDonatePercents {
  return {
    type: ActionTypes.GET_DONATE_PERCENTS,
    payload,
  };
}

export interface ActionCharitiesPayload extends ActionCallback {
  keyword: string;
  perPage: number;
  page: number;
}

function getCharities(payload: ActionCharitiesPayload): ActionCharities {
  return {
    type: ActionTypes.GET_CHARITIES,
    payload,
  };
}

function createAuction(payload: ActionCreateAuctionPayload): ActionCreateAuction {
  return {
    type: ActionTypes.CREATE_AUCTION,
    payload,
  };
}

function getAuctions(payload: ActionCallback): ActionGetAuction {
  return {
    type: ActionTypes.GET_AUCTION,
    payload,
  };
}

function searchNearPlace(payload: ActionSearchNearPlacePayload): ActionSearchNearPlace {
  return {
    type: ActionTypes.SEARCH_NEAR_PLACE,
    payload,
  };
}

function searchCity(payload: ActionSearchCityPayload): ActionSearchCity {
  return {
    type: ActionTypes.SEARCH_CITY,
    payload,
  };
}

function saveAuction(auction: Auction): AuctionAction {
  return {
    type: ActionTypes.SAVE_AUCTION_DATA,
    payload: {
      auction: auction,
    },
  };
}

function requestAdditionalCharity(payload: RequestAdditionalCharityPayload): RequestAdditionalCharityAction {
  return {
    type: ActionTypes.REQUEST_ADDITIONAL_CHARITY,
    payload,
  };
}

function getMyAuctionHistory(payload: GetMyAuctionHistoryPayload): AuctionAction {
  return {
    type: ActionTypes.GET_MY_AUCTION_HISTORY,
    payload,
  };
}

function updateStatusAuction(payload: ActionUpdateStatusAuctionPayload): ActionUpdateStatusAuction {
  return {
    type: ActionTypes.UPDATE_STATUS_AUCTION,
    payload,
  };
}

function getMyAuctionActive(payload: ActionCallback): AuctionAction {
  return {
    type: ActionTypes.GET_MY_AUCTION_ACTIVE,
    payload,
  };
}

function getMyAuctionLasted(payload: ActionCallback): AuctionAction {
  return {
    type: ActionTypes.GET_MY_AUCTION_LASTED,
    payload,
  };
}

export {
  saveAuctionsDetail,
  getDurations,
  getCategories,
  getDonatePercents,
  getCharities,
  createAuction,
  getAuctions,
  searchNearPlace,
  updateStatusAuction,
  searchCity,
  saveAuction,
  setDurations,
  requestAdditionalCharity,
  getMyAuctionHistory,
  getMyAuctionActive,
  getMyAuctionLasted,
};
