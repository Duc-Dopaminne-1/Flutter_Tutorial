import { TERM_AND_CONDITION } from '../actionsType';

export const getTermAndConditionListHandle = payload => ({
  type: TERM_AND_CONDITION.GET_TERM_AND_CONDITION.HANDLER,
  payload
});

export const getTermAndConditionListSuccess = payload => ({
  type: TERM_AND_CONDITION.GET_TERM_AND_CONDITION.SUCCESS,
  payload
});

export const getTermAndConditionListFailure = payload => ({
  type: TERM_AND_CONDITION.GET_TERM_AND_CONDITION.FAILURE,
  payload
});

export const getPrivacyPolicyHandle = payload => ({
  type: TERM_AND_CONDITION.GET_PRIVACY_POLICY.HANDLER,
  payload
});

export const getPrivacyPolicySuccess = payload => ({
  type: TERM_AND_CONDITION.GET_PRIVACY_POLICY.SUCCESS,
  payload
});

export const getPrivacyPolicyFailure = payload => ({
  type: TERM_AND_CONDITION.GET_PRIVACY_POLICY.FAILURE,
  payload
});
