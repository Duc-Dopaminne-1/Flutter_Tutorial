import * as Storage from '@utils/storage';
import { ApiClient, api } from '@goldfishcode/noir-caesar-api-sdk';
import { Platform, Settings } from 'react-native';
import { APP_VERSION as APP_VERSION_STRING } from '@constants/app';
import { ApiConfiguration } from '@goldfishcode/noir-caesar-api-sdk/libs/http/config';
import DeviceInfo from 'react-native-device-info';
import { IStartup } from '@goldfishcode/noir-caesar-api-sdk/libs/api/startup/index';
import NetInfo from '@react-native-community/netinfo';
import { PlatForm } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import logger from '@src/utils/logger';
import versionCheck from '@utils/versionCheck';

const settingKeys: string[] = [];

const getSettings = (): any => {
  if (Platform.OS === 'android') return {};
  settingKeys.reduce((settings: any, key: string) => {
    return {
      ...settings,
      [key]: Settings.get(key),
    };
  }, {});
  return {};
};

const getNetworkType = async () => {
  const state = await NetInfo.fetch();
  return state.type;
};

class SessionStorage {
  // Store key/value pair
  async set(key: string, value: string): Promise<void> {
    await Storage.set(key, value);
  }

  // Get value of
  async get(key: string): Promise<string> {
    const value = await Storage.get(key);
    return value || '';
  }

  // Delete key
  async remove(key: string): Promise<void> {
    await Storage.remove(key);
  }
}

interface AppInfo {
  APP_NAME: string;
  APP_BUNDLE_ID: string;
  APP_VERSION: string;
  DEVICE_BRAND: string;
  DEVICE_NAME: string;
  DEVICE_ID: string;
  OS: string;
  OS_VERSION: string;
  NETWORK_TYPE: string;
  USER_AGENT: string;
  PLATFORM: string;
}

const getAppInfo = async (): Promise<AppInfo> => {
  const [
    APP_NAME,
    APP_BUNDLE_ID,
    APP_VERSION,
    DEVICE_BRAND,
    DEVICE_NAME,
    DEVICE_ID,
    OS,
    OS_VERSION,
    USER_AGENT,
    NETWORK_TYPE,
  ] = await Promise.all([
    DeviceInfo.getApplicationName(),
    DeviceInfo.getBundleId(),
    DeviceInfo.getVersion(),
    DeviceInfo.getBrand(),
    DeviceInfo.getDeviceName(),
    DeviceInfo.getDeviceId(),
    DeviceInfo.getSystemName(),
    DeviceInfo.getSystemVersion(),
    DeviceInfo.getUserAgent(),
    getNetworkType(),
  ]);
  const PLATFORM = Platform.OS === 'ios' ? PlatForm.IOS : PlatForm.ANDDROID;
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
    NETWORK_TYPE,
  };
};

export const getUserAgent = (appInfo: AppInfo): string => {
  return `${appInfo.APP_NAME}/${appInfo.APP_BUNDLE_ID}/${appInfo.APP_VERSION} ${appInfo.DEVICE_BRAND}/${appInfo.OS}/${appInfo.OS_VERSION} ${appInfo.NETWORK_TYPE}`;
};

const init = async () => {
  try {
    const appInfo = await getAppInfo();
    const sessionStorage = new SessionStorage();
    const config: ApiConfiguration = {
      baseUrl: 'https://noir-caesar-api.dev.goldfishcode.com/v1',
      socketUrl: 'http://noir-caesar-ws.dev.goldfishcode.com',
      AUTH_SESSION_KEY: 'AUTH_SESSION_KEY',
      session: sessionStorage,
      deviceId: appInfo.DEVICE_ID,
    };
    ApiClient.setApiConfig(config);
    const result: IStartup = await api.Startup.get();
    return {
      ...getSettings(),
      ...result,
      appInfo,
      supported: versionCheck(APP_VERSION_STRING, result.update.minimal_version),
      newVersion: versionCheck(result.update.current_version, APP_VERSION_STRING, false),
    };
  } catch (error) {
    logger.log('Startup init app error', error);
    return {
      supported: true,
      newVersion: false,
    };
  }
};

export default init;
