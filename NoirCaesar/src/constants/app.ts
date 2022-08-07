import DeviceInfo from 'react-native-device-info';
import { PlatForm } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { Platform } from 'react-native';

export const APP_VERSION = DeviceInfo.getVersion();
export const VERSION_DEVICE_LOGIN_APPLE = 13;
export const AUTH_REQUIRE = false;
export const VERSION_CHECK = true;
export const DEVICE_NAME = DeviceInfo.getDeviceName();
export const VERSION_DEVICE = parseInt(DeviceInfo.getSystemVersion().split('.')[0]);
export const DEVICE_ID = DeviceInfo.getDeviceId();
export const PLATFORM = Platform.OS === 'ios' ? PlatForm.IOS : PlatForm.ANDDROID;

export const API_TOKEN_EXPIRATION = 60 * 60; // 60*60 seconds ~ 1 hour
export const FirebaseWebClientId = '416792283902-niarsbm6k01a26ak8o5sc7251j03f0b0.apps.googleusercontent.com';

export enum TagMenuItem {
  buycoin,
  messaging,
  subscription,
  orders,
  blog,
  notifications,
  rate_this_app,
  about,
  terms_of_service,
  copyright,
  logout,
}

export interface MenuItem {
  title: string;
  isSwitch: boolean;
  tag: TagMenuItem;
}

export const listMenu: Array<MenuItem> = [
  {
    title: 'Buy Coins',
    isSwitch: false,
    tag: TagMenuItem.buycoin,
  },
  {
    title: 'Messaging',
    isSwitch: false,
    tag: TagMenuItem.messaging,
  },
  {
    title: 'Subscription',
    isSwitch: false,
    tag: TagMenuItem.subscription,
  },
  {
    title: 'Orders',
    isSwitch: false,
    tag: TagMenuItem.orders,
  },
  {
    title: 'Blog',
    isSwitch: false,
    tag: TagMenuItem.blog,
  },
  {
    title: 'Notifications',
    isSwitch: true,
    tag: TagMenuItem.notifications,
  },
  {
    title: 'Rate This App',
    isSwitch: false,
    tag: TagMenuItem.rate_this_app,
  },
  {
    title: 'About',
    isSwitch: false,
    tag: TagMenuItem.about,
  },
  {
    title: 'Terms of Service',
    isSwitch: false,
    tag: TagMenuItem.terms_of_service,
  },
  {
    title: 'Copyright',
    isSwitch: false,
    tag: TagMenuItem.copyright,
  },
  {
    title: 'Logout',
    isSwitch: false,
    tag: TagMenuItem.logout,
  },
];
