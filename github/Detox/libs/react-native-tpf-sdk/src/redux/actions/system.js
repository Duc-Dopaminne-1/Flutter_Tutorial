import { SYSTEM } from '../actionsType';

/**
 * ===== Get all system actions =====
 */
export const getShowAlertError = payload => ({
  type: SYSTEM.SHOW_ERROR.STORE,
  payload
});

export const getClearAlertError = () => ({
  type: SYSTEM.CLEAR_ERROR.CLEAR
});
