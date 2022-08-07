import { Platform } from 'react-native';

export const devices = {
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
};
