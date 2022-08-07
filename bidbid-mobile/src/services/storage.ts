import AsyncStorage from '@react-native-async-storage/async-storage';

const set: (storageKey: string, value: string) => Promise<any> = async (storageKey: string, value: string) => {
  try {
    await AsyncStorage.setItem(`@${storageKey}`, value.toString());
  } catch (e) {}
};

const get: (storageKey: string) => Promise<any> = async (storageKey: string) => {
  try {
    return await AsyncStorage.getItem(`@${storageKey}`);
  } catch (e) {
    return '';
  }
};

const remove: (storageKey: string) => Promise<any> = async (storageKey: string) => {
  try {
    await AsyncStorage.removeItem(`@${storageKey}`);
  } catch (e) {}
};

export { set, get, remove };
