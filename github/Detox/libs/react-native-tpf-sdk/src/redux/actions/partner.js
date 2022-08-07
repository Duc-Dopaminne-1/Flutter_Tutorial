import { PARTNER } from '../actionsType';

export const getPartnerListHandle = (payload, success, failure) => ({
  type: PARTNER.GET_PARTNER_LIST.HANDLER,
  payload,
  success,
  failure
});

export const getPartnerListSuccess = payload => ({
  type: PARTNER.GET_PARTNER_LIST.SUCCESS,
  payload
});

export const getPartnerListFailure = payload => ({
  type: PARTNER.GET_PARTNER_LIST.FAILURE,
  payload
});
export const getPartnerDetailHandle = payload => ({
  type: PARTNER.GET_PARTNER_DETAIL.HANDLER,
  payload
});

export const getPartnerDetailSuccess = payload => ({
  type: PARTNER.GET_PARTNER_DETAIL.SUCCESS,
  payload
});

export const getPartnerDetailFailure = payload => ({
  type: PARTNER.GET_PARTNER_DETAIL.FAILURE,
  payload
});
