import AsyncStorage from '@react-native-async-storage/async-storage';

import logService from '../service/logService';

const setItem = async (key, value) => {
  try {
    let savedValue = value;
    if (typeof value === 'boolean') {
      savedValue = value ? 'true' : '';
    }
    await AsyncStorage.setItem(key, savedValue);
  } catch (error) {
    logService.log('error', error);
  }
};

const getItem = async key => {
  try {
    const itemResponse = await AsyncStorage.getItem(key);
    return itemResponse;
  } catch (error) {
    logService.log('error', error);
  }
};

const removeItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    logService.log('error', error);
  }
};

const removeAllItems = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    logService.log('error', error);
  }
};

export default {setItem, getItem, removeItem, removeAllItems};
