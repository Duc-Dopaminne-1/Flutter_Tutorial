import { AuctionAction, ActionTypes } from './index';
import { Auction, DURATION } from '@/models';

export interface AuctionState {
  auction: AuctionData;
}

interface AuctionData {
  auctionDictionary: {
    [auctionId: string]: Auction;
  };
  timeAuction: {
    duration: DURATION[];
    timeMeet: DURATION[];
    raffle: DURATION[];
  };
  auctionDetail: Auction;
}

const initialState: AuctionData = {
  auctionDictionary: {},
  auctionDetail: {},
  timeAuction: {
    duration: [],
    timeMeet: [],
    raffle: [],
  },
};

const reducer = (state: AuctionData = initialState, action: AuctionAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_AUCTION_DATA:
      const { auction } = action.payload;
      const { auctionDictionary } = state;
      auctionDictionary[auction.id] = { ...auctionDictionary[auction.id], ...auction };
      return {
        ...state,
        auctionDictionary: { ...auctionDictionary },
      };
    case ActionTypes.SET_DURATIONS:
      return {
        ...state,
        timeAuction: action.payload.data,
      };
    case ActionTypes.SET_AUCTION_DETAIL:
      return {
        ...state,
        auctionDetail: action.payload.data,
      };
    default:
      return state;
  }
};

export default reducer;
