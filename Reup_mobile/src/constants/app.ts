import DeviceInfo from 'react-native-device-info';
import { PlatForm } from '@reup/reup-api-sdk/libs/type';
import { isAndroid } from '@src/utils';
import { Platform } from 'react-native';

export const APP_VERSION = DeviceInfo.getVersion();
export const VERSION_DEVICE_LOGIN_APPLE = 13;
export const VERSION_DEVICE_SIGN_UP_APPLE = 13.2;
export const AUTH_REQUIRE = false;
export const VERSION_CHECK = true;
export const DEVICE_NAME = DeviceInfo.getDeviceName();
export const VERSION_DEVICE = parseFloat(DeviceInfo.getSystemVersion());
export const DEVICE_ID = DeviceInfo.getDeviceId();
export const PLATFORM = Platform.OS === 'ios' ? PlatForm.IOS : PlatForm.ANDDROID;

export const ENV = {
  MANAGER_PROD: 'MANAGER_PROD',
  MANAGER_DEV: 'MANAGER_DEV',
  TENANT_PROD: 'TENANT_PROD',
  TENANT_DEV: 'TENANT_DEV'
};

export const API_TOKEN_EXPIRATION = 60 * 60; // 60*60 seconds ~ 1 hour
export const FirebaseWebClientId = '832028915191-pcdtbi5rp1rqbus2g81uugeusv4fblms.apps.googleusercontent.com';
