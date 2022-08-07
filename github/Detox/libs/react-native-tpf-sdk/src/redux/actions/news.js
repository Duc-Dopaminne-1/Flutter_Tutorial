import { NEWS } from '../actionsType';

export const getHighlightNewsHandle = payload => ({
  type: NEWS.GET_HIGHLIGHT_NEWS.HANDLER,
  payload
});

export const getHighlightNewsSuccess = payload => ({
  type: NEWS.GET_HIGHLIGHT_NEWS.SUCCESS,
  payload
});

export const getHighlightNewsFailure = payload => ({
  type: NEWS.GET_HIGHLIGHT_NEWS.FAILURE,
  payload
});

export const getNewsListHandle = payload => ({
  type: NEWS.GET_NEWS_LIST.HANDLER,
  payload
});

export const getNewsListSuccess = payload => ({
  type: NEWS.GET_NEWS_LIST.SUCCESS,
  payload
});

export const getNewsListFailure = payload => ({
  type: NEWS.GET_NEWS_LIST.FAILURE,
  payload
});

export const getNewsListClear = payload => ({
  type: NEWS.GET_NEWS_LIST.CLEAR,
  payload
});

export const getNewsDetailHandle = payload => ({
  type: NEWS.GET_NEWS_DETAIL.HANDLER,
  payload
});

export const getNewsDetailSuccess = payload => ({
  type: NEWS.GET_NEWS_DETAIL.SUCCESS,
  payload
});

export const getNewsDetailFailure = payload => ({
  type: NEWS.GET_NEWS_DETAIL.FAILURE,
  payload
});
