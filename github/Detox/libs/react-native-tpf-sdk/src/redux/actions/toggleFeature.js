import { TOOGLE_FEATURE } from '../actionsType';

export const getToggleFeatureHandle = payload => ({
  type: TOOGLE_FEATURE.GET_TOOGLE_FEATURE.HANDLER,
  payload
});

export const getToggleFeatureSuccess = payload => ({
  type: TOOGLE_FEATURE.GET_TOOGLE_FEATURE.SUCCESS,
  payload
});

export const getToggleFeatureFailure = payload => ({
  type: TOOGLE_FEATURE.GET_TOOGLE_FEATURE.FAILURE,
  payload
});
