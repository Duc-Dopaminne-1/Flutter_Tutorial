import { MyBidsActionTypes, MyBidsAction } from './types';

// import { Gender, SEXUAL_ORIENTATION_MODEL, Category, AuctionStatusModel, INTERESTS_MODEL } from '@/models';
export interface myBidsInit {
  myBids: MyBidsData;
}

export interface MyBidsData {
  auctionsWon: any[];
  likesGoneLive: any[];
  auctionsInProgress: any[];
  charities: any[];
}

const initialState: MyBidsData = {
  auctionsWon: [],
  likesGoneLive: [],
  auctionsInProgress: [],
  charities: [],
};

const reducer = (state: MyBidsData = initialState, action: MyBidsAction): MyBidsData => {
  switch (action.type) {
    case MyBidsActionTypes.MY_BIDS_SAVE_AUCTIONS_WON:
      const { auctionsWon } = action.payload;
      return {
        ...state,
        auctionsWon: [...auctionsWon],
      };
    case MyBidsActionTypes.MY_BIDS_SAVE_LIKES_GONE_LIVE:
      const { likesGoneLive } = action.payload;
      return {
        ...state,
        likesGoneLive: [...likesGoneLive],
      };
    case MyBidsActionTypes.MY_BIDS_SAVE_AUCTIONS_IN_PROGRESS:
      const { auctionsInProgress } = action.payload;
      return {
        ...state,
        auctionsInProgress: [...auctionsInProgress],
      };
    case MyBidsActionTypes.MY_BIDS_SAVE_CHARITIES:
      const { charities } = action.payload;
      return {
        ...state,
        charities: [...charities],
      };
    default:
      return state;
  }
};

export default reducer;
