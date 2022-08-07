import {Linking} from 'react-native';

import {EMPTY_STRING} from '../assets/constants';
import Configs from '../configs';
import logService from '../service/logService';

const getValidUrl = url => {
  let validUrl = null;

  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    validUrl = url;
  }

  return validUrl;
};

const INVALID_URL = 'Invalid url';

const openUrl = (url, handleError) => {
  return Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        return Promise.reject(INVALID_URL);
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(err => {
      if (handleError) {
        handleError(err);
        return;
      }

      //ignore error
      logService.log('Error===', err);
    });
};

const getFileNameFromUrl = url => {
  const validUrl = getValidUrl(url);
  if (validUrl) {
    return decodeURIComponent(url.split('/').pop().replace(/\+/g, ' '));
  }
  return EMPTY_STRING;
};

const getAbsoluteUrl = url => {
  //handle for relative url
  let evaluatedUrl = url;
  if (url && url.startsWith('/')) {
    evaluatedUrl = Configs.portal.PORTAL_URL + url;
  }
  return evaluatedUrl;
};

export default {
  getValidUrl,
  openUrl,
  getFileNameFromUrl,
  getAbsoluteUrl,
};
