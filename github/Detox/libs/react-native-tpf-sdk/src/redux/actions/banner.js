import { BANNER } from '../actionsType';

export const getBannerHandle = payload => ({
  type: BANNER.GET_BANNER.HANDLER,
  payload
});

export const getBannerSuccess = payload => ({
  type: BANNER.GET_BANNER.SUCCESS,
  payload
});

export const getBannerFailure = payload => ({
  type: BANNER.GET_BANNER.FAILURE,
  payload
});

export const getBannerDetailHandle = payload => ({
  type: BANNER.GET_BANNER_DETAIL.HANDLER,
  payload
});

export const getBannerDetailSuccess = payload => ({
  type: BANNER.GET_BANNER_DETAIL.SUCCESS,
  payload
});

export const getBannerDetailFailure = payload => ({
  type: BANNER.GET_BANNER_DETAIL.FAILURE,
  payload
});
