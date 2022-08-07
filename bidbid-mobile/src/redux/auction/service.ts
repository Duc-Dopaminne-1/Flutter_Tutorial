import { ActionCharitiesPayload } from '@/redux/auction/actions';
import {
  ActionSearchCityPayload,
  ActionSearchNearPlacePayload,
  ActionUpdateStatusAuctionPayload,
  CreateAuctionProp,
  RequestAdditionalCharityPayload,
} from '@/redux/auction/index';
import { Auction } from '@/services/auction';
import {
  getAuctionDetailActionPayload,
  GetAuctionsWonActionPayload,
  getTokenZoomActionPayload,
  SaveCancelMeetActionPayload,
  setStatusRoomActionPayload,
} from '../myBids/types';

export const getDurations = async () => {
  try {
    const response = await Auction.getDurations();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getSettingDefault = async () => {
  try {
    const response = await Auction.getSettingDefault();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getCategories = async () => {
  try {
    const response = await Auction.getCategories();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getDonatePercents = async () => {
  try {
    const response = await Auction.getDonatePercents();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getCountryCode = async () => {
  try {
    const response = await Auction.getCountryCode();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getCharities = async (param: ActionCharitiesPayload) => {
  try {
    const response = await Auction.getCharities(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const requestAdditionalCharity = async (param: RequestAdditionalCharityPayload) => {
  try {
    const response = await Auction.requestAdditionalCharity(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const createAuction = async (param: CreateAuctionProp) => {
  try {
    const response = await Auction.createAuction(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getAuction = async () => {
  try {
    const response = await Auction.getAuction();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const searchCity = async (param: ActionSearchCityPayload) => {
  try {
    const response = await Auction.searchCity(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const searchNearPlace = async (param: ActionSearchNearPlacePayload) => {
  try {
    const response = await Auction.searchNearPlace(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getAuctionsBidding = async () => {
  try {
    const response = await Auction.getAuctionsBidding();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getAuctionsWon = async (param: GetAuctionsWonActionPayload) => {
  try {
    const response = await Auction.getAuctionsWon(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getAuctionsLiked = async () => {
  try {
    const response = await Auction.getAuctionsLiked();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const cancelMeet = async (param: SaveCancelMeetActionPayload) => {
  try {
    const response = await Auction.setCancelMeet(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getAuctionDetail = async (param: getAuctionDetailActionPayload) => {
  try {
    const response = await Auction.getAuctionDetail(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getZoomToken = async (param: getTokenZoomActionPayload) => {
  try {
    const response = await Auction.getZoomToken(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const setStatusRoom = async (param: setStatusRoomActionPayload) => {
  try {
    const response = await Auction.setStatusRoom(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getMyAuctionHistory = async (perPage: number, offset: string) => {
  try {
    const response = await Auction.getMyAuctionHistory(perPage, offset);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getMyAuctionActive = async () => {
  try {
    const response = await Auction.getMyAuctionActive();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getAuctionLasted = async () => {
  try {
    const response = await Auction.getAuctionLasted();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const updateStatusAuction = async (param: ActionUpdateStatusAuctionPayload) => {
  try {
    const response = await Auction.updateStatusAuction(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
