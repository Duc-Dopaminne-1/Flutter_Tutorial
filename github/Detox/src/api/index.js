import {getAccessToken} from '../appData/authState/selectors';
import {store} from '../appData/store';
import {getLanguageCode} from '../assets/localize';
import logService from '../service/logService';

function getCommonApiHeaders() {
  const languageCode = getLanguageCode();
  logService.log('getCommonApiHeaders languages==', languageCode);

  const headers = {
    'Accept-Language': languageCode,
  };

  return headers;
}

function getAuthApiHeaders() {
  const state = store.getState();
  const accessToken = getAccessToken(state);
  const headers = {
    ...getCommonApiHeaders(),
    Accept: 'application/json',
    authorization: `Bearer ${accessToken}`,
  };

  return headers;
}

export {getAuthApiHeaders, getCommonApiHeaders};
