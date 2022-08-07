import AsyncStorage from '@react-native-community/async-storage';

const set = async (storageKey: string, value: string) => {
  try {
    await AsyncStorage.setItem(`@${storageKey}`, value.toString());
  } catch (e) {
    console.log(e);
  }
};

const get = async (storageKey: string) => {
  try {
    const value = await AsyncStorage.getItem(`@${storageKey}`);
    return value;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const remove = async (storageKey: string) => {
  try {
    await AsyncStorage.removeItem(`@${storageKey}`);
  } catch (e) {
    console.log(e);
  }
};

export { set, get, remove };
