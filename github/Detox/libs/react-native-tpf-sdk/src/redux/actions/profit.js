import { MEMBER_PROFIT } from '../actionsType';

export const getProfitListHandle = payload => ({
  type: MEMBER_PROFIT.GET_MEMBER_PROFIT.HANDLER,
  payload
});

export const getProfitListSuccess = payload => ({
  type: MEMBER_PROFIT.GET_MEMBER_PROFIT.SUCCESS,
  payload
});

export const getProfitListFailure = payload => ({
  type: MEMBER_PROFIT.GET_MEMBER_PROFIT.FAILURE,
  payload
});
