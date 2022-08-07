import { PlaceABidAction, PlaceABidActionTypes } from './types';
import { Auction } from '@/models';

export interface PlaceABidInit {
  placeABid: PlaceABidData;
}

export interface PlaceABidData {
  auction: Auction;
  auctionIdBiding: string;
  categoriesIdSelected: number[];
  categoriesIdSelectedPlaceABid: number[];
  price: string;
  priceRaffle: number;
  userBidded: boolean;
  userProfileId: string;
}

export const initialState: PlaceABidData = {
  auction: {},
  auctionIdBiding: '',
  categoriesIdSelected: [],
  categoriesIdSelectedPlaceABid: [],
  price: '0.00',
  priceRaffle: 0,
  userBidded: false,
  userProfileId: '',
};

const reducer = (state: PlaceABidData = initialState, action: PlaceABidAction): PlaceABidData => {
  switch (action.type) {
    case PlaceABidActionTypes.SET_AUCTION_ID_BIDDING:
      return {
        ...state,
        auctionIdBiding: action.payload.auctionIdBidding,
      };

    case PlaceABidActionTypes.SET_USER_PROFILE_ID:
      return {
        ...state,
        userProfileId: action.payload.userProfileId,
      };

    case PlaceABidActionTypes.SET_AUCTION:
      return {
        ...state,
        auction: action.payload,
      };
    case PlaceABidActionTypes.SET_PLACE_A_BID:
      return {
        ...state,
        auction: action.payload,
      };
    case PlaceABidActionTypes.GET_PLACE_A_BID:
      return state;

    case PlaceABidActionTypes.SET_CATEGORIES_SELECTED:
      const categoriesIdSelected = action.payload;
      return {
        ...state,
        categoriesIdSelected: [...categoriesIdSelected],
      };

    case PlaceABidActionTypes.SET_CATEGORIES_SELECTED_PLACE_A_BID:
      const categoriesIdSelectedPlaceABid = action.payload;
      return {
        ...state,
        categoriesIdSelectedPlaceABid: [...categoriesIdSelectedPlaceABid],
      };

    case PlaceABidActionTypes.SET_PRICE:
      const price = action.payload;
      return {
        ...state,
        price,
      };

    case PlaceABidActionTypes.SET_PRICE_RAFFLE:
      const priceRaffle = action.payload;
      return {
        ...state,
        priceRaffle,
      };

    case PlaceABidActionTypes.SET_USER_BIDDED:
      const userBidded = action.payload;
      return {
        ...state,
        userBidded: userBidded,
      };

    case PlaceABidActionTypes.CLEAR:
      return {
        ...initialState,
        categoriesIdSelectedPlaceABid: state.categoriesIdSelectedPlaceABid,
        auction: state.auction,
      };

    default:
      return state;
  }
};

export default reducer;
