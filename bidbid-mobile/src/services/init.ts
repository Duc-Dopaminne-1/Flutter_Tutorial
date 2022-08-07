import * as Storage from './storage';
import Config from 'react-native-config';
import { ApiClient } from '@/services/http/client';
import { AUTH_SESSION_KEY, AUTH_SMS_SESSION_KEY, FCM_TOKEN, REFRESH_SESSION_KEY } from '@/constants/app';
import * as Sentry from '@sentry/react-native';
import { isIOS } from '@/shared/devices';
import DeviceInfo from 'react-native-device-info';

class SessionStorage {
  // store key/value pair
  async set(key: string, value: string): Promise<void> {
    value && Storage.set(key, value);
  }

  // get value of
  async get(key: string): Promise<void> {
    return Storage.get(key);
  }

  // delete key
  async remove(key: string): Promise<void> {
    Storage.remove(key);
  }
}

const sessionStorage = new SessionStorage();

type AppInfo = {
  APP_NAME: string;
  APP_BUNDLE_ID: string;
  APP_VERSION: string;
  DEVICE_BRAND: string;
  DEVICE_NAME: string;
  DEVICE_ID: string;
  OS: string;
  OS_VERSION: string;
  USER_AGENT: string;
  PLATFORM: string;
};

const getAppInfo = async (): Promise<AppInfo> => {
  const [APP_NAME, APP_BUNDLE_ID, APP_VERSION, DEVICE_BRAND, DEVICE_NAME, DEVICE_ID, OS, OS_VERSION, USER_AGENT] = await Promise.all([
    DeviceInfo.getApplicationName(),
    DeviceInfo.getBundleId(),
    DeviceInfo.getVersion(),
    DeviceInfo.getBrand(),
    DeviceInfo.getDeviceName(),
    DeviceInfo.getDeviceId(),
    DeviceInfo.getSystemName(),
    DeviceInfo.getSystemVersion(),
    DeviceInfo.getUserAgent(),
  ]);
  const PLATFORM = isIOS ? 'ios' : 'android';
  return {
    APP_NAME,
    APP_BUNDLE_ID,
    APP_VERSION,
    DEVICE_BRAND,
    DEVICE_NAME,
    DEVICE_ID,
    PLATFORM,
    OS,
    OS_VERSION,
    USER_AGENT,
  };
};

const initSentry = async () => {
  const appInfo = await getAppInfo();
  Sentry.configureScope(scope => {
    scope.setTags({
      appName: appInfo.APP_NAME,
      appVersion: appInfo.APP_VERSION,
      deviceName: appInfo.DEVICE_NAME,
      OS: appInfo.OS,
      OS_Version: appInfo.OS_VERSION,
      userAgent: appInfo.USER_AGENT,
      platform: appInfo.PLATFORM,
    });
  });
  Sentry.setTag('team', 'FE');
  Sentry.setUser(null);
};

export const initApp = async (baseUrl = '') => {
  const config = {
    baseUrl: baseUrl ? baseUrl : Config.BASE_URL,
    socketUrl: Config.SOCKET_URL,
    AUTH_SESSION_KEY: AUTH_SESSION_KEY,
    AUTH_SMS_SESSION_KEY: AUTH_SMS_SESSION_KEY,
    REFRESH_SESSION_KEY: REFRESH_SESSION_KEY,
    session: sessionStorage,
    FCM_TOKEN: FCM_TOKEN,
  };
  ApiClient.setApiConfig(config);
  await initSentry();
};
