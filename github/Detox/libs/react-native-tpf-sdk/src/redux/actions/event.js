import { EVENT } from '../actionsType';

export const getHighlightEventHandle = payload => ({
  type: EVENT.GET_HIGHLIGHT_EVENT.HANDLER,
  payload
});

export const getHighlightEventSuccess = payload => ({
  type: EVENT.GET_HIGHLIGHT_EVENT.SUCCESS,
  payload
});

export const getHighlightEventFailure = payload => ({
  type: EVENT.GET_HIGHLIGHT_EVENT.FAILURE,
  payload
});

export const getEventListHandle = payload => ({
  type: EVENT.GET_EVENT_LIST.HANDLER,
  payload
});

export const getEventListSuccess = payload => ({
  type: EVENT.GET_EVENT_LIST.SUCCESS,
  payload
});

export const getEventListFailure = payload => ({
  type: EVENT.GET_EVENT_LIST.FAILURE,
  payload
});

export const getEventListClear = payload => ({
  type: EVENT.GET_EVENT_LIST.CLEAR,
  payload
});

export const getEventDetailHandle = payload => ({
  type: EVENT.GET_EVENT_DETAIL.HANDLER,
  payload
});

export const getEventDetailSuccess = payload => ({
  type: EVENT.GET_EVENT_DETAIL.SUCCESS,
  payload
});

export const getEventDetailFailure = payload => ({
  type: EVENT.GET_EVENT_DETAIL.FAILURE,
  payload
});
