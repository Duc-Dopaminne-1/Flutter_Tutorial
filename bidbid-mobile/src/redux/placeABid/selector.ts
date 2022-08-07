import store from '../store';

export const getPlaceABidAuction = () => {
  return store.getState().placeABid.auction;
};
