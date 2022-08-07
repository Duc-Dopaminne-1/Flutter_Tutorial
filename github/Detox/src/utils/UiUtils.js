import {Linking} from 'react-native';

import logService from '../service/logService';

const {COLORS} = require('../assets/theme/colors');

export const getColorStyleTextEditable = editable => {
  return editable ? {color: COLORS.TEXT_DARK_10} : {color: COLORS.TEXT_DARK_40};
};

export const redirectToURL = async url => {
  // Checking if the link is supported for links with custom URL scheme.
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(url);
  } else {
    logService.log(`Don't know how to open this URL: ${url}`);
  }
};

export const getHeaderLimited = (text, maxLength) => {
  return `${text ? String(text).length : 0}/${maxLength}`;
};
