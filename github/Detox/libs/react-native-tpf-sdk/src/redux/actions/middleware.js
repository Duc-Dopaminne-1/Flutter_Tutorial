import { MIDDLEWARE } from '../actionsType';

export const toggleSdkState = payload => ({
  type: MIDDLEWARE.TOGGLE_SDK.STORE,
  payload
});

export const setAccountTopenId = payload => ({
  type: MIDDLEWARE.SET_ACCOUNT_TOPENID.STORE,
  payload
});

export const clearAccountTopenId = () => ({
  type: MIDDLEWARE.SET_ACCOUNT_TOPENID.CLEAR
});
