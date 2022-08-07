import AsyncStorage from '@react-native-community/async-storage';

const SUBSCRIPTION_PLAY_KEY = 'IAP_SUBSCRIPTION_PLAN';

const set = async (storageKey: string, value: string) => {
  try {
    await AsyncStorage.setItem(`@${storageKey}`, value.toString());
  } catch (e) {
    console.log('IAPStorage.set(): failed with error: ', e);
  }
};

const get = async (storageKey: string) => {
  try {
    const value = await AsyncStorage.getItem(`@${storageKey}`);
    return value;
  } catch (e) {
    console.log('IAPStorage.get(): failed with error: ', e);
    return e;
  }
};

const remove = async (storageKey: string) => {
  try {
    await AsyncStorage.removeItem(`@${storageKey}`);
  } catch (e) {
    console.log('IAPStorage.remove(): failed with error: ', e);
  }
};

export { set, get, remove };
