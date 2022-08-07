import logService from '../../service/logService';
import {removeUserCredentials, setUserCredentials} from '../../service/secureData';
import * as actionCreators from './actions';

export const setAuthState = authState => {
  return async function (dispatch) {
    try {
      await setUserCredentials(authState);
    } catch (error) {
      logService.log('error setAuthState=', error);
    }
    dispatch(actionCreators.update(authState));
  };
};

export const clearAuthState = () => {
  return async function (dispatch) {
    logService.log('clear setAuthState=');

    try {
      await removeUserCredentials();
    } catch (error) {
      logService.log('error setAuthState=', error);
    }

    dispatch(actionCreators.clear());
  };
};
