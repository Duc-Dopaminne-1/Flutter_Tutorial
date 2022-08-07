import { PermissionsAndroid, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
const majorVersionIOS = parseInt(String(Platform.Version), 10);
export const isAutoFillSupported = Platform.OS === 'ios' && majorVersionIOS >= 12;
export const isIphoneX = Platform.OS === 'ios' && DeviceInfo.hasNotch();

// check Permission ANDROID < 10
export const requestPermissionAndroid = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  );
  return new Promise((resolve, reject) => {
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

export default { isAutoFillSupported, isIphoneX };
