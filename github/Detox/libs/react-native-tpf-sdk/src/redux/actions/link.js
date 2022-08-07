import { LINK } from '../actionsType';

export const getLinkHandle = (payload, success, failure) => ({
  type: LINK.GET_LINK.HANDLER,
  payload,
  success,
  failure
});

export const getLinkSuccess = payload => ({
  type: LINK.GET_LINK.SUCCESS,
  payload
});

export const getLinkFailure = payload => ({
  type: LINK.GET_LINK.FAILURE,
  payload
});
