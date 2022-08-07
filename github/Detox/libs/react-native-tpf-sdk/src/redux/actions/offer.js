import { OFFER } from '../actionsType';

export const getHighlightOfferHandle = payload => ({
  type: OFFER.GET_HIGHLIGHT_OFFER.HANDLER,
  payload
});

export const getHighlightOfferSuccess = payload => ({
  type: OFFER.GET_HIGHLIGHT_OFFER.SUCCESS,
  payload
});

export const getHighlightOfferFailure = payload => ({
  type: OFFER.GET_HIGHLIGHT_OFFER.FAILURE,
  payload
});

export const getOfferListHandle = payload => ({
  type: OFFER.GET_OFFER_LIST.HANDLER,
  payload
});

export const getOfferListSuccess = payload => ({
  type: OFFER.GET_OFFER_LIST.SUCCESS,
  payload
});

export const getOfferListFailure = payload => ({
  type: OFFER.GET_OFFER_LIST.FAILURE,
  payload
});

export const getOfferDetailHandle = payload => ({
  type: OFFER.GET_OFFER_DETAIL.HANDLER,
  payload
});

export const getOfferDetailSuccess = payload => ({
  type: OFFER.GET_OFFER_DETAIL.SUCCESS,
  payload
});

export const getOfferDetailFailure = payload => ({
  type: OFFER.GET_OFFER_DETAIL.FAILURE,
  payload
});
