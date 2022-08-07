import { PlaceABidAction, PlaceABidActionTypes } from './types';
import { Auction } from '@/models';

function setAuctionIdBidding(auctionIdBidding: string): PlaceABidAction {
  return {
    type: PlaceABidActionTypes.SET_AUCTION_ID_BIDDING,
    payload: {
      auctionIdBidding,
    },
  };
}

function setPlaceABid(auction: Auction): PlaceABidAction {
  return {
    type: PlaceABidActionTypes.SET_PLACE_A_BID,
    payload: auction,
  };
}

function getPlaceABid(): PlaceABidAction {
  return {
    type: PlaceABidActionTypes.GET_PLACE_A_BID,
  };
}

function setCategories(categoriesIdSelected: number[]): PlaceABidAction {
  return {
    type: PlaceABidActionTypes.SET_CATEGORIES_SELECTED,
    payload: categoriesIdSelected,
  };
}

function setCategoriesPlaceABid(categoriesIdSelected: number[]): PlaceABidAction {
  return {
    type: PlaceABidActionTypes.SET_CATEGORIES_SELECTED_PLACE_A_BID,
    payload: categoriesIdSelected,
  };
}

function setPriceRaffle(price: number): PlaceABidAction {
  return {
    type: PlaceABidActionTypes.SET_PRICE_RAFFLE,
    payload: price,
  };
}

function setPrice(price: string): PlaceABidAction {
  return {
    type: PlaceABidActionTypes.SET_PRICE,
    payload: price,
  };
}

function setAuction(auction: Auction): PlaceABidAction {
  return {
    type: PlaceABidActionTypes.SET_AUCTION,
    payload: auction,
  };
}

function clear(): PlaceABidAction {
  return {
    type: PlaceABidActionTypes.CLEAR,
  };
}

function setUserBidded(flag: boolean): PlaceABidAction {
  return {
    type: PlaceABidActionTypes.SET_USER_BIDDED,
    payload: flag,
  };
}

function setUserProfileId(userProfileId: string): PlaceABidAction {
  return {
    type: PlaceABidActionTypes.SET_USER_PROFILE_ID,
    payload: {
      userProfileId,
    },
  };
}

export {
  setAuctionIdBidding,
  setPriceRaffle,
  setPlaceABid,
  getPlaceABid,
  setCategories,
  setPrice,
  setAuction,
  clear,
  setUserBidded,
  setUserProfileId,
  setCategoriesPlaceABid,
};
