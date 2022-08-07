import secureStorage from '../storage/secureStorage';
import logService from './logService';

const KEY_SECURE_USER_INFO = '@SECURE.KEY_SECURE_USER_INFO';
const KEY_CURRENT_USER = '@SECURE.KEY_CURRENT_USER';

const getUserCredentials = async () => {
  try {
    const credentials = await secureStorage.getItem(KEY_SECURE_USER_INFO);

    const {username, password} = credentials || {};
    if (!username || !password) {
      return;
    }

    return JSON.parse(password);
  } catch (error) {
    logService.log('error', error);
  }
};

const setUserCredentials = async authState => {
  try {
    if (!authState) {
      throw Error('STR_KEY_ERROR_INVALID_PARAM');
    }

    const password = JSON.stringify(authState);
    await secureStorage.setItem(KEY_SECURE_USER_INFO, KEY_CURRENT_USER, password);
  } catch (error) {
    logService.log('error', error);
  }
};

const removeUserCredentials = async () => {
  try {
    await secureStorage.removeItem(KEY_SECURE_USER_INFO);
  } catch (error) {
    logService.log('error', error);
  }
};

export {getUserCredentials, removeUserCredentials, setUserCredentials};
