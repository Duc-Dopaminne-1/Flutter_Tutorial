import * as Keychain from 'react-native-keychain';

import logService from '../service/logService';

const setItem = async (key: string, type: string = '', value: string = '') => {
  try {
    await Keychain.setInternetCredentials(key, type, value);
  } catch (error) {
    logService.log('error', error);
  }
};

const getItem = async key => {
  try {
    const itemResponse = await Keychain.getInternetCredentials(key);
    return itemResponse;
  } catch (error) {
    logService.log('error', error);
  }
};

const removeItem = async key => {
  try {
    await Keychain.resetInternetCredentials(key);
  } catch (error) {
    logService.log('error', error);
  }
};

export default {setItem, getItem, removeItem};
